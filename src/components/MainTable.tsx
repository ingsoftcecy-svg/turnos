import { useState, useMemo, useEffect } from 'react';
import { Trash2, ChevronDown, ChevronRight, Settings, Eye, EyeOff } from 'lucide-react';
import { useDashboard } from '../hooks/useDashboard';
import type { ShiftEntry, TankMeasurement, EMOMeasurement } from '../types';

const COLOR_SPECS: Record<string, [number, number]> = {
  'BUD LIGHT': [6.02, 6.6],
  'CLSH': [7.13, 7.54],
  'CORONA': [5.44, 5.78],
  'CORONA E-P': [5.44, 5.78],
  'ESTRELLA': [7.43, 7.75],
  'MICHELOB ULTRA': [4.82, 5.25],
  'MODELO': [9.15, 9.48],
  'NEGRA MODELO': [25.84, 28.35],
  'PACIFICO': [6.10, 6.43],
  'VICTORIA': [16.12, 18.64],
  'MODELO PURA MALTA': [6.60, 7.40],
  'BUDWEISER': [4.66, 4.95],
  'GOLDEN LIGHT': [5.35, 6.35],
  'FLYING FISH': [4.85, 5.65],
  'NEGRA CHOCOLATE': [27.4, 35.59],
  'PACIFICO LIGHT': [6.7, 8.2],
  'PACIFICO SUAVE': [7.5, 11.5]
};

const P_SPECS: Record<string, [number, number]> = {
  'BUD LIGHT': [17.75, 18.25],
  'CLSH': [17.75, 18.25],
  'CORONA': [17.75, 18.25],
  'CORONA E-P': [17.75, 18.25],
  'ESTRELLA': [17.75, 18.25],
  'MICHELOB ULTRA': [15.55, 16.05],
  'MODELO': [17.75, 18.25],
  'NEGRA MODELO': [16.05, 16.55],
  'PACIFICO': [17.75, 18.25],
  'VICTORIA': [17.75, 18.25],
  'MODELO PURA MALTA': [13.25, 13.75],
  'BUDWEISER': [15.50, 16.50],
  'GOLDEN LIGHT': [16.05, 16.55],
  'FLYING FISH': [14.0, 14.0],
  'NEGRA CHOCOLATE': [17.75, 18.25],
  'PACIFICO LIGHT': [13.75, 14.25],
  'PACIFICO SUAVE': [16.65, 17.25]
};

const normalizeBrand = (brand: string) => {
  const b = brand.toLowerCase().trim();
  if (b.includes('michelob')) return 'MICHELOB ULTRA';
  if (b.includes('negra mod') || b.includes('nrgra mod')) return 'NEGRA MODELO';
  if (b.includes('chocolate')) return 'NEGRA CHOCOLATE';
  if (b.includes('pura malta')) return 'MODELO PURA MALTA';
  if (b.includes('modelo es') || b === 'modelo' || b === 'modelo e') return 'MODELO';
  if (b.includes('corona e-p')) return 'CORONA E-P';
  if (b.includes('corona')) return 'CORONA';
  if (b.includes('bud light')) return 'BUD LIGHT';
  if (b.includes('budweiser')) return 'BUDWEISER';
  if (b.includes('pacifico sl') || b.includes('pacifico suave')) return 'PACIFICO SUAVE';
  if (b.includes('pacifico l')) return 'PACIFICO LIGHT';
  if (b.includes('pacifico')) return 'PACIFICO';
  if (b.includes('victoria')) return 'VICTORIA';
  if (b.includes('estrella')) return 'ESTRELLA';
  if (b.includes('golden')) return 'GOLDEN LIGHT';
  if (b.includes('flying')) return 'FLYING FISH';
  if (b.includes('clsh')) return 'CLSH';
  return b.toUpperCase();
};

const getColorForSpec = (brand: string, valueStr: string) => {
  if (!valueStr || valueStr.trim() === '') return '#000';
  const val = parseFloat(valueStr.replace(',', '.'));
  if (isNaN(val)) return '#000';
  if (!brand || brand.trim() === '') return '#000';
  
  const normBrand = normalizeBrand(brand);
  const spec = COLOR_SPECS[normBrand];
  
  // Si no hay especificación, por defecto negro para no dar falsos positivos
  if (!spec) return '#000'; 
  
  if (val >= spec[0] && val <= spec[1]) {
    return '#00a651'; // Verde (en rango)
  } else {
    return '#ed1c24'; // Rojo (fuera de rango)
  }
};

const getColorForSpecP = (brand: string, valueStr: string) => {
  if (!valueStr || valueStr.trim() === '') return '#000';
  const val = parseFloat(valueStr.replace(',', '.'));
  if (isNaN(val)) return '#000';
  if (!brand || brand.trim() === '') return '#000';
  
  const normBrand = normalizeBrand(brand);
  const spec = P_SPECS[normBrand];
  
  // Si no hay especificación, por defecto negro para no dar falsos positivos
  if (!spec) return '#000'; 
  
  if (val >= spec[0] && val <= spec[1]) {
    return '#00a651'; // Verde (en rango)
  } else {
    return '#ed1c24'; // Rojo (fuera de rango)
  }
};

export function MainTable({ dashboard }: { dashboard: ReturnType<typeof useDashboard> }) {
  const { entries, saveEntry, deleteEntry, loading } = dashboard;
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});
  const [isConfigMode, setIsConfigMode] = useState(false);
  const [hiddenGroups, setHiddenGroups] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('hiddenWeeks');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const toggleHideGroup = (groupKey: string) => {
    setHiddenGroups(prev => {
      const next = { ...prev, [groupKey]: !prev[groupKey] };
      localStorage.setItem('hiddenWeeks', JSON.stringify(next));
      return next;
    });
  };

  // Función para obtener la semana del año (ISO week) o algo más legible
  const getGroupKey = (dateStr: string) => {
    if (!dateStr) return 'Sin Fecha';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return 'Fechas Inválidas';
    
    // Meses en español
    const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    const month = monthNames[d.getUTCMonth()];
    const year = d.getUTCFullYear();
    
    // Semana del mes (1 a 5)
    const date = d.getUTCDate();
    const weekOfMonth = Math.ceil(date / 7);
    
    // Formato: "Semana 1 - Septiembre 2026"
    return `Semana ${weekOfMonth} - ${month} ${year}`;
  };

  // Agrupar entradas por fecha
  const groupedEntries = useMemo(() => {
    const groups: Record<string, ShiftEntry[]> = {};
    entries.forEach(entry => {
      const key = getGroupKey(entry.date);
      if (!groups[key]) groups[key] = [];
      groups[key].push(entry);
    });
    return groups;
  }, [entries]);

  // Lista de meses disponibles para el filtro (ej. "Septiembre 2026")
  const availableMonths = useMemo(() => {
    const months = new Set<string>();
    Object.keys(groupedEntries).forEach(key => {
      const parts = key.split(' - ');
      if (parts.length > 1) months.add(parts[1]);
    });
    return Array.from(months);
  }, [groupedEntries]);

  const [filterMonth, setFilterMonth] = useState<string>("all");

  // Al cargar los meses, seleccionar el más reciente por defecto (si hay) para no mostrar todos
  useEffect(() => {
    if (availableMonths.length > 0 && filterMonth === "all") {
      setFilterMonth(availableMonths[availableMonths.length - 1]);
    }
  }, [availableMonths, filterMonth]);

  // Al cargar, abrir por defecto el último grupo de ese mes si hay
  useEffect(() => {
    if (entries.length > 0 && Object.keys(expandedGroups).length === 0) {
      const keys = Object.keys(groupedEntries);
      if (keys.length > 0) {
        const lastKey = keys[keys.length - 1]; 
        setExpandedGroups({ [lastKey]: true });
      }
    }
  }, [groupedEntries, entries.length]);

  const toggleGroup = (key: string) => {
    setExpandedGroups(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleUpdate = (id: string, field: keyof ShiftEntry, value: any) => {
    const entry = entries.find(e => e.id === id);
    if (entry) {
      saveEntry({ ...entry, [field]: value });
    }
  };

  const handleColorUpdate = (id: string, tankIndex: number, field: keyof TankMeasurement, value: string) => {
    const entry = entries.find(e => e.id === id);
    if (entry) {
      const newTanks = [...entry.colorTanks];
      if (!newTanks[tankIndex]) {
        newTanks[tankIndex] = { id: crypto.randomUUID(), brand: '', v1: '', v2: '' };
      }
      newTanks[tankIndex] = { ...newTanks[tankIndex], [field]: value };
      saveEntry({ ...entry, colorTanks: newTanks });
    }
  };

  const handleEmoUpdate = (id: string, tankIndex: number, field: keyof EMOMeasurement, value: string) => {
    const entry = entries.find(e => e.id === id);
    if (entry) {
      const newTanks = [...entry.emoTanks];
      if (!newTanks[tankIndex]) {
        newTanks[tankIndex] = { id: crypto.randomUUID(), brand: '', v1: '', v2: '', v3: '', v4: '' };
      }
      newTanks[tankIndex] = { ...newTanks[tankIndex], [field]: value };
      saveEntry({ ...entry, emoTanks: newTanks });
    }
  };

  const addNewRow = () => {
    const today = new Date().toISOString().split('T')[0];
    const newEntry: ShiftEntry = {
      id: crypto.randomUUID(),
      date: today,
      shift: '1',
      owner: '',
      fallaEquipos: '0',
      fallasExternas: '0',
      precursores: '0',
      acumulado: '',
      colorTanks: [
        { id: crypto.randomUUID(), brand: '', v1: '', v2: '' },
        { id: crypto.randomUUID(), brand: '', v1: '', v2: '' }
      ],
      colorExtra1: '',
      colorExtra2: '',
      tiempoResidencia: '',
      tiempoFiltracion: '',
      emoTanks: [
        { id: crypto.randomUUID(), brand: '', v1: '', v2: '', v3: '', v4: '' }
      ],
      volumenMosto: '',
      hld: '',
      faltas: '',
      tiempoExtra: '',
      ato: ''
    };
    saveEntry(newEntry);
    
    // Asegurarse que el grupo de la fecha actual se abra y el mes se muestre
    const key = getGroupKey(today);
    const mYear = key.split(' - ')[1];
    if (mYear) setFilterMonth(mYear);
    setExpandedGroups(prev => ({ ...prev, [key]: true }));
  };

  if (loading) {
    return <div style={{ padding: '20px', color: '#fff' }}>Cargando miles de datos históricos desde Firebase, un momento por favor...</div>;
  }

  return (
    <div className="data-table-wrapper" style={{ paddingBottom: '50px', width: '100%' }}>
      <style>
        {`
          input[type="date"]::-webkit-inner-spin-button,
          input[type="date"]::-webkit-calendar-picker-indicator {
              display: none;
              -webkit-appearance: none;
          }
          .data-table-wrapper input {
              font-family: inherit;
              font-weight: 600;
              font-size: 13px;
          }
          .data-table-wrapper th {
              font-weight: 700 !important;
          }
        `}
      </style>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={addNewRow} style={{ padding: '10px 20px', backgroundColor: '#000', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
            + Agregar Fila de Turno
          </button>
          
          <button 
            onClick={() => setIsConfigMode(!isConfigMode)} 
            style={{ 
              padding: '10px 15px', 
              backgroundColor: isConfigMode ? '#e74c3c' : '#333', 
              color: '#fff', 
              border: 'none', 
              borderRadius: '4px', 
              cursor: 'pointer', 
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              gap: '5px'
            }}
          >
            <Settings size={16} /> CONFIGURAR TABLA
          </button>
        </div>
        
        {availableMonths.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <label style={{ fontWeight: 'bold', fontSize: '14px', textTransform: 'uppercase' }}>Filtro de Mes:</label>
            <select 
              value={filterMonth} 
              onChange={e => setFilterMonth(e.target.value)}
              style={{ padding: '8px 12px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '14px', outline: 'none', fontWeight: 'bold' }}
            >
              <option value="all">Ver todos los meses (Histórico Completo)</option>
              {availableMonths.map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div style={{ backgroundColor: '#fff', padding: '0', overflowX: 'auto', borderRadius: '4px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: '2050px', tableLayout: 'fixed' }}>
          <colgroup>
            <col style={{ width: '120px' }} /> {/* Fecha */}
            <col style={{ width: '60px' }} />  {/* Turno */}
            <col style={{ width: '180px' }} /> {/* Responsable */}
            <col style={{ width: '70px' }} />  {/* Falla eq */}
            <col style={{ width: '70px' }} />  {/* Fallas ext */}
            <col style={{ width: '70px' }} />  {/* Precursores */}
            <col style={{ width: '70px' }} />  {/* Acumulado */}
            {/* COLOR */}
            <col style={{ width: '110px' }} /> {/* C_T1 Brand */}
            <col style={{ width: '50px' }} />  {/* C_T1 V1 */}
            <col style={{ width: '50px' }} />  {/* C_T1 V2 */}
            <col style={{ width: '110px' }} /> {/* C_T2 Brand */}
            <col style={{ width: '50px' }} />  {/* C_T2 V1 */}
            <col style={{ width: '50px' }} />  {/* C_T2 V2 */}
            {/* Tiempos */}
            <col style={{ width: '70px' }} />  {/* Residencia */}
            <col style={{ width: '70px' }} />  {/* Filtracion */}
            {/* EMO */}
            <col style={{ width: '110px' }} /> {/* E_T1 Brand */}
            <col style={{ width: '50px' }} />  {/* E_T1 V1 */}
            <col style={{ width: '50px' }} />  {/* E_T1 V2 */}
            <col style={{ width: '110px' }} /> {/* E_T2 Brand */}
            <col style={{ width: '50px' }} />  {/* E_T2 V1 */}
            <col style={{ width: '50px' }} />  {/* E_T2 V2 */}
            {/* Finales */}
            <col style={{ width: '70px' }} />  {/* Vol Mosto */}
            <col style={{ width: '70px' }} />  {/* HLD */}
            <col style={{ width: '70px' }} />  {/* Faltas */}
            <col style={{ width: '70px' }} />  {/* T Extra */}
            <col style={{ width: '70px' }} />  {/* ATO */}
            {isConfigMode && <col style={{ width: '40px' }} />}
          </colgroup>
          <thead style={{ textTransform: 'uppercase' }}>
            {/* ROW 1: TITULO GIGANTE AMARILLO (Estilo Farol) */}
            <tr>
              {isConfigMode && <th style={{ backgroundColor: '#fff', border: 'none' }}></th>}
            </tr>
            {/* ROW 2: CABECERAS */}
            <tr style={{ borderBottom: '2px solid #d3a13b' }}>
              <th style={{ backgroundColor: '#000', color: '#fff', padding: '10px', border: '1px solid #333' }}>FECHA</th>
              <th style={{ backgroundColor: '#000', color: '#fff', padding: '10px', border: '1px solid #333' }}>TURNO</th>
              <th style={{ backgroundColor: '#000', color: '#fff', padding: '10px', border: '1px solid #333' }}>Responsable de turno</th>
              
              <th style={{ background: 'linear-gradient(180deg, #e8c678 0%, #d3a13b 100%)', color: '#000', padding: '5px', border: '1px solid #b8860b', fontSize: '11px' }}>Falla de equipos (# de eventos)</th>
              <th style={{ background: 'linear-gradient(180deg, #e8c678 0%, #d3a13b 100%)', color: '#000', padding: '5px', border: '1px solid #b8860b', fontSize: '11px' }}>Fallas externas</th>
              <th style={{ background: 'linear-gradient(180deg, #e8c678 0%, #d3a13b 100%)', color: '#000', padding: '5px', border: '1px solid #b8860b', fontSize: '11px' }}>Precursores de incidentes de proceso (#)</th>
              <th style={{ background: 'linear-gradient(180deg, #e8c678 0%, #d3a13b 100%)', color: '#000', padding: '5px', border: '1px solid #b8860b', fontSize: '11px' }}>Acumulado de atraso en cocedor</th>
              
              {/* Color ocupa 6 columnas */}
              <th colSpan={6} style={{ background: 'linear-gradient(180deg, #e8c678 0%, #d3a13b 100%)', color: '#000', padding: '10px', border: '1px solid #b8860b', fontSize: '13px', fontWeight: 'bold' }}>Color</th>
              
              <th style={{ background: 'linear-gradient(180deg, #e8c678 0%, #d3a13b 100%)', color: '#000', padding: '5px', border: '1px solid #b8860b', fontSize: '11px' }}>Tiempo de residencia</th>
              <th style={{ background: 'linear-gradient(180deg, #e8c678 0%, #d3a13b 100%)', color: '#000', padding: '5px', border: '1px solid #b8860b', fontSize: '11px' }}>Tiempo de filtración</th>
              
              {/* EMO ocupa 6 columnas */}
              <th colSpan={6} style={{ background: 'linear-gradient(180deg, #e8c678 0%, #d3a13b 100%)', color: '#000', padding: '10px', border: '1px solid #b8860b', fontSize: '13px', fontWeight: 'bold' }}>EMO de TCC</th>
              
              <th style={{ background: 'linear-gradient(180deg, #e8c678 0%, #d3a13b 100%)', color: '#000', padding: '5px', border: '1px solid #b8860b', fontSize: '11px' }}>Volumen de mosto frío</th>
              <th style={{ background: 'linear-gradient(180deg, #e8c678 0%, #d3a13b 100%)', color: '#000', padding: '5px', border: '1px solid #b8860b', fontSize: '11px' }}>HLD (# de coctos fuera)</th>
              <th style={{ background: 'linear-gradient(180deg, #e8c678 0%, #d3a13b 100%)', color: '#000', padding: '5px', border: '1px solid #b8860b', fontSize: '11px' }}>Faltas (#)</th>
              <th style={{ background: 'linear-gradient(180deg, #e8c678 0%, #d3a13b 100%)', color: '#000', padding: '5px', border: '1px solid #b8860b', fontSize: '11px' }}>Tiempo extra (horas)</th>
              <th style={{ background: 'linear-gradient(180deg, #e8c678 0%, #d3a13b 100%)', color: '#000', padding: '5px', border: '1px solid #b8860b', fontSize: '11px' }}>ATO realizados y notificados (#)</th>
              {isConfigMode && <th style={{ backgroundColor: '#fff', border: 'none' }}></th>}
            </tr>
          </thead>
          
          {Object.entries(groupedEntries).map(([groupKey, groupEntries]) => {
            const parts = groupKey.split(' - ');
            const monthYear = parts.length > 1 ? parts[1] : 'Sin Fecha';
            
            // Lógica del filtro de mes
            if (filterMonth !== "all" && monthYear !== filterMonth) {
              return null;
            }

            const isHidden = hiddenGroups[groupKey];
            if (isHidden && !isConfigMode) {
              return null; // Ocultar por completo si no estamos configurando
            }

            return (
            <tbody key={groupKey} style={{ opacity: isHidden ? 0.5 : 1 }}>
              {/* Cabecera del Acordeón (Semana) - Estilo Farol */}
              <tr 
                onClick={() => toggleGroup(groupKey)}
                style={{ 
                  backgroundColor: '#f8f9fa', 
                  cursor: 'pointer', 
                  borderBottom: '1px solid #e0e0e0',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e: any) => e.currentTarget.style.backgroundColor = '#f1f3f5'}
                onMouseLeave={(e: any) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
              >
                <td colSpan={isConfigMode ? 25 : 24} style={{ padding: '12px 15px', fontWeight: 'bold', fontSize: '16px', color: '#333', userSelect: 'none' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}><div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {expandedGroups[groupKey] ? <ChevronDown size={18} color="#000" /> : <ChevronRight size={18} color="#000" />}
                    <span style={{ fontSize: '15px' }}>{groupKey}</span> 
                    <span style={{ fontSize: '12px', fontWeight: 'normal', color: '#888', marginLeft: '5px' }}>({groupEntries.length} turnos)</span></div>{isConfigMode && (<button onClick={(e) => { e.stopPropagation(); toggleHideGroup(groupKey); }} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center', color: isHidden ? '#888' : '#333', borderRadius: '4px' }} title={isHidden ? 'Mostrar esta semana' : 'Ocultar esta semana'}>{isHidden ? <EyeOff size={18} /> : <Eye size={18} />}</button>)}</div>
                </td>
              </tr>
              {expandedGroups[groupKey] && groupEntries.map((log) => {
                const cT1 = log.colorTanks[0] || { brand: '', v1: '', v2: '' };
                const cT2 = log.colorTanks[1] || { brand: '', v1: '', v2: '' };
                const eT1 = log.emoTanks[0] || { brand: '', v1: '', v2: '', v3: '', v4: '' };
                const eT2 = log.emoTanks[1] || { brand: '', v1: '', v2: '', v3: '', v4: '' };
                
                return (
                  <tr key={log.id} style={{ backgroundColor: '#fff', borderBottom: '1px solid #ddd', color: '#000' }}>
                    <td style={{ border: '1px solid #ddd' }}>
                      <input type="date" value={log.date} onChange={e => handleUpdate(log.id, 'date', e.target.value)} style={{ width: '100%', border: 'none', textAlign: 'center', backgroundColor: 'transparent', padding: '8px 0' }} />
                    </td>
                    <td style={{ border: '1px solid #ddd' }}>
                      <input type="text" value={log.shift} onChange={e => handleUpdate(log.id, 'shift', e.target.value)} style={{ width: '100%', border: 'none', textAlign: 'center', backgroundColor: 'transparent' }} />
                    </td>
                    <td style={{ border: '1px solid #ddd' }}>
                      <input type="text" value={log.owner} onChange={e => handleUpdate(log.id, 'owner', e.target.value)} style={{ width: '100%', border: 'none', textAlign: 'left', paddingLeft: '8px', backgroundColor: 'transparent' }} />
                    </td>
                    
                    <td style={{ border: '1px solid #ddd' }}><input type="text" value={log.fallaEquipos} onChange={e => handleUpdate(log.id, 'fallaEquipos', e.target.value)} style={{ width: '100%', border: 'none', textAlign: 'center', color: '#000', backgroundColor: 'transparent' }} /></td>
                    <td style={{ border: '1px solid #ddd' }}><input type="text" value={log.fallasExternas} onChange={e => handleUpdate(log.id, 'fallasExternas', e.target.value)} style={{ width: '100%', border: 'none', textAlign: 'center', color: '#000', backgroundColor: 'transparent' }} /></td>
                    <td style={{ border: '1px solid #ddd' }}><input type="text" value={log.precursores} onChange={e => handleUpdate(log.id, 'precursores', e.target.value)} style={{ width: '100%', border: 'none', textAlign: 'center', color: '#000', backgroundColor: 'transparent' }} /></td>
                    <td style={{ border: '1px solid #ddd' }}><input type="text" value={log.acumulado} onChange={e => handleUpdate(log.id, 'acumulado', e.target.value)} style={{ width: '100%', border: 'none', textAlign: 'center', backgroundColor: 'transparent' }} /></td>
                    
                    {/* Color T1 */}
                    <td style={{ border: '1px solid #ddd' }}><input type="text" value={cT1.brand} onChange={e => handleColorUpdate(log.id, 0, 'brand', e.target.value)} style={{ width: '100%', border: 'none', textAlign: 'center', backgroundColor: 'transparent' }} /></td>
                    <td style={{ border: '1px solid #ddd' }}><input type="text" value={cT1.v1} onChange={e => handleColorUpdate(log.id, 0, 'v1', e.target.value)} style={{ width: '100%', border: 'none', textAlign: 'center', backgroundColor: 'transparent' }} /></td>
                    <td style={{ border: '1px solid #ddd', borderRight: '2px solid #555' }}><input type="text" value={cT1.v2} onChange={e => handleColorUpdate(log.id, 0, 'v2', e.target.value)} style={{ width: '100%', border: 'none', textAlign: 'center', color: getColorForSpec(cT1.brand, cT1.v2), backgroundColor: 'transparent' }} /></td>
                    
                    {/* Color T2 */}
                    <td style={{ border: '1px solid #ddd' }}><input type="text" value={cT2.brand} onChange={e => handleColorUpdate(log.id, 1, 'brand', e.target.value)} style={{ width: '100%', border: 'none', textAlign: 'center', backgroundColor: 'transparent' }} /></td>
                    <td style={{ border: '1px solid #ddd' }}><input type="text" value={cT2.v1} onChange={e => handleColorUpdate(log.id, 1, 'v1', e.target.value)} style={{ width: '100%', border: 'none', textAlign: 'center', backgroundColor: 'transparent' }} /></td>
                    <td style={{ border: '1px solid #ddd' }}><input type="text" value={cT2.v2} onChange={e => handleColorUpdate(log.id, 1, 'v2', e.target.value)} style={{ width: '100%', border: 'none', textAlign: 'center', color: getColorForSpec(cT2.brand, cT2.v2), backgroundColor: 'transparent' }} /></td>
                    
                    <td style={{ border: '1px solid #ddd' }}><input type="text" value={log.tiempoResidencia} onChange={e => handleUpdate(log.id, 'tiempoResidencia', e.target.value)} style={{ width: '100%', border: 'none', textAlign: 'center', color: '#000', backgroundColor: 'transparent' }} /></td>
                    <td style={{ border: '1px solid #ddd' }}><input type="text" value={log.tiempoFiltracion} onChange={e => handleUpdate(log.id, 'tiempoFiltracion', e.target.value)} style={{ width: '100%', border: 'none', textAlign: 'center', color: '#000', backgroundColor: 'transparent' }} /></td>
                    
                    {/* EMO T1 */}
                    <td style={{ border: '1px solid #ddd' }}><input type="text" value={eT1.brand} onChange={e => handleEmoUpdate(log.id, 0, 'brand', e.target.value)} style={{ width: '100%', border: 'none', textAlign: 'center', backgroundColor: 'transparent' }} /></td>
                    <td style={{ border: '1px solid #ddd' }}><input type="text" value={eT1.v1} onChange={e => handleEmoUpdate(log.id, 0, 'v1', e.target.value)} style={{ width: '100%', border: 'none', textAlign: 'center', backgroundColor: 'transparent' }} /></td>
                    <td style={{ border: '1px solid #ddd', borderRight: '2px solid #555' }}><input type="text" value={eT1.v2} onChange={e => handleEmoUpdate(log.id, 0, 'v2', e.target.value)} style={{ width: '100%', border: 'none', textAlign: 'center', color: getColorForSpecP(eT1.brand, eT1.v2), backgroundColor: 'transparent' }} /></td>
                    
                    {/* EMO T2 */}
                    <td style={{ border: '1px solid #ddd' }}><input type="text" value={eT2.brand} onChange={e => handleEmoUpdate(log.id, 1, 'brand', e.target.value)} style={{ width: '100%', border: 'none', textAlign: 'center', backgroundColor: 'transparent' }} /></td>
                    <td style={{ border: '1px solid #ddd' }}><input type="text" value={eT2.v1} onChange={e => handleEmoUpdate(log.id, 1, 'v1', e.target.value)} style={{ width: '100%', border: 'none', textAlign: 'center', backgroundColor: 'transparent' }} /></td>
                    <td style={{ border: '1px solid #ddd' }}><input type="text" value={eT2.v2} onChange={e => handleEmoUpdate(log.id, 1, 'v2', e.target.value)} style={{ width: '100%', border: 'none', textAlign: 'center', color: getColorForSpecP(eT2.brand, eT2.v2), backgroundColor: 'transparent' }} /></td>

                    <td style={{ border: '1px solid #ddd' }}><input type="text" value={log.volumenMosto} onChange={e => handleUpdate(log.id, 'volumenMosto', e.target.value)} style={{ width: '100%', border: 'none', textAlign: 'center', backgroundColor: 'transparent' }} /></td>
                    <td style={{ border: '1px solid #ddd' }}><input type="text" value={log.hld} onChange={e => handleUpdate(log.id, 'hld', e.target.value)} style={{ width: '100%', border: 'none', textAlign: 'center', color: '#000', backgroundColor: 'transparent' }} /></td>
                    <td style={{ border: '1px solid #ddd' }}><input type="text" value={log.faltas} onChange={e => handleUpdate(log.id, 'faltas', e.target.value)} style={{ width: '100%', border: 'none', textAlign: 'center', backgroundColor: 'transparent' }} /></td>
                    <td style={{ border: '1px solid #ddd' }}><input type="text" value={log.tiempoExtra} onChange={e => handleUpdate(log.id, 'tiempoExtra', e.target.value)} style={{ width: '100%', border: 'none', textAlign: 'center', backgroundColor: 'transparent' }} /></td>
                    <td style={{ border: '1px solid #ddd' }}><input type="text" value={log.ato} onChange={e => handleUpdate(log.id, 'ato', e.target.value)} style={{ width: '100%', border: 'none', textAlign: 'center', backgroundColor: 'transparent' }} /></td>
                    
                    {isConfigMode && (
                      <td style={{ border: 'none', backgroundColor: '#fff', verticalAlign: 'middle', paddingLeft: '5px' }}>
                        <button onClick={() => deleteEntry(log.id)} style={{ background: 'none', border: 'none', color: '#ff4444', cursor: 'pointer' }}>
                          <Trash2 size={16} />
                        </button>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
            );
          })}
        </table>
      </div>
    </div>
  );
}
