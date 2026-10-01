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

/**
 * Represents a single row in the MainTable, handling all edits for a shift entry.
 */
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
    <tr style={{ backgroundColor: '#fff', borderBottom: '1px solid #ddd', color: '#000' }}>
      <EditableCell type="date" value={log.date} onChange={onUpdate('date')} />
      <EditableCell value={log.shift} onChange={onUpdate('shift')} />
      <EditableCell value={log.owner} onChange={onUpdate('owner')} textAlign="left" paddingLeft="8px" />
      
      <EditableCell value={log.fallaEquipos} onChange={onUpdate('fallaEquipos')} color="#000" />
      <EditableCell value={log.fallasExternas} onChange={onUpdate('fallasExternas')} color="#000" />
      <EditableCell value={log.precursores} onChange={onUpdate('precursores')} color="#000" />
      <EditableCell value={log.acumulado} onChange={onUpdate('acumulado')} />
      
      {/* Color T1 */}
      <EditableCell value={cT1.brand} onChange={onColorUpdate(0, 'brand')} />
      <EditableCell value={cT1.v1} onChange={onColorUpdate(0, 'v1')} />
      <EditableCell 
        value={cT1.v2} 
        onChange={onColorUpdate(0, 'v2')} 
        color={ColorEvaluator.getColorForSpec(cT1.brand, cT1.v2)} 
        borderRight="2px solid #555" 
      />
      
      {/* Color T2 */}
      <EditableCell value={cT2.brand} onChange={onColorUpdate(1, 'brand')} />
      <EditableCell value={cT2.v1} onChange={onColorUpdate(1, 'v1')} />
      <EditableCell 
        value={cT2.v2} 
        onChange={onColorUpdate(1, 'v2')} 
        color={ColorEvaluator.getColorForSpec(cT2.brand, cT2.v2)} 
      />
      
      <EditableCell value={log.tiempoResidencia} onChange={onUpdate('tiempoResidencia')} color="#000" />
      <EditableCell value={log.tiempoFiltracion} onChange={onUpdate('tiempoFiltracion')} color="#000" />
      
      {/* EMO T1 */}
      <EditableCell value={eT1.brand} onChange={onEmoUpdate(0, 'brand')} />
      <EditableCell value={eT1.v1} onChange={onEmoUpdate(0, 'v1')} />
      <EditableCell 
        value={eT1.v2} 
        onChange={onEmoUpdate(0, 'v2')} 
        color={ColorEvaluator.getColorForSpecP(eT1.brand, eT1.v2)} 
        borderRight="2px solid #555" 
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
      <EditableCell value={log.hld} onChange={onUpdate('hld')} color="#000" />
      <EditableCell value={log.faltas} onChange={onUpdate('faltas')} />
      <EditableCell value={log.tiempoExtra} onChange={onUpdate('tiempoExtra')} />
      <EditableCell value={log.ato} onChange={onUpdate('ato')} />
      
      {isConfigMode && (
        <td style={{ border: 'none', backgroundColor: '#fff', verticalAlign: 'middle', paddingLeft: '5px' }}>
          <button onClick={() => deleteEntry(log.id)} style={{ background: 'none', border: 'none', color: '#ff4444', cursor: 'pointer' }}>
            <Trash2 size={16} />
          </button>
        </td>
      )}
    </tr>
  );
}
