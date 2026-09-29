export type Status = 'green' | 'red' | 'gray';

export interface DataPoint {
  ac: string;
  bu: string;
  ly?: string;
}

export interface KPI {
  id: string;
  name: string;
  owner: string;
  unit: string;
  fy: string;
  iconType: 'water' | 'energy' | 'sensory' | 'co2' | 'default';
  dataPoints: DataPoint[];
  
  // ACTUAL
  mth: string;
  leMth: string;
  retoMes: string;
  
  // H1/H2
  h1: string;
  h2: string;
  
  // YEAR
  ytd: string;
  leYtd: string;
  buYear: string;
  retoAnual: string;

  isHidden?: boolean;
}

export interface Dimension {
  id: string;
  name: string;
  isCollapsed: boolean;
  kpis: KPI[];
}
