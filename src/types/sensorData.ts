// src/types/sensorData.ts

export interface RawSensorRecord {
  timestamp_iso?: string;
  box_temp?: number;
  manifold_temp?: number;
  manifold_rh?: number;
  pressure?: number;
  dew_point?: number;
  noise?: number;
  solar?: number;
  wind_dir?: number;
  wind_speed?: number;
  co2?: number;
  co_we?: number;
  no_we?: number;
  no2_we?: number;
  ox_we?: number;
  pm1?: number;
  pm25?: number;
  pm10?: number;
  [key: string]: any;
}

export interface CleanSensorRecord {
  timestamp: string;
  dateObj: Date;
  // 1. Condiciones Ambientales
  manifoldTemp: number | null;
  manifoldRh: number | null;
  // 2. Calidad del Aire
  co2: number | null;
  co: number | null;
  no: number | null;
  no2: number | null;
  o3: number | null;
  // 3. Material Particulado
  pm1: number | null;
  pm25: number | null;
  pm10: number | null;
  // 4. Variables Meteorológicas
  pressure: number | null;
  dewPoint: number | null;
  // 5. Viento
  windSpeed: number | null;
  windDir: number | null;
}

export interface FilterOptions {
  startDate?: Date;
  endDate?: Date;
  minPm25?: number;
  maxPm25?: number;
  samplingInterval?: number;
}

// --- Diagnóstico de carga de archivos CSV ---

export type FileLoadStatus = 'ok' | 'missing' | 'empty' | 'parse_error';

export interface FileDiagnostic {
  path: string;
  status: FileLoadStatus;
  rawRowCount: number;
  cleanedRowCount: number;
  droppedRowCount: number;
  papaParseErrors: number;
  errorMessage?: string;
}

export interface LoadResult {
  records: CleanSensorRecord[];
  diagnostics: FileDiagnostic[];
}
export interface FilterOptions {
  selectedDate?: string; // Formato 'YYYY-MM-DD'
  startHour?: number;    // 0 a 23
  endHour?: number;      
}