// src/hooks/useSensorData.ts

import { useState, useEffect, useMemo } from 'react';
import type { CleanSensorRecord, FilterOptions, FileDiagnostic } from '../types/sensorData';
import { loadCsvDataProgressive, getAvailableCsvFiles, filterRecords } from '../utils/csvProcessor';

export const useSensorData = (initialFiles?: string[], options?: FilterOptions) => {
  const [rawRecords, setRawRecords] = useState<CleanSensorRecord[]>([]);
  const [diagnostics, setDiagnostics] = useState<FileDiagnostic[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const availableFiles = getAvailableCsvFiles();

  const selectedFiles = useMemo(
    () => (initialFiles && initialFiles.length > 0 ? initialFiles : availableFiles),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [JSON.stringify(initialFiles)]
  );

  // 1. Carga progresiva de CSVs (SOLO se ejecuta al cambiar de archivos, NO al cambiar filtros)
  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);
    setRawRecords([]);
    setDiagnostics([]);

    if (selectedFiles.length === 0) {
      setError('No se encontró ningún archivo CSV en src/data');
      setLoading(false);
      return;
    }

    let filesProcessed = 0;
    let accumulated: CleanSensorRecord[] = [];

    loadCsvDataProgressive(selectedFiles, ({ records, diagnostic }) => {
      if (!isMounted) return;

      filesProcessed += 1;

      // Acumulamos y ordenamos cronológicamente
      accumulated = accumulated
        .concat(records)
        .sort((a, b) => a.dateObj.getTime() - b.dateObj.getTime());

      setRawRecords([...accumulated]);
      setDiagnostics((prev) => [...prev, diagnostic]);

      const icon = diagnostic.status === 'ok' ? '✅' : '⚠️';
      console.log(
        `${icon} [${filesProcessed}/${selectedFiles.length}] ${diagnostic.path} — status: ${diagnostic.status}, ` +
        `filas limpias: ${diagnostic.cleanedRowCount}` +
        (diagnostic.errorMessage ? ` — ${diagnostic.errorMessage}` : '')
      );

      if (filesProcessed === 1) {
        setLoading(false);
      }
    }).catch((err) => {
      if (isMounted) {
        setError(err.message || 'Error al procesar los archivos CSV');
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(selectedFiles)]);

  // 2. Filtrado reactivo e instantáneo en memoria usando `dateObj`
  const filteredData = useMemo(() => {
    if (!rawRecords.length) return [];

    // Aplicar filtros base (si usas filterRecords existente)
    let result = filterRecords(rawRecords, options || {});

    // Filtrado por Día y Hora sobre el objeto `dateObj`
    if (options?.selectedDate || options?.startHour !== undefined || options?.endHour !== undefined) {
      result = result.filter((record) => {
        const date = record.dateObj;

        // Filtro por Día (comparación en formato local YYYY-MM-DD)
        if (options.selectedDate) {
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const day = String(date.getDate()).padStart(2, '0');
          const recordDateStr = `${year}-${month}-${day}`;

          if (recordDateStr !== options.selectedDate) return false;
        }

        // Filtro por Rango de Horas (0 - 23)
        const hour = date.getHours();
        if (options.startHour !== undefined && hour < options.startHour) return false;
        if (options.endHour !== undefined && hour > options.endHour) return false;

        return true;
      });
    }

    return result;
  }, [rawRecords, options]);

  return { data: filteredData, rawData: rawRecords, diagnostics, loading, error, availableFiles };
};