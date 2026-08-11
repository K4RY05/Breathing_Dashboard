// src/utils/csvProcessor.ts

import Papa from 'papaparse';
import type {
  RawSensorRecord,
  CleanSensorRecord,
  FilterOptions,
  FileDiagnostic,
  LoadResult,
} from '../types/sensorData';

const csvModules = import.meta.glob('../data/*.csv', { query: '?raw', import: 'default' });

export const getAvailableCsvFiles = (): string[] => {
  return Object.keys(csvModules);
};

const parseNum = (val: any): number | null => {
  if (val === null || val === undefined || val === '') return null;
  const num = typeof val === 'number' ? val : parseFloat(val);
  return isNaN(num) ? null : num;
};

const cleanRecord = (row: RawSensorRecord): CleanSensorRecord | null => {
  const rawDate = row.timestamp_iso || '';
  const dateObj = new Date(rawDate);

  if (isNaN(dateObj.getTime())) return null;

  return {
    timestamp: dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    dateObj,
    manifoldTemp: parseNum(row.manifold_temp ?? row.box_temp),
    manifoldRh: parseNum(row.manifold_rh),
    co2: parseNum(row.co2),
    co: parseNum(row.co_we),
    no: parseNum(row.no_we),
    no2: parseNum(row.no2_we),
    o3: parseNum(row.ox_we),
    pm1: parseNum(row.pm1),
    pm25: parseNum(row.pm25),
    pm10: parseNum(row.pm10),
    pressure: parseNum(row.pressure),
    dewPoint: parseNum(row.dew_point),
    windSpeed: parseNum(row.wind_speed),
    windDir: parseNum(row.wind_dir),
  };
};

/**
 * Lee solo el texto crudo de un CSV y extrae el timestamp de la última fila
 * (asumiendo que los archivos vienen ordenados cronológicamente dentro de sí
 * mismos). Es mucho más barato que un Papa.parse completo, y nos sirve para
 * decidir en qué orden cargar los archivos completos.
 */
const peekLastTimestamp = async (path: string): Promise<Date | null> => {
  try {
    const rawContent = (await csvModules[path]()) as string;
    const firstNewlineIndex = rawContent.indexOf('\n');
    const csvDataClean = firstNewlineIndex !== -1 ? rawContent.substring(firstNewlineIndex + 1) : rawContent;

    const lines = csvDataClean.trim().split('\n');
    if (lines.length < 2) return null; // solo header o vacío

    const headers = lines[0].split(',').map((h) => h.trim());
    const timestampIdx = headers.indexOf('timestamp_iso');
    if (timestampIdx === -1) return null;

    // Revisamos desde la última línea hacia atrás por si el archivo
    // termina con líneas corruptas/incompletas
    for (let i = lines.length - 1; i >= 1; i--) {
      const cols = lines[i].split(',');
      const raw = cols[timestampIdx]?.trim();
      if (!raw) continue;
      const d = new Date(raw);
      if (!isNaN(d.getTime())) return d;
    }
    return null;
  } catch {
    return null;
  }
};

/**
 * Devuelve las rutas de archivo ordenadas de más reciente a más antiguo,
 * según el timestamp de su última fila. Es una operación barata (no hace
 * parseo completo), pensada para decidir el orden de carga progresiva.
 */
export const sortFilesByRecency = async (filePaths: string[]): Promise<string[]> => {
  const withDates = await Promise.all(
    filePaths.map(async (path) => ({ path, date: await peekLastTimestamp(path) }))
  );

  return withDates
    .sort((a, b) => {
      if (!a.date && !b.date) return 0;
      if (!a.date) return 1; // sin fecha detectable, al final
      if (!b.date) return -1;
      return b.date.getTime() - a.date.getTime(); // más reciente primero
    })
    .map((f) => f.path);
};

const parseOneFile = async (
  path: string
): Promise<{ records: CleanSensorRecord[]; diagnostic: FileDiagnostic }> => {
  if (!csvModules[path]) {
    return {
      records: [],
      diagnostic: {
        path,
        status: 'missing',
        rawRowCount: 0,
        cleanedRowCount: 0,
        droppedRowCount: 0,
        papaParseErrors: 0,
        errorMessage: 'Archivo no encontrado en src/data (revisa el nombre/ruta exacto)',
      },
    };
  }

  try {
    const rawContent = (await csvModules[path]()) as string;
    const firstNewlineIndex = rawContent.indexOf('\n');
    const csvDataClean = firstNewlineIndex !== -1 ? rawContent.substring(firstNewlineIndex + 1) : rawContent;

    const parsed = Papa.parse<RawSensorRecord>(csvDataClean, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,
    });

    const rawRowCount = parsed.data.length;

    if (rawRowCount === 0) {
      return {
        records: [],
        diagnostic: {
          path,
          status: 'empty',
          rawRowCount: 0,
          cleanedRowCount: 0,
          droppedRowCount: 0,
          papaParseErrors: parsed.errors.length,
          errorMessage: 'El archivo no tiene filas de datos después de quitar el encabezado extra',
        },
      };
    }

    const cleaned = parsed.data.map(cleanRecord).filter((rec): rec is CleanSensorRecord => rec !== null);
    const droppedRowCount = rawRowCount - cleaned.length;

    return {
      records: cleaned,
      diagnostic: {
        path,
        status: parsed.errors.length > 0 ? 'parse_error' : 'ok',
        rawRowCount,
        cleanedRowCount: cleaned.length,
        droppedRowCount,
        papaParseErrors: parsed.errors.length,
        errorMessage:
          parsed.errors.length > 0 ? `Papa Parse reportó ${parsed.errors.length} error(es) de formato` : undefined,
      },
    };
  } catch (err: any) {
    return {
      records: [],
      diagnostic: {
        path,
        status: 'parse_error',
        rawRowCount: 0,
        cleanedRowCount: 0,
        droppedRowCount: 0,
        papaParseErrors: 0,
        errorMessage: err?.message || 'Error desconocido al leer el archivo',
      },
    };
  }
};

/**
 * Carga todos los archivos en paralelo (rápido, pero sin orden de aparición).
 */
export const loadAndProcessCsvData = async (
  filePaths: string[],
  options: FilterOptions = {}
): Promise<LoadResult> => {
  const results = await Promise.all(filePaths.map(parseOneFile));

  const combinedRecords = results
    .flatMap((r) => r.records)
    .sort((a, b) => a.dateObj.getTime() - b.dateObj.getTime());

  const diagnostics = results.map((r) => r.diagnostic);

  return {
    records: filterRecords(combinedRecords, options),
    diagnostics,
  };
};

/**
 * Carga progresiva: primero determina el orden por recencia (peek barato),
 * y va invocando onFileLoaded a medida que cada archivo termina de parsear
 * completo, empezando por el más reciente. Así la UI puede pintar el CSV
 * más nuevo apenas esté listo, sin esperar a los demás.
 */
export const loadCsvDataProgressive = async (
  filePaths: string[],
  onFileLoaded: (partial: { records: CleanSensorRecord[]; diagnostic: FileDiagnostic }) => void
): Promise<void> => {
  const orderedPaths = await sortFilesByRecency(filePaths);

  for (const path of orderedPaths) {
    const result = await parseOneFile(path);
    onFileLoaded(result);
  }
};

export const filterRecords = (
  records: CleanSensorRecord[],
  options: FilterOptions
): CleanSensorRecord[] => {
  let result = records;

  if (options.startDate) {
    result = result.filter((r) => r.dateObj >= options.startDate!);
  }

  if (options.endDate) {
    result = result.filter((r) => r.dateObj <= options.endDate!);
  }

  if (options.minPm25 !== undefined) {
    result = result.filter((r) => r.pm25 !== null && r.pm25 >= options.minPm25!);
  }

  if (options.maxPm25 !== undefined) {
    result = result.filter((r) => r.pm25 !== null && r.pm25 <= options.maxPm25!);
  }

  if (options.samplingInterval && options.samplingInterval > 1) {
    result = result.filter((_, index) => index % options.samplingInterval! === 0);
  }

  return result;
};