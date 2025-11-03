import { useCallback } from 'react';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  isLoading: boolean;
}

export function FileUpload({ onFileSelect, isLoading }: FileUploadProps) {
  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();

      const files = e.dataTransfer.files;
      if (files && files.length > 0) {
        const file = files[0];
        if (file.name.endsWith('.parquet')) {
          onFileSelect(file);
        } else {
          alert('Please select a .parquet file');
        }
      }
    },
    [onFileSelect]
  );

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        const file = files[0];
        if (file.name.endsWith('.parquet')) {
          onFileSelect(file);
        } else {
          alert('Please select a .parquet file');
        }
      }
    },
    [onFileSelect]
  );

  return (
    <div className="flex items-center justify-center h-full w-full bg-gray-50">
      <div
        className="border-4 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-blue-400 transition-colors cursor-pointer max-w-2xl"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() => document.getElementById('file-input')?.click()}
      >
        <input
          id="file-input"
          type="file"
          accept=".parquet"
          className="hidden"
          onChange={handleFileInput}
          disabled={isLoading}
        />
        <div className="text-6xl mb-4">📊</div>
        <h2 className="text-2xl font-bold mb-2 text-gray-700">
          {isLoading ? 'Loading...' : 'Upload Parquet File'}
        </h2>
        <p className="text-gray-500">
          Drag and drop a .parquet file here, or click to browse
        </p>
        <p className="text-sm text-gray-400 mt-4">
          Supports files with up to 100M rows
        </p>
      </div>
    </div>
  );
}
