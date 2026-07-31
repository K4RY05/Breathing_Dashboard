import { useState, useEffect } from 'react';
import type { CleanSensorRecord, FilterOptions } from '../types/sensorData';
import { loadAndProcessCsvData, getAvailableCsvFiles } from '../utils/csvProcessor';

export const useSensorData = (initialFiles?: string[], options?: FilterOptions) => {
  const [data, setData] = useState<CleanSensorRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const availableFiles = getAvailableCsvFiles();
  const selectedFiles = initialFiles && initialFiles.length > 0 ? initialFiles : [availableFiles[0]];

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    loadAndProcessCsvData(selectedFiles, options)
      .then((processed) => {
        if (isMounted) {
          setData(processed);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.message || 'Error al procesar los archivos CSV');
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [JSON.stringify(initialFiles), JSON.stringify(options)]);

  return { data, loading, error, availableFiles };
};