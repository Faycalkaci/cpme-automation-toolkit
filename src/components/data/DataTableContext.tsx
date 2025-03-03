
import React, { createContext, useContext, useState, useEffect } from 'react';

interface DataTableContextType {
  data: any[];
  headers: string[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filteredData: any[];
  selectedRows: {[key: number]: boolean};
  setSelectedRows: React.Dispatch<React.SetStateAction<{[key: number]: boolean}>>;
  allSelected: boolean;
  setAllSelected: React.Dispatch<React.SetStateAction<boolean>>;
  toggleRowSelection: (index: number) => void;
  toggleSelectAll: () => void;
  selectedCount: number;
  getSelectedRowsData: () => any[];
  onGeneratePdf: (selectedRows: any[]) => void;
  onSendEmail: (selectedRows: any[]) => void;
}

const DataTableContext = createContext<DataTableContextType | undefined>(undefined);

export const useDataTable = () => {
  const context = useContext(DataTableContext);
  if (!context) {
    throw new Error('useDataTable must be used within a DataTableProvider');
  }
  return context;
};

export const DataTableProvider: React.FC<{
  children: React.ReactNode;
  data: any[];
  headers: string[];
  onGeneratePdf: (selectedRows: any[]) => void;
  onSendEmail: (selectedRows: any[]) => void;
}> = ({ children, data, headers, onGeneratePdf, onSendEmail }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState(data);
  const [selectedRows, setSelectedRows] = useState<{[key: number]: boolean}>({});
  const [allSelected, setAllSelected] = useState(false);
  
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredData(data);
    } else {
      const lowercasedTerm = searchTerm.toLowerCase();
      const filtered = data.filter(item => {
        return Object.values(item).some(
          value => 
            value && 
            typeof value === 'string' && 
            value.toLowerCase().includes(lowercasedTerm)
        );
      });
      setFilteredData(filtered);
    }
  }, [data, searchTerm]);
  
  const toggleRowSelection = (index: number) => {
    setSelectedRows(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };
  
  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedRows({});
    } else {
      const newSelection: {[key: number]: boolean} = {};
      filteredData.forEach((_, index) => {
        newSelection[index] = true;
      });
      setSelectedRows(newSelection);
    }
    setAllSelected(!allSelected);
  };
  
  const selectedCount = Object.values(selectedRows).filter(Boolean).length;
  
  const getSelectedRowsData = () => {
    return filteredData.filter((_, index) => selectedRows[index]);
  };

  return (
    <DataTableContext.Provider
      value={{
        data,
        headers,
        searchTerm,
        setSearchTerm,
        filteredData,
        selectedRows,
        setSelectedRows,
        allSelected,
        setAllSelected,
        toggleRowSelection,
        toggleSelectAll,
        selectedCount,
        getSelectedRowsData,
        onGeneratePdf,
        onSendEmail
      }}
    >
      {children}
    </DataTableContext.Provider>
  );
};
