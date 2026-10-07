import { useState, useMemo, useEffect } from 'react';
import { ChevronDown, ChevronRight, Eye, EyeOff } from 'lucide-react';
import { useDashboard } from '../hooks/useDashboard';
import type { ShiftEntry } from '../types';
import { ShiftTableHeader } from './ShiftTableHeader';
import { ShiftTableRow } from './ShiftTableRow';

/**
 * MainTable is the core component that renders the data table for shift entries.
 */
export function MainTable({ dashboard, isConfigMode }: { dashboard: ReturnType<typeof useDashboard>, isConfigMode: boolean }) {
  const { entries, saveEntry, deleteEntry, loading } = dashboard;
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});
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

  const sortedGroupKeys = useMemo(() => {
    return Object.keys(groupedEntries).sort((a, b) => {
      // Ordenamos por la fecha de la primera entrada del grupo
      const dateA = new Date(groupedEntries[a][0].date).getTime();
      const dateB = new Date(groupedEntries[b][0].date).getTime();
      return dateA - dateB; 
    });
  }, [groupedEntries]);

  if (loading) return <div style={{ padding: '20px', color: '#1e293b' }}>Cargando datos...</div>;

  return (
    <div style={{ paddingBottom: '20px', width: '100%' }}>
      
      {availableMonths.length > 0 && (
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '15px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <label style={{ fontWeight: 'bold', fontSize: '12px', textTransform: 'uppercase', color: 'var(--text-main)' }}>Filtro de Mes:</label>
            <select value={filterMonth} onChange={e => setFilterMonth(e.target.value)} style={{ padding: '6px 10px', borderRadius: '4px', border: '1px solid var(--border-soft)', fontSize: '13px', outline: 'none', color: 'var(--text-main)', background: 'white' }}>
              <option value="all">Ver todos los meses (Enero a Diciembre)</option>
              {availableMonths.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
        </div>
      )}

      <div className="data-table-wrapper">
        <table className="data-table" style={{ borderCollapse: 'collapse', width: '100%', minWidth: '1800px' }}>
          <colgroup>
            <col style={{ width: '80px' }} /><col style={{ width: '50px' }} /><col style={{ width: '150px' }} />
            <col style={{ width: '60px' }} /><col style={{ width: '60px' }} /><col style={{ width: '60px' }} /><col style={{ width: '60px' }} />
            <col style={{ width: '140px' }} /><col style={{ width: '50px' }} /><col style={{ width: '50px' }} />
            <col style={{ width: '140px' }} /><col style={{ width: '50px' }} /><col style={{ width: '50px' }} />
            <col style={{ width: '60px' }} /><col style={{ width: '60px' }} />
            <col style={{ width: '140px' }} /><col style={{ width: '50px' }} /><col style={{ width: '50px' }} />
            <col style={{ width: '140px' }} /><col style={{ width: '50px' }} /><col style={{ width: '50px' }} />
            <col style={{ width: '60px' }} /><col style={{ width: '60px' }} /><col style={{ width: '60px' }} /><col style={{ width: '60px' }} /><col style={{ width: '60px' }} />
            {isConfigMode && <col style={{ width: '40px' }} />}
          </colgroup>
          <ShiftTableHeader isConfigMode={isConfigMode} />
          
          {sortedGroupKeys.map((groupKey) => {
            const groupEntries = groupedEntries[groupKey];
            const parts = groupKey.split(' - ');
            const monthYear = parts.length > 1 ? parts[1] : 'Sin Fecha';
            if (filterMonth !== "all" && monthYear !== filterMonth) return null;

            const isHidden = hiddenGroups[groupKey];
            if (isHidden && !isConfigMode) return null;

            return (
              <tbody key={groupKey} style={{ opacity: isHidden ? 0.5 : 1 }}>
                <tr 
                  className="group-header"
                  onClick={() => toggleGroup(groupKey)}
                  style={{ cursor: 'pointer' }}
                >
                  <td colSpan={isConfigMode ? 25 : 24}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {expandedGroups[groupKey] ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                        <span>{groupKey}</span> 
                        <span style={{ fontSize: '12px', fontWeight: 'normal', color: 'var(--text-muted)', marginLeft: '5px' }}>({groupEntries.length} turnos)</span>
                      </div>
                      {isConfigMode && (
                        <button onClick={(e) => { e.stopPropagation(); toggleHideGroup(groupKey); }} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center', color: isHidden ? 'var(--text-muted)' : 'var(--text-main)', borderRadius: '4px' }} title={isHidden ? 'Mostrar esta semana' : 'Ocultar esta semana'}>
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
