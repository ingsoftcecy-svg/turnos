import React from 'react';

interface ShiftTableHeaderProps {
  isConfigMode: boolean;
}

const theadStyle: React.CSSProperties = { textTransform: 'uppercase' };
const baseHeaderStyle: React.CSSProperties = { backgroundColor: '#000', color: '#fff', padding: '10px', border: '1px solid #333' };
const gradStyle: React.CSSProperties = { background: 'linear-gradient(180deg, #e8c678 0%, #d3a13b 100%)', color: '#000', padding: '5px', border: '1px solid #b8860b', fontSize: '11px' };
const gradGroupStyle: React.CSSProperties = { ...gradStyle, padding: '10px', fontSize: '13px', fontWeight: 'bold' };

export const ShiftTableHeader: React.FC<ShiftTableHeaderProps> = ({ isConfigMode }) => (
  <thead style={theadStyle}>
    <tr>
      {isConfigMode && <th style={{ backgroundColor: '#fff', border: 'none' }}></th>}
    </tr>
    <tr style={{ borderBottom: '2px solid #d3a13b' }}>
      <th style={baseHeaderStyle}>FECHA</th>
      <th style={baseHeaderStyle}>TURNO</th>
      <th style={baseHeaderStyle}>Responsable de turno</th>
      
      <th style={gradStyle}>Falla de equipos (# de eventos)</th>
      <th style={gradStyle}>Fallas externas</th>
      <th style={gradStyle}>Precursores de incidentes de proceso (#)</th>
      <th style={gradStyle}>Acumulado de atraso en cocedor</th>
      
      <th colSpan={6} style={gradGroupStyle}>Color</th>
      
      <th style={gradStyle}>Tiempo de residencia</th>
      <th style={gradStyle}>Tiempo de filtración</th>
      
      <th colSpan={6} style={gradGroupStyle}>EMO de TCC</th>
      
      <th style={gradStyle}>Volumen de mosto frío</th>
      <th style={gradStyle}>HLD (# de coctos fuera)</th>
      <th style={gradStyle}>Faltas (#)</th>
      <th style={gradStyle}>Tiempo extra (horas)</th>
      <th style={gradStyle}>ATO realizados y notificados (#)</th>
      {isConfigMode && <th style={{ backgroundColor: '#fff', border: 'none' }}></th>}
    </tr>
  </thead>
);
