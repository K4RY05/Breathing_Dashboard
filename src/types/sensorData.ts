export interface RawSensorRecord {
  timestamp_iso?: string;
  box_temp?: number;
  manifold_temp?: number;
  manifold_rh?: number;
  pm1?: number;
  pm25?: number;
  pm10?: number;
  co2?: number;
  pressure?: number;
  noise?: number;
  [key: string]: any;
}

export interface CleanSensorRecord {
  timestamp: string;
  dateObj: Date;
  pm25: number | null;
  pm10: number | null;
  temperature: number | null;
  humidity: number | null;
}

export interface FilterOptions {
  startDate?: Date;
  endDate?: Date;
  minPm25?: number;
  maxPm25?: number;
  samplingInterval?: number;
}