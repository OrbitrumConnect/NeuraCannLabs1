import { createContext, useContext, useState, ReactNode } from 'react';

interface ScanContextType {
  avatarScanning: boolean;
  setAvatarScanning: (scanning: boolean) => void;
  scanPosition: number;
  setScanPosition: (position: number) => void;
}

const ScanContext = createContext<ScanContextType | undefined>(undefined);

export function ScanProvider({ children }: { children: ReactNode }) {
  const [avatarScanning, setAvatarScanning] = useState(false);
  const [scanPosition, setScanPosition] = useState(0);

  return (
    <ScanContext.Provider value={{
      avatarScanning,
      setAvatarScanning,
      scanPosition,
      setScanPosition
    }}>
      {children}
    </ScanContext.Provider>
  );
}

export function useScan() {
  const context = useContext(ScanContext);
  if (context === undefined) {
    throw new Error('useScan deve ser usado dentro de um ScanProvider');
  }
  return context;
}