import { useScan } from "@/contexts/ScanContext";

export default function ScanIndicator() {
  const { avatarScanning, scanPosition } = useScan();

  if (!avatarScanning) return null;

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-green-500 text-white px-4 py-2 rounded-lg animate-pulse">
      🔍 AVATAR ESCANEADO! Posição: {scanPosition.toFixed(1)}%
    </div>
  );
}