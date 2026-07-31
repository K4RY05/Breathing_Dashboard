import Papa from 'papaparse';
import type { RawSensorRecord, CleanSensorRecord, FilterOptions } from '../types/sensorData';

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
    // 1. Condiciones Ambientales
    manifoldTemp: parseNum(row.manifold_temp ?? row.box_temp),
    manifoldRh: parseNum(row.manifold_rh),
    // 2. Calidad del Aire
    co2: parseNum(row.co2),
    co: parseNum(row.co_we),
    no: parseNum(row.no_we),
    no2: parseNum(row.no2_we),
    o3: parseNum(row.ox_we),
    // 3. Material Particulado
    pm1: parseNum(row.pm1),
    pm25: parseNum(row.pm25),
    pm10: parseNum(row.pm10),
    // 4. Variables Meteorológicas
    pressure: parseNum(row.pressure),
    dewPoint: parseNum(row.dew_point),
    // 5. Viento
    windSpeed: parseNum(row.wind_speed),
    windDir: parseNum(row.wind_dir),
  };
};

export const loadAndProcessCsvData = async (
  filePaths: string[],
  options: FilterOptions = {}
): Promise<CleanSensorRecord[]> => {
  let combinedRecords: CleanSensorRecord[] = [];

  for (const path of filePaths) {
    if (!csvModules[path]) continue;

    const rawContent = (await csvModules[path]()) as string;

    // Se salta la primera línea (deviceID,...) para usar la línea 2 como encabezados reales
    const firstNewlineIndex = rawContent.indexOf('\n');
    const csvDataClean = firstNewlineIndex !== -1 ? rawContent.substring(firstNewlineIndex + 1) : rawContent;

    const parsed = Papa.parse<RawSensorRecord>(csvDataClean, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,
    });

    const cleaned = parsed.data
      .map(cleanRecord)
      .filter((rec): rec is CleanSensorRecord => rec !== null);

    combinedRecords.push(...cleaned);
  }

  combinedRecords.sort((a, b) => a.dateObj.getTime() - b.dateObj.getTime());

  return filterRecords(combinedRecords, options);
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