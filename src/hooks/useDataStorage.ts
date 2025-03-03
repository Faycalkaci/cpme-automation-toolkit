
import { useState, useEffect } from 'react';

interface DataStorageState<T> {
  data: T[];
  headers: string[];
}

export const useDataStorage = <T extends Record<string, any>>() => {
  const [state, setState] = useState<DataStorageState<T>>(() => {
    const storedState = localStorage.getItem('spreadsheet_data');
    return storedState 
      ? JSON.parse(storedState) 
      : { data: [], headers: [] };
  });

  useEffect(() => {
    localStorage.setItem('spreadsheet_data', JSON.stringify(state));
  }, [state]);

  const setData = (data: T[], headers: string[]) => {
    setState({ data, headers });
  };

  const clearData = () => {
    setState({ data: [], headers: [] });
  };

  return {
    data: state.data,
    headers: state.headers,
    setData,
    clearData,
    hasData: state.data.length > 0
  };
};
