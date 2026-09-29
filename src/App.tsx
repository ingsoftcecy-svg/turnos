import { useState, useEffect } from 'react';
import { LayoutDashboard, MonitorUp } from 'lucide-react';
import { useDashboard } from './hooks/useDashboard';
import { MainTable } from './components/MainTable';
import './index.css';

export default function App() {
  const dashboard = useDashboard();
  const [tvMode, setTvMode] = useState(false);

  useEffect(() => {
    if (tvMode) {
      document.body.style.zoom = '1.4';
    } else {
      document.body.style.zoom = '0.70';
    }
  }, [tvMode]);

  return (
    <div className="dashboard-container">
      <div className="header-wrapper">
        <div style={{ display: 'flex', alignItems: 'flex-end' }}>
          <div 
            className="header-title-box active"
            style={{ display: 'flex', alignItems: 'center', gap: '10px' }}
          >
            <LayoutDashboard size={20} /> Entrega de Turno
          </div>
        </div>
        <div className="header-nav" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <button 
            className={"btn-add " + (tvMode ? "active" : "")} 
            onClick={() => setTvMode(!tvMode)}
            style={{ display: 'flex', alignItems: 'center', gap: '5px', backgroundColor: tvMode ? '#e8c678' : '#333', color: tvMode ? '#000' : '#fff', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', border: 'none', fontWeight: 'bold' }}
            title="Activar o desactivar tamaño gigante para Televisión"
          >
            <MonitorUp size={16} /> Modo TV
          </button>
        </div>
      </div>

      <MainTable dashboard={dashboard} />
    </div>
  );
}
