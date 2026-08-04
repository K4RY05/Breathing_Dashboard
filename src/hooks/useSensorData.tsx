// src/hooks/useSensorData.ts

import { useState, useEffect, useMemo, useRef } from 'react';
import type { CleanSensorRecord, FilterOptions, FileDiagnostic } from '../types/sensorData';
import { loadCsvDataProgressive, getAvailableCsvFiles, filterRecords } from '../utils/csvProcessor';

export const useSensorData = (initialFiles?: string[], options?: FilterOptions) => {
  const [data, setData] = useState<CleanSensorRecord[]>([]);
  const [diagnostics, setDiagnostics] = useState<FileDiagnostic[]>([]);
  const [loading, setLoading] = useState<boolean>(true); // true = aún faltan archivos por llegar
  const [error, setError] = useState<string | null>(null);

  const availableFiles = getAvailableCsvFiles();
  const rawRecordsRef = useRef<CleanSensorRecord[]>([]); // sin filtrar, acumulado

  const selectedFiles = useMemo(
    () => (initialFiles && initialFiles.length > 0 ? initialFiles : availableFiles),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [JSON.stringify(initialFiles)]
  );

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);
    setData([]);
    setDiagnostics([]);
    rawRecordsRef.current = [];

    if (selectedFiles.length === 0) {
      setError('No se encontró ningún archivo CSV en src/data');
      setLoading(false);
      return;
    }

    let filesProcessed = 0;

    loadCsvDataProgressive(selectedFiles, ({ records, diagnostic }) => {
      if (!isMounted) return;

      filesProcessed += 1;

      // Acumulamos y re-ordenamos (el archivo más nuevo puede llegar
      // primero, pero dentro de la serie de tiempo el orden debe ser cronológico)
      rawRecordsRef.current = rawRecordsRef.current
        .concat(records)
        .sort((a, b) => a.dateObj.getTime() - b.dateObj.getTime());

      setData(filterRecords(rawRecordsRef.current, options || {}));
      setDiagnostics((prev) => [...prev, diagnostic]);

      const icon = diagnostic.status === 'ok' ? '✅' : '⚠️';
      console.log(
        `${icon} [${filesProcessed}/${selectedFiles.length}] ${diagnostic.path} — status: ${diagnostic.status}, ` +
        `filas limpias: ${diagnostic.cleanedRowCount}` +
        (diagnostic.errorMessage ? ` — ${diagnostic.errorMessage}` : '')
      );

      // Ya podemos quitar el loading global desde que llega el primer archivo
      // (el más reciente), aunque los demás sigan llegando en segundo plano
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
  }, [JSON.stringify(selectedFiles), JSON.stringify(options)]);

  return { data, diagnostics, loading, error, availableFiles };
};