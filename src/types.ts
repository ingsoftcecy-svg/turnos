export interface TankMeasurement {
  id: string;
  brand: string;
  v1: string;
  v2: string;
}

export interface EMOMeasurement {
  id: string;
  brand: string;
  v1: string;
  v2: string;
  v3: string;
  v4: string;
}

export interface ShiftEntry {
  id: string;
  date: string; // YYYY-MM-DD
  shift: string; // "1", "2", "3"
  owner: string;
  
  fallaEquipos: string;
  fallasExternas: string;
  precursores: string;
  acumulado: string;
  
  colorTanks: TankMeasurement[];
  colorExtra1: string;
  colorExtra2: string;
  
  tiempoResidencia: string;
  tiempoFiltracion: string;
  
  emoTanks: EMOMeasurement[];
  
  volumenMosto: string;
  hld: string;
  faltas: string;
  tiempoExtra: string;
  ato: string;
}
