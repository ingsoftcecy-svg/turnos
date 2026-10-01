import { useState, useMemo, useEffect } from 'react';
import { Settings, ChevronDown, ChevronRight, Eye, EyeOff } from 'lucide-react';
import { useDashboard } from '../hooks/useDashboard';
import type { ShiftEntry } from '../types';
import { ShiftTableHeader } from './ShiftTableHeader';
import { ShiftTableRow } from './ShiftTableRow';

/**
 * MainTable is the core component that renders the data table for shift entries.
 */
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

  const getGroupKey = (dateStr: string) => {
    if (!dateStr) return 'Sin Fecha';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return 'Fechas Inválidas';
    
    const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    const month = monthNames[d.getUTCMonth()];
    const year = d.getUTCFullYear();
    const date = d.getUTCDate();
    const weekOfMonth = Math.ceil(date / 7);
    return `Semana ${weekOfMonth} - ${month} ${year}`;
  };

  const groupedEntries = useMemo(() => {
    const groups: Record<string, ShiftEntry[]> = {};
    entries.forEach(entry => {
      const key = getGroupKey(entry.date);
      if (!groups[key]) groups[key] = [];
      groups[key].push(entry);
    });
    return groups;
  }, [entries]);

  const availableMonths = useMemo(() => {
    const months = new Set<string>();
    Object.keys(groupedEntries).forEach(key => {
      const parts = key.split(' - ');
      if (parts.length > 1) months.add(parts[1]);
    });
    return Array.from(months);
  }, [groupedEntries]);

  const [filterMonth, setFilterMonth] = useState<string>("all");

  useEffect(() => {
    if (availableMonths.length > 0 && filterMonth === "all") {
      setFilterMonth(availableMonths[availableMonths.length - 1]);
    }
  }, [availableMonths, filterMonth]);

  useEffect(() => {
    if (entries.length > 0 && Object.keys(expandedGroups).length === 0) {
      const keys = Object.keys(groupedEntries);
      if (keys.length > 0) {
        setExpandedGroups({ [keys[keys.length - 1]]: true });
      }
    }
  }, [groupedEntries, entries.length]);

  const toggleGroup = (key: string) => setExpandedGroups(prev => ({ ...prev, [key]: !prev[key] }));

  const handleUpdate = (id: string, field: keyof ShiftEntry, value: any) => {
    const entry = entries.find(e => e.id === id);
    if (entry) saveEntry({ ...entry, [field]: value });
  };

  const handleColorUpdate = (id: string, tankIndex: number, field: any, value: string) => {
    const entry = entries.find(e => e.id === id);
    if (entry) {
      const newTanks = [...entry.colorTanks];
      if (!newTanks[tankIndex]) newTanks[tankIndex] = { id: crypto.randomUUID(), brand: '', v1: '', v2: '' };
      newTanks[tankIndex] = { ...newTanks[tankIndex], [field]: value };
      saveEntry({ ...entry, colorTanks: newTanks });
    }
  };

  const handleEmoUpdate = (id: string, tankIndex: number, field: any, value: string) => {
    const entry = entries.find(e => e.id === id);
    if (entry) {
      const newTanks = [...entry.emoTanks];
      if (!newTanks[tankIndex]) newTanks[tankIndex] = { id: crypto.randomUUID(), brand: '', v1: '', v2: '', v3: '', v4: '' };
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
      colorTanks: [{ id: crypto.randomUUID(), brand: '', v1: '', v2: '' }, { id: crypto.randomUUID(), brand: '', v1: '', v2: '' }],
      colorExtra1: '', colorExtra2: '', tiempoResidencia: '', tiempoFiltracion: '',
      emoTanks: [{ id: crypto.randomUUID(), brand: '', v1: '', v2: '', v3: '', v4: '' }],
      volumenMosto: '', hld: '', faltas: '', tiempoExtra: '', ato: ''
    };
    saveEntry(newEntry);
    const key = getGroupKey(today);
    const mYear = key.split(' - ')[1];
    if (mYear) setFilterMonth(mYear);
    setExpandedGroups(prev => ({ ...prev, [key]: true }));
  };

  if (loading) return <div style={{ padding: '20px', color: '#fff' }}>Cargando datos...</div>;

  return (
    <div className="data-table-wrapper" style={{ paddingBottom: '50px', width: '100%' }}>
      <style>{`input[type="date"]::-webkit-inner-spin-button, input[type="date"]::-webkit-calendar-picker-indicator { display: none; -webkit-appearance: none; } .data-table-wrapper input { font-family: inherit; font-weight: 600; font-size: 13px; } .data-table-wrapper th { font-weight: 700 !important; }`}</style>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={addNewRow} style={{ padding: '10px 20px', backgroundColor: '#000', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
            + Agregar Fila de Turno
          </button>
          <button onClick={() => setIsConfigMode(!isConfigMode)} style={{ padding: '10px 15px', backgroundColor: isConfigMode ? '#e74c3c' : '#333', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '5px' }}>
            <Settings size={16} /> CONFIGURAR TABLA
          </button>
        </div>
        
        {availableMonths.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <label style={{ fontWeight: 'bold', fontSize: '14px', textTransform: 'uppercase' }}>Filtro de Mes:</label>
            <select value={filterMonth} onChange={e => setFilterMonth(e.target.value)} style={{ padding: '8px 12px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '14px', outline: 'none', fontWeight: 'bold' }}>
              <option value="all">Ver todos los meses (Histórico Completo)</option>
              {availableMonths.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
        )}
      </div>

      <div style={{ backgroundColor: '#fff', padding: '0', overflowX: 'auto', borderRadius: '4px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: '2050px', tableLayout: 'fixed' }}>
          <colgroup>
            <col style={{ width: '120px' }} /><col style={{ width: '60px' }} /><col style={{ width: '180px' }} />
            <col style={{ width: '70px' }} /><col style={{ width: '70px' }} /><col style={{ width: '70px' }} /><col style={{ width: '70px' }} />
            <col style={{ width: '110px' }} /><col style={{ width: '50px' }} /><col style={{ width: '50px' }} />
            <col style={{ width: '110px' }} /><col style={{ width: '50px' }} /><col style={{ width: '50px' }} />
            <col style={{ width: '70px' }} /><col style={{ width: '70px' }} />
            <col style={{ width: '110px' }} /><col style={{ width: '50px' }} /><col style={{ width: '50px' }} />
            <col style={{ width: '110px' }} /><col style={{ width: '50px' }} /><col style={{ width: '50px' }} />
            <col style={{ width: '70px' }} /><col style={{ width: '70px' }} /><col style={{ width: '70px' }} /><col style={{ width: '70px' }} /><col style={{ width: '70px' }} />
            {isConfigMode && <col style={{ width: '40px' }} />}
          </colgroup>
          <ShiftTableHeader isConfigMode={isConfigMode} />
          
          {Object.entries(groupedEntries).map(([groupKey, groupEntries]) => {
            const parts = groupKey.split(' - ');
            const monthYear = parts.length > 1 ? parts[1] : 'Sin Fecha';
            if (filterMonth !== "all" && monthYear !== filterMonth) return null;

            const isHidden = hiddenGroups[groupKey];
            if (isHidden && !isConfigMode) return null;

            return (
              <tbody key={groupKey} style={{ opacity: isHidden ? 0.5 : 1 }}>
                <tr 
                  onClick={() => toggleGroup(groupKey)}
                  style={{ backgroundColor: '#f8f9fa', cursor: 'pointer', borderBottom: '1px solid #e0e0e0', transition: 'background-color 0.2s' }}
                  onMouseEnter={(e: any) => e.currentTarget.style.backgroundColor = '#f1f3f5'}
                  onMouseLeave={(e: any) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
                >
                  <td colSpan={isConfigMode ? 25 : 24} style={{ padding: '12px 15px', fontWeight: 'bold', fontSize: '16px', color: '#333', userSelect: 'none' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {expandedGroups[groupKey] ? <ChevronDown size={18} color="#000" /> : <ChevronRight size={18} color="#000" />}
                        <span style={{ fontSize: '15px' }}>{groupKey}</span> 
                        <span style={{ fontSize: '12px', fontWeight: 'normal', color: '#888', marginLeft: '5px' }}>({groupEntries.length} turnos)</span>
                      </div>
                      {isConfigMode && (
                        <button onClick={(e) => { e.stopPropagation(); toggleHideGroup(groupKey); }} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center', color: isHidden ? '#888' : '#333', borderRadius: '4px' }} title={isHidden ? 'Mostrar esta semana' : 'Ocultar esta semana'}>
                          {isHidden ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
                {expandedGroups[groupKey] && groupEntries.map((log) => (
                  <ShiftTableRow
                    key={log.id}
                    log={log}
                    isConfigMode={isConfigMode}
                    handleUpdate={handleUpdate}
                    handleColorUpdate={handleColorUpdate}
                    handleEmoUpdate={handleEmoUpdate}
                    deleteEntry={deleteEntry}
                  />
                ))}
              </tbody>
            );
          })}
        </table>
      </div>
    </div>
  );
}
