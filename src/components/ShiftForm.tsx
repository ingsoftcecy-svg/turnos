import React, { useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import type { ShiftEntry, TankMeasurement, EMOMeasurement } from '../types';

interface Props {
  initialData: ShiftEntry;
  onSave: (entry: ShiftEntry) => void;
  onClose: () => void;
}

export function ShiftForm({ initialData, onSave, onClose }: Props) {
  const [formData, setFormData] = useState<ShiftEntry>(initialData);

  const handleChange = (field: keyof ShiftEntry, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addColorTank = () => {
    setFormData(prev => ({
      ...prev,
      colorTanks: [...prev.colorTanks, { id: crypto.randomUUID(), brand: "", v1: "", v2: "" }]
    }));
  };

  const removeColorTank = (id: string) => {
    setFormData(prev => ({
      ...prev,
      colorTanks: prev.colorTanks.filter(t => t.id !== id)
    }));
  };

  const updateColorTank = (id: string, field: keyof TankMeasurement, value: string) => {
    setFormData(prev => ({
      ...prev,
      colorTanks: prev.colorTanks.map(t => t.id === id ? { ...t, [field]: value } : t)
    }));
  };

  const addEmoTank = () => {
    setFormData(prev => ({
      ...prev,
      emoTanks: [...prev.emoTanks, { id: crypto.randomUUID(), brand: "", v1: "", v2: "", v3: "", v4: "" }]
    }));
  };

  const removeEmoTank = (id: string) => {
    setFormData(prev => ({
      ...prev,
      emoTanks: prev.emoTanks.filter(t => t.id !== id)
    }));
  };

  const updateEmoTank = (id: string, field: keyof EMOMeasurement, value: string) => {
    setFormData(prev => ({
      ...prev,
      emoTanks: prev.emoTanks.map(t => t.id === id ? { ...t, [field]: value } : t)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="modal-overlay" style={{position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center', overflowY: 'auto', padding: '20px'}}>
      <div className="modal-content" style={{backgroundColor: '#1a1a1a', border: '2px solid var(--accent-gold)', borderRadius: '8px', padding: '25px', width: '100%', maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto', position: 'relative'}}>
        
        <button onClick={onClose} style={{position: 'absolute', top: '15px', right: '15px', background: 'none', border: 'none', color: '#fff', cursor: 'pointer'}}>
          <X size={24} />
        </button>

        <h2 style={{color: 'var(--accent-gold)', marginTop: 0, marginBottom: '20px', borderBottom: '1px solid #333', paddingBottom: '10px'}}>
          Registrar Entrega de Turno
        </h2>

        <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column', gap: '20px'}}>
          
          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px', backgroundColor: '#222', padding: '15px', borderRadius: '6px'}}>
            <div>
              <label style={{display: 'block', marginBottom: '5px', color: '#aaa', fontSize: '0.9rem'}}>Fecha</label>
              <input type="date" required value={formData.date} onChange={e => handleChange('date', e.target.value)} style={{width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #444', backgroundColor: '#111', color: '#fff'}} />
            </div>
            <div>
              <label style={{display: 'block', marginBottom: '5px', color: '#aaa', fontSize: '0.9rem'}}>Turno</label>
              <select required value={formData.shift} onChange={e => handleChange('shift', e.target.value)} style={{width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #444', backgroundColor: '#111', color: '#fff'}}>
                <option value="1">Turno 1</option>
                <option value="2">Turno 2</option>
                <option value="3">Turno 3</option>
              </select>
            </div>
            <div>
              <label style={{display: 'block', marginBottom: '5px', color: '#aaa', fontSize: '0.9rem'}}>Responsable</label>
              <input type="text" required value={formData.owner} onChange={e => handleChange('owner', e.target.value)} style={{width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #444', backgroundColor: '#111', color: '#fff'}} placeholder="Nombre..." />
            </div>
          </div>

          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px'}}>
            
            {/* Left Column */}
            <div style={{display: 'flex', flexDirection: 'column', gap: '15px'}}>
              <h3 style={{color: '#fff', borderBottom: '1px solid #444', paddingBottom: '5px', margin: 0}}>Incidentes y Atrasos</h3>
              
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <label style={{color: '#ccc', width: '60%'}}>Falla de equipos (# eventos)</label>
                <input type="number" step="any" value={formData.fallaEquipos} onChange={e => handleChange('fallaEquipos', e.target.value)} style={{width: '35%', padding: '6px', backgroundColor: '#111', color: '#fff', border: '1px solid #444', borderRadius: '4px', textAlign: 'center'}} />
              </div>
              
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <label style={{color: '#ccc', width: '60%'}}>Fallas externas</label>
                <input type="number" step="any" value={formData.fallasExternas} onChange={e => handleChange('fallasExternas', e.target.value)} style={{width: '35%', padding: '6px', backgroundColor: '#111', color: '#fff', border: '1px solid #444', borderRadius: '4px', textAlign: 'center'}} />
              </div>

              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <label style={{color: '#ccc', width: '60%'}}>Precursores de incidentes</label>
                <input type="number" step="any" value={formData.precursores} onChange={e => handleChange('precursores', e.target.value)} style={{width: '35%', padding: '6px', backgroundColor: '#111', color: '#fff', border: '1px solid #444', borderRadius: '4px', textAlign: 'center'}} />
              </div>

              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <label style={{color: '#ccc', width: '60%'}}>Acumulado de atraso</label>
                <input type="number" step="any" value={formData.acumulado} onChange={e => handleChange('acumulado', e.target.value)} style={{width: '35%', padding: '6px', backgroundColor: '#111', color: '#fff', border: '1px solid #444', borderRadius: '4px', textAlign: 'center'}} />
              </div>

              <h3 style={{color: '#fff', borderBottom: '1px solid #444', paddingBottom: '5px', margin: '15px 0 0 0'}}>Tiempos</h3>
              
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <label style={{color: '#ccc', width: '60%'}}>Tiempo de residencia</label>
                <input type="number" step="any" value={formData.tiempoResidencia} onChange={e => handleChange('tiempoResidencia', e.target.value)} style={{width: '35%', padding: '6px', backgroundColor: '#111', color: '#fff', border: '1px solid #444', borderRadius: '4px', textAlign: 'center'}} />
              </div>

              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <label style={{color: '#ccc', width: '60%'}}>Tiempo de filtración</label>
                <input type="number" step="any" value={formData.tiempoFiltracion} onChange={e => handleChange('tiempoFiltracion', e.target.value)} style={{width: '35%', padding: '6px', backgroundColor: '#111', color: '#fff', border: '1px solid #444', borderRadius: '4px', textAlign: 'center'}} />
              </div>

              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <label style={{color: '#ccc', width: '60%'}}>Tiempo extra (horas)</label>
                <input type="number" step="any" value={formData.tiempoExtra} onChange={e => handleChange('tiempoExtra', e.target.value)} style={{width: '35%', padding: '6px', backgroundColor: '#111', color: '#fff', border: '1px solid #444', borderRadius: '4px', textAlign: 'center'}} />
              </div>
              
            </div>

            {/* Right Column */}
            <div style={{display: 'flex', flexDirection: 'column', gap: '15px'}}>
              
              <div style={{backgroundColor: '#2a2a1a', padding: '15px', borderRadius: '6px', border: '1px solid #554400'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px'}}>
                  <h3 style={{color: '#ffe500', margin: 0}}>Color</h3>
                  <button type="button" onClick={addColorTank} style={{background: 'none', border: '1px solid #ffe500', color: '#ffe500', borderRadius: '4px', padding: '2px 8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.8rem'}}>
                    <Plus size={14}/> Tanque
                  </button>
                </div>
                
                {formData.colorTanks.map((tank) => (
                  <div key={tank.id} style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 30px', gap: '5px', marginBottom: '10px', alignItems: 'center'}}>
                    <input type="text" placeholder="Marca (ej. VIC)" value={tank.brand} onChange={e => updateColorTank(tank.id, 'brand', e.target.value)} style={{padding: '6px', backgroundColor: '#111', color: '#fff', border: '1px solid #555'}} />
                    <input type="number" step="any" placeholder="V1" value={tank.v1} onChange={e => updateColorTank(tank.id, 'v1', e.target.value)} style={{padding: '6px', backgroundColor: '#111', color: '#fff', border: '1px solid #555'}} />
                    <input type="number" step="any" placeholder="V2" value={tank.v2} onChange={e => updateColorTank(tank.id, 'v2', e.target.value)} style={{padding: '6px', backgroundColor: '#111', color: '#fff', border: '1px solid #555'}} />
                    {formData.colorTanks.length > 1 ? (
                      <button type="button" onClick={() => removeColorTank(tank.id)} style={{background: 'none', border: 'none', color: '#ff4444', cursor: 'pointer', display: 'flex', justifyContent: 'center'}}>
                        <Trash2 size={16} />
                      </button>
                    ) : <div></div>}
                  </div>
                ))}
                
                <div style={{display: 'flex', gap: '10px', marginTop: '10px', paddingTop: '10px', borderTop: '1px dashed #554400'}}>
                  <div style={{flex: 1}}>
                    <label style={{fontSize: '0.8rem', color: '#aaa', display: 'block', marginBottom: '2px'}}>Extra 1</label>
                    <input type="number" step="any" value={formData.colorExtra1} onChange={e => handleChange('colorExtra1', e.target.value)} style={{width: '100%', padding: '6px', backgroundColor: '#111', color: '#ff6666', border: '1px solid #555'}} />
                  </div>
                  <div style={{flex: 1}}>
                    <label style={{fontSize: '0.8rem', color: '#aaa', display: 'block', marginBottom: '2px'}}>Extra 2</label>
                    <input type="number" step="any" value={formData.colorExtra2} onChange={e => handleChange('colorExtra2', e.target.value)} style={{width: '100%', padding: '6px', backgroundColor: '#111', color: '#ff6666', border: '1px solid #555'}} />
                  </div>
                </div>
              </div>

              <div style={{backgroundColor: '#2a2a1a', padding: '15px', borderRadius: '6px', border: '1px solid #554400'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px'}}>
                  <h3 style={{color: '#ffe500', margin: 0}}>EMO de TCC</h3>
                  <button type="button" onClick={addEmoTank} style={{background: 'none', border: '1px solid #ffe500', color: '#ffe500', borderRadius: '4px', padding: '2px 8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.8rem'}}>
                    <Plus size={14}/> Tanque
                  </button>
                </div>
                
                {formData.emoTanks.map((tank) => (
                  <div key={tank.id} style={{display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr 1fr 1fr 30px', gap: '5px', marginBottom: '10px', alignItems: 'center'}}>
                    <input type="text" placeholder="Marca" value={tank.brand} onChange={e => updateEmoTank(tank.id, 'brand', e.target.value)} style={{padding: '6px', backgroundColor: '#111', color: '#fff', border: '1px solid #555', fontSize: '0.8rem'}} />
                    <input type="number" step="any" placeholder="V1" value={tank.v1} onChange={e => updateEmoTank(tank.id, 'v1', e.target.value)} style={{padding: '6px', backgroundColor: '#111', color: '#fff', border: '1px solid #555', fontSize: '0.8rem'}} />
                    <input type="number" step="any" placeholder="V2" value={tank.v2} onChange={e => updateEmoTank(tank.id, 'v2', e.target.value)} style={{padding: '6px', backgroundColor: '#111', color: '#fff', border: '1px solid #555', fontSize: '0.8rem'}} />
                    <input type="number" step="any" placeholder="V3" value={tank.v3} onChange={e => updateEmoTank(tank.id, 'v3', e.target.value)} style={{padding: '6px', backgroundColor: '#111', color: '#44ff44', border: '1px solid #555', fontSize: '0.8rem'}} />
                    <input type="number" step="any" placeholder="V4" value={tank.v4} onChange={e => updateEmoTank(tank.id, 'v4', e.target.value)} style={{padding: '6px', backgroundColor: '#111', color: '#fff', border: '1px solid #555', fontSize: '0.8rem'}} />
                    {formData.emoTanks.length > 1 ? (
                      <button type="button" onClick={() => removeEmoTank(tank.id)} style={{background: 'none', border: 'none', color: '#ff4444', cursor: 'pointer', display: 'flex', justifyContent: 'center'}}>
                        <Trash2 size={16} />
                      </button>
                    ) : <div></div>}
                  </div>
                ))}
              </div>

              <h3 style={{color: '#fff', borderBottom: '1px solid #444', paddingBottom: '5px', margin: '0 0 5px 0'}}>Otros Indicadores</h3>
              
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <label style={{color: '#ccc', width: '60%'}}>Volumen de mosto frío</label>
                <input type="number" step="any" value={formData.volumenMosto} onChange={e => handleChange('volumenMosto', e.target.value)} style={{width: '35%', padding: '6px', backgroundColor: '#111', color: '#fff', border: '1px solid #444', borderRadius: '4px', textAlign: 'center'}} />
              </div>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <label style={{color: '#ccc', width: '60%'}}>HLD (# de coctos fuera)</label>
                <input type="number" step="any" value={formData.hld} onChange={e => handleChange('hld', e.target.value)} style={{width: '35%', padding: '6px', backgroundColor: '#111', color: '#fff', border: '1px solid #444', borderRadius: '4px', textAlign: 'center'}} />
              </div>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <label style={{color: '#ccc', width: '60%'}}>Faltas (#)</label>
                <input type="number" step="any" value={formData.faltas} onChange={e => handleChange('faltas', e.target.value)} style={{width: '35%', padding: '6px', backgroundColor: '#111', color: '#fff', border: '1px solid #444', borderRadius: '4px', textAlign: 'center'}} />
              </div>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <label style={{color: '#ccc', width: '60%'}}>ATO realizados (#)</label>
                <input type="number" step="any" value={formData.ato} onChange={e => handleChange('ato', e.target.value)} style={{width: '35%', padding: '6px', backgroundColor: '#111', color: '#fff', border: '1px solid #444', borderRadius: '4px', textAlign: 'center'}} />
              </div>

            </div>
          </div>

          <div style={{marginTop: '20px', display: 'flex', justifyContent: 'flex-end', gap: '15px', borderTop: '1px solid #333', paddingTop: '20px'}}>
            <button type="button" onClick={onClose} style={{padding: '10px 20px', backgroundColor: 'transparent', border: '1px solid #666', color: '#fff', borderRadius: '4px', cursor: 'pointer'}}>
              Cancelar
            </button>
            <button type="submit" style={{padding: '10px 30px', backgroundColor: 'var(--accent-gold)', border: 'none', color: '#000', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1.1rem'}}>
              Guardar Turno
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
