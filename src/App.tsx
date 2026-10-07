import { useState, useEffect } from 'react';
import { LayoutDashboard, MonitorUp, Settings } from 'lucide-react';
import { useDashboard } from './hooks/useDashboard';
import { MainTable } from './components/MainTable';
import type { ShiftEntry } from './types';
import './index.css';

export default function App() {
  const dashboard = useDashboard();
  const [tvMode, setTvMode] = useState(false);
  const [isConfigMode, setIsConfigMode] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (tvMode) {
        // Asumiendo que la tabla mide ~1850px, calculamos el zoom exacto para llenar la pantalla
        const scale = Math.max(0.7, window.innerWidth / 1850);
        document.body.style.zoom = scale.toString();
      } else {
        document.body.style.zoom = '0.70';
      }
    };

    handleResize(); // Ejecutar al cambiar el modo
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [tvMode]);

  const addNewRow = () => {
    const today = new Date().toISOString().split('T')[0];
    const newEntry: ShiftEntry = {
      id: crypto.randomUUID(),
      date: today,
      shift: '1',
      owner: '',
      fallaEquipos: '0', fallasExternas: '0', precursores: '0', acumulado: '',
      colorTanks: [{ id: crypto.randomUUID(), brand: '', v1: '', v2: '' }, { id: crypto.randomUUID(), brand: '', v1: '', v2: '' }],
      colorExtra1: '', colorExtra2: '', tiempoResidencia: '', tiempoFiltracion: '',
      emoTanks: [{ id: crypto.randomUUID(), brand: '', v1: '', v2: '', v3: '', v4: '' }],
      volumenMosto: '', hld: '', faltas: '', tiempoExtra: '', ato: ''
    };
    dashboard.saveEntry(newEntry);
  };

  return (
    <div className="dashboard-container">
      <div className="header-wrapper">
        <div style={{ display: 'flex', alignItems: 'flex-end' }}>
          <div className="header-title-box active">
            <LayoutDashboard size={24} /> Entrega de Turno
          </div>
        </div>
        
        <div className="header-nav" style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingBottom: '8px', marginBottom: '-2px' }}>
          
          
          <button 
            className={"btn-add " + (tvMode ? "active" : "")} 
            onClick={() => setTvMode(!tvMode)}
            style={{ display: 'flex', alignItems: 'center', gap: '5px', backgroundColor: tvMode ? '#dfb14b' : '#333', color: tvMode ? '#000' : '#fff', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', border: 'none', fontWeight: 'bold', fontSize: '11px' }}
          >
            <MonitorUp size={14} /> {tvMode ? 'MODO TV' : 'MODO TV'}
          </button>
          
          <button 
            onClick={() => setIsConfigMode(!isConfigMode)} 
            className={`btn-add ${isConfigMode ? 'btn-config' : ''}`} 
            style={{ display: 'flex', alignItems: 'center', gap: '5px', backgroundColor: isConfigMode ? '#dc2626' : '#333', color: '#fff', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', border: 'none', fontWeight: 'bold', fontSize: '11px' }}
          >
            <Settings size={14} /> CONFIGURAR TABLA
          </button>
          
          <button 
            onClick={addNewRow} 
            style={{ display: 'flex', alignItems: 'center', gap: '5px', backgroundColor: '#333', color: '#fff', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', border: 'none', fontWeight: 'bold', fontSize: '11px' }}
          >
            + AGREGAR FILA DE TURNO
          </button>
        </div>
      </div>

      <div className="main-content-card">
        <MainTable dashboard={dashboard} isConfigMode={isConfigMode} />
      </div>
    </div>
  );
}
