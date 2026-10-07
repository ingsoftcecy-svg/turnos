import { Trash2 } from 'lucide-react';
import type { ShiftEntry, TankMeasurement, EMOMeasurement } from '../types';
import { ColorEvaluator } from '../utils/ColorEvaluator';
import { EditableCell } from './EditableCell';

interface ShiftTableRowProps {
  log: ShiftEntry;
  isConfigMode: boolean;
  handleUpdate: (id: string, field: keyof ShiftEntry, value: any) => void;
  handleColorUpdate: (id: string, tankIndex: number, field: keyof TankMeasurement, value: string) => void;
  handleEmoUpdate: (id: string, tankIndex: number, field: keyof EMOMeasurement, value: string) => void;
  deleteEntry: (id: string) => void;
}

export function ShiftTableRow({ 
  log, 
  isConfigMode, 
  handleUpdate, 
  handleColorUpdate, 
  handleEmoUpdate, 
  deleteEntry 
}: ShiftTableRowProps) {
  const cT1 = log.colorTanks[0] || { brand: '', v1: '', v2: '' };
  const cT2 = log.colorTanks[1] || { brand: '', v1: '', v2: '' };
  const eT1 = log.emoTanks[0] || { brand: '', v1: '', v2: '', v3: '', v4: '' };
  const eT2 = log.emoTanks[1] || { brand: '', v1: '', v2: '', v3: '', v4: '' };

  const onUpdate = (field: keyof ShiftEntry) => (val: string) => handleUpdate(log.id, field, val);
  const onColorUpdate = (index: number, field: keyof TankMeasurement) => (val: string) => handleColorUpdate(log.id, index, field, val);
  const onEmoUpdate = (index: number, field: keyof EMOMeasurement) => (val: string) => handleEmoUpdate(log.id, index, field, val);

  return (
    <tr>
      <EditableCell type="date" value={log.date} onChange={onUpdate('date')} textAlign="center" />
      <EditableCell value={log.shift} onChange={onUpdate('shift')} />
      <EditableCell value={log.owner} onChange={onUpdate('owner')} />
      
      <EditableCell value={log.fallaEquipos} onChange={onUpdate('fallaEquipos')} />
      <EditableCell value={log.fallasExternas} onChange={onUpdate('fallasExternas')} />
      <EditableCell value={log.precursores} onChange={onUpdate('precursores')} />
      <EditableCell value={log.acumulado} onChange={onUpdate('acumulado')} />
      
      {/* Color T1 */}
      <EditableCell value={cT1.brand} onChange={onColorUpdate(0, 'brand')} />
      <EditableCell value={cT1.v1} onChange={onColorUpdate(0, 'v1')} />
      <EditableCell 
        value={cT1.v2} 
        onChange={onColorUpdate(0, 'v2')} 
        color={ColorEvaluator.getColorForSpec(cT1.brand, cT1.v2)} 
      />
      
      {/* Color T2 */}
      <EditableCell value={cT2.brand} onChange={onColorUpdate(1, 'brand')} />
      <EditableCell value={cT2.v1} onChange={onColorUpdate(1, 'v1')} />
      <EditableCell 
        value={cT2.v2} 
        onChange={onColorUpdate(1, 'v2')} 
        color={ColorEvaluator.getColorForSpec(cT2.brand, cT2.v2)} 
      />
      
      <EditableCell value={log.tiempoResidencia} onChange={onUpdate('tiempoResidencia')} />
      <EditableCell value={log.tiempoFiltracion} onChange={onUpdate('tiempoFiltracion')} />
      
      {/* EMO T1 */}
      <EditableCell value={eT1.brand} onChange={onEmoUpdate(0, 'brand')} />
      <EditableCell value={eT1.v1} onChange={onEmoUpdate(0, 'v1')} />
      <EditableCell 
        value={eT1.v2} 
        onChange={onEmoUpdate(0, 'v2')} 
        color={ColorEvaluator.getColorForSpecP(eT1.brand, eT1.v2)} 
      />
      
      {/* EMO T2 */}
      <EditableCell value={eT2.brand} onChange={onEmoUpdate(1, 'brand')} />
      <EditableCell value={eT2.v1} onChange={onEmoUpdate(1, 'v1')} />
      <EditableCell 
        value={eT2.v2} 
        onChange={onEmoUpdate(1, 'v2')} 
        color={ColorEvaluator.getColorForSpecP(eT2.brand, eT2.v2)} 
      />

      <EditableCell value={log.volumenMosto} onChange={onUpdate('volumenMosto')} />
      <EditableCell value={log.hld} onChange={onUpdate('hld')} />
      <EditableCell value={log.faltas} onChange={onUpdate('faltas')} />
      <EditableCell value={log.tiempoExtra} onChange={onUpdate('tiempoExtra')} />
      <EditableCell value={log.ato} onChange={onUpdate('ato')} />
      
      {isConfigMode && (
        <td className="admin-actions" style={{ border: '1px solid var(--border-soft)', backgroundColor: '#fff', verticalAlign: 'middle' }}>
          <button onClick={() => deleteEntry(log.id)} style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', display: 'flex', justifyContent: 'center', width: '100%' }}>
            <Trash2 size={16} />
          </button>
        </td>
      )}
    </tr>
  );
}
