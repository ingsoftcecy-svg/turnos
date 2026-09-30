import { useState, useEffect } from 'react';
import type { ShiftEntry } from '../types';

export const createEmptyEntry = (date: string): ShiftEntry => ({
  id: crypto.randomUUID(),
  date,
  shift: "1",
  owner: "",
  fallaEquipos: "",
  fallasExternas: "",
  precursores: "",
  acumulado: "",
  colorTanks: [{ id: crypto.randomUUID(), brand: "", v1: "", v2: "" }, { id: crypto.randomUUID(), brand: "", v1: "", v2: "" }],
  colorExtra1: "",
  colorExtra2: "",
  tiempoResidencia: "",
  tiempoFiltracion: "",
  emoTanks: [{ id: crypto.randomUUID(), brand: "", v1: "", v2: "", v3: "", v4: "" }],
  volumenMosto: "",
  hld: "",
  faltas: "",
  tiempoExtra: "",
  ato: ""
});

const PROJECT_ID = "entregaturno";
const COLLECTION = "ENTREGAS_TURNO";

// Ayudante para extraer valores de Firestore (stringValue, integerValue, etc)
const parseFirestoreValue = (val: any): any => {
    if (!val) return "";
    if (val.stringValue !== undefined) return val.stringValue;
    if (val.integerValue !== undefined) return val.integerValue;
    if (val.doubleValue !== undefined) return val.doubleValue;
    if (val.booleanValue !== undefined) return val.booleanValue;
    if (val.arrayValue !== undefined) {
        return (val.arrayValue.values || []).map(parseFirestoreValue);
    }
    if (val.mapValue !== undefined) {
        const result: any = {};
        for (const k in val.mapValue.fields) {
            result[k] = parseFirestoreValue(val.mapValue.fields[k]);
        }
        return result;
    }
    return "";
};

// Convierte fechas de Excel como "25-sep" a "YYYY-MM-DD" para el input type="date"
const parseExcelDate = (raw: string): string => {
    if (!raw) return "";
    raw = raw.trim();
    // Si ya viene como YYYY-MM-DD
    if (raw.match(/^\d{4}-\d{2}-\d{2}$/)) return raw;
    
    // Si es un número serial de Excel (ej: 45000)
    if (/^\d+$/.test(raw)) {
        const serial = parseInt(raw, 10);
        // Excel serial date to JS date
        const date = new Date(Math.round((serial - 25569) * 86400 * 1000));
        if (!isNaN(date.getTime())) {
            return date.toISOString().split('T')[0];
        }
    }
    
    // Si viene como "25-sep" o "25 sep" o "25/sep"
    const match = raw.match(/^(\d{1,2})[-/ ]+([a-zA-Z]+)/);
    if (match) {
        const day = match[1].padStart(2, '0');
        const monthStr = match[2].toLowerCase();
        const months: Record<string, string> = {
            'ene': '01', 'feb': '02', 'mar': '03', 'abr': '04', 'may': '05', 'jun': '06',
            'jul': '07', 'ago': '08', 'sep': '09', 'oct': '10', 'nov': '11', 'dic': '12'
        };
        const month = months[monthStr.substring(0,3)] || '01';
        return `2026-${month}-${day}`; 
    }
    
    // Si viene como "25/09" o "25/09/2026"
    const matchSlash = raw.match(/^(\d{1,2})\/(\d{1,2})(?:\/(\d{2,4}))?/);
    if (matchSlash) {
        const day = matchSlash[1].padStart(2, '0');
        const month = matchSlash[2].padStart(2, '0');
        let year = matchSlash[3] || '2026';
        if (year.length === 2) year = `20${year}`;
        return `${year}-${month}-${day}`;
    }

    return raw; // Fallback
};

export function useDashboard() {
  const [entries, setEntries] = useState<ShiftEntry[]>([]);
  const [loading, setLoading] = useState(true);

  // 1. CARGAR DATOS DESDE FIREBASE
  useEffect(() => {
    const fetchEntries = async () => {
      try {
        let allDocs: any[] = [];
        let pageToken = "";
        
        // Bucle para traer TODAS las páginas de Firebase (en caso de que sean más de 1000 turnos)
        do {
            const url = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/${COLLECTION}?pageSize=1000${pageToken ? '&pageToken=' + pageToken : ''}`;
            const res = await fetch(url);
            if (!res.ok) throw new Error("Error fetching data");
            const data = await res.json();
            
            if (data.documents) {
                allDocs = allDocs.concat(data.documents);
            }
            pageToken = data.nextPageToken || "";
        } while (pageToken);

        if (allDocs.length === 0) {
            setEntries([]);
            setLoading(false);
            return;
        }

        const loadedEntries: ShiftEntry[] = allDocs.map((doc: any) => {
            const fields = doc.fields;
            const parsed: any = {};
            for (const k in fields) {
                parsed[k] = parseFirestoreValue(fields[k]);
            }
            
            // Forzar arrays si no vienen en Firebase
            if (!parsed.colorTanks) parsed.colorTanks = [];
            if (!parsed.emoTanks) parsed.emoTanks = [];
            
            // Compatibilidad con datos históricos o subidos por Excel que usan "tank" y "value"
            parsed.colorTanks = parsed.colorTanks.map((t: any) => ({
                ...t,
                v1: t.v1 !== undefined && t.v1 !== "" ? t.v1 : t.tank || '',
                v2: t.v2 !== undefined && t.v2 !== "" ? t.v2 : t.value || ''
            }));
            parsed.emoTanks = parsed.emoTanks.map((t: any) => ({
                ...t,
                v1: t.v1 !== undefined && t.v1 !== "" ? t.v1 : t.tank || '',
                v2: t.v2 !== undefined && t.v2 !== "" ? t.v2 : t.value || ''
            }));
            
            // Arreglar la fecha
            if (parsed.date) {
                parsed.date = parseExcelDate(parsed.date);
            }

            return parsed as ShiftEntry;
        });

        // Ordenar por fecha y luego turno
        loadedEntries.sort((a, b) => {
            if (a.date !== b.date) return a.date.localeCompare(b.date);
            return String(a.shift).localeCompare(String(b.shift));
        });

        setEntries(loadedEntries);
      } catch (err) {
        console.error("Error cargando turnos de Firebase:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEntries();
  }, []);

  const saveEntry = async (entry: ShiftEntry) => {
    // Optimistic update
    setEntries(prev => {
      const idx = prev.findIndex(e => e.id === entry.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = entry;
        return copy;
      }
      return [...prev, entry];
    });

    try {
      const serializeToFirestore = (obj: any): any => {
        const fields: any = {};
        for (const key in obj) {
          if (key === 'id') continue;
          const val = obj[key];
          if (typeof val === 'string') fields[key] = { stringValue: val };
          else if (typeof val === 'number') fields[key] = { doubleValue: val };
          else if (typeof val === 'boolean') fields[key] = { booleanValue: val };
          else if (Array.isArray(val)) {
            fields[key] = { arrayValue: { values: val.map(item => ({ mapValue: { fields: serializeToFirestore(item).fields } })) } };
          }
        }
        return { fields };
      };

      const docData = serializeToFirestore(entry);
      await fetch(`https://firestore.googleapis.com/v1/projects/entregaturno/databases/(default)/documents/ENTREGAS_TURNO/${entry.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(docData)
      });
    } catch (e) {
      console.error("Error guardando en Firestore:", e);
    }
  };

  const deleteEntry = async (id: string) => {
    setEntries(prev => prev.filter(e => e.id !== id));
    try {
      await fetch(`https://firestore.googleapis.com/v1/projects/entregaturno/databases/(default)/documents/ENTREGAS_TURNO/${id}`, {
        method: 'DELETE'
      });
    } catch (e) {
      console.error("Error borrando en Firestore:", e);
    }
  };

  return {
    entries,
    saveEntry,
    deleteEntry,
    loading
  };
}
