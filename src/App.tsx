import { useState, useCallback } from 'react';
import { FileUpload } from './components/FileUpload';
import { DataGrid } from './components/DataGrid';
import { parseParquetFile } from './utils/parquetParser';
import { ParquetData } from './types';

function App() {
  const [data, setData] = useState<ParquetData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = useCallback(async (file: File) => {
    setIsLoading(true);
    setError(null);

    try {
      const parsedData = await parseParquetFile(file);
      setData(parsedData);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'An unknown error occurred'
      );
      console.error('Error loading file:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleReset = useCallback(() => {
    setData(null);
    setError(null);
  }, []);

  return (
    <div className="h-full w-full">
      {error && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded z-50 max-w-2xl">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {!data ? (
        <FileUpload onFileSelect={handleFileSelect} isLoading={isLoading} />
      ) : (
        <DataGrid data={data} onReset={handleReset} />
      )}
    </div>
  );
}

export default App;
