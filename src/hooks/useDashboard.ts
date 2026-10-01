import { useState, useEffect } from 'react';
import type { ShiftEntry } from '../types';
import { parseFirestoreValue, parseExcelDate, serializeToFirestore } from '../utils/firestoreSerializer';

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

export function useDashboard() {
  const [entries, setEntries] = useState<ShiftEntry[]>([]);
  const [loading, setLoading] = useState(true);

  // 1. CARGAR DATOS DESDE FIREBASE
  useEffect(() => {
    const fetchEntries = async () => {
      try {
        let allDocs: any[] = [];
        let pageToken = "";
        
        // Bucle para traer TODAS las páginas de Firebase
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
      const docData = serializeToFirestore(entry);
      await fetch(`https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/${COLLECTION}/${entry.id}`, {
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
      await fetch(`https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/${COLLECTION}/${id}`, {
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
