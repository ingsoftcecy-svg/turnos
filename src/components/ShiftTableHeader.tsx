import React from 'react';

interface ShiftTableHeaderProps {
  isConfigMode: boolean;
}

export const ShiftTableHeader: React.FC<ShiftTableHeaderProps> = ({ isConfigMode }) => (
  <thead>
    <tr>
      <th className="header-black" style={{ padding: '10px' }}>FECHA</th>
      <th className="header-black" style={{ padding: '10px', textAlign: 'center' }}>TURNO</th>
      <th className="header-black" style={{ padding: '10px' }}>RESPONSABLE DE TURNO</th>
      
      <th className="header-gold">FALLA DE EQUIPOS (# DE EVENTOS)</th>
      <th className="header-gold">FALLAS EXTERNAS</th>
      <th className="header-gold">PRECURSORES DE INCIDENTES DE PROCESO (#)</th>
      <th className="header-gold">ACUMULADO DE ATRASO EN COCEDOR</th>
      
      <th colSpan={6} className="header-gold group-divider-th" style={{ padding: '10px', fontSize: '13px' }}>COLOR</th>
      
      <th className="header-gold">TIEMPO DE RESIDENCIA</th>
      <th className="header-gold">TIEMPO DE FILTRACIÓN</th>
      
      <th colSpan={6} className="header-gold group-divider-th" style={{ padding: '10px', fontSize: '13px' }}>EMO DE TCC</th>
      
      <th className="header-gold">VOLUMEN DE MOSTO FRÍO</th>
      <th className="header-gold">HLD (# DE COCTOS FUERA)</th>
      <th className="header-gold">FALTAS (#)</th>
      <th className="header-gold">TIEMPO EXTRA (HORAS)</th>
      <th className="header-gold">ATO REALIZADOS Y NOTIFICADOS (#)</th>
      {isConfigMode && <th style={{ backgroundColor: '#fff', border: 'none' }}></th>}
    </tr>
  </thead>
);
