import { useCallback, useMemo, useState } from 'react';
import DataEditor, {
  GridCell,
  GridColumn,
  Item,
  GridCellKind,
} from '@glideapps/glide-data-grid';
import '@glideapps/glide-data-grid/dist/index.css';
import { ParquetData, SortConfig, FilterConfig } from '../types';
import { sortRows, filterRows } from '../utils/parquetParser';

interface DataGridProps {
  data: ParquetData;
  onReset: () => void;
}

export function DataGrid({ data, onReset }: DataGridProps) {
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);
  const [filterConfig, setFilterConfig] = useState<FilterConfig>({
    column: '',
    value: '',
    isRegex: false,
  });

  // Process data with sorting and filtering
  const processedRows = useMemo(() => {
    let result = data.rows;

    // Apply filter
    if (filterConfig.column && filterConfig.value) {
      result = filterRows(
        result,
        filterConfig.column,
        filterConfig.value,
        filterConfig.isRegex
      );
    }

    // Apply sort
    if (sortConfig) {
      result = sortRows(result, sortConfig.column, sortConfig.direction);
    }

    return result;
  }, [data.rows, sortConfig, filterConfig]);

  // Define columns for glide-data-grid
  const columns: GridColumn[] = useMemo(
    () =>
      data.columns.map((col) => ({
        id: col.name,
        title: col.name,
        width: 150,
      })),
    [data.columns]
  );

  // Handle column header click for sorting
  const onColumnHeaderClick = useCallback(
    (colIndex: number) => {
      const columnName = data.columns[colIndex].name;
      setSortConfig((prev) => {
        if (prev?.column === columnName) {
          return {
            column: columnName,
            direction: prev.direction === 'asc' ? 'desc' : 'asc',
          };
        }
        return { column: columnName, direction: 'asc' };
      });
    },
    [data.columns]
  );

  // Get cell content
  const getCellContent = useCallback(
    ([col, row]: Item): GridCell => {
      const columnName = data.columns[col].name;
      const value = processedRows[row]?.[columnName];

      let displayValue = '';
      if (value === null || value === undefined) {
        displayValue = '';
      } else if (typeof value === 'object') {
        displayValue = JSON.stringify(value);
      } else {
        displayValue = String(value);
      }

      return {
        kind: GridCellKind.Text,
        data: displayValue,
        displayData: displayValue,
        allowOverlay: true,
      };
    },
    [data.columns, processedRows]
  );

  const handleFilterChange = (column: string, value: string) => {
    setFilterConfig((prev) => ({
      ...prev,
      column,
      value,
    }));
  };

  const toggleRegex = () => {
    setFilterConfig((prev) => ({
      ...prev,
      isRegex: !prev.isRegex,
    }));
  };

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="bg-white border-b border-gray-200 p-4 flex items-center gap-4 flex-wrap">
        <button
          onClick={onReset}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Upload New File
        </button>
        <div className="flex-1 flex items-center gap-2">
          <select
            value={filterConfig.column}
            onChange={(e) =>
              handleFilterChange(e.target.value, filterConfig.value)
            }
            className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select column to filter</option>
            {data.columns.map((col) => (
              <option key={col.name} value={col.name}>
                {col.name}
              </option>
            ))}
          </select>
          <input
            type="text"
            value={filterConfig.value}
            onChange={(e) =>
              handleFilterChange(filterConfig.column, e.target.value)
            }
            placeholder="Filter value..."
            className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 flex-1 max-w-md"
            disabled={!filterConfig.column}
          />
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={filterConfig.isRegex}
              onChange={toggleRegex}
              className="w-4 h-4"
              disabled={!filterConfig.column}
            />
            <span className="text-sm text-gray-700">Regex</span>
          </label>
        </div>
        <div className="text-sm text-gray-600">
          Showing {processedRows.length.toLocaleString()} of{' '}
          {data.totalRows.toLocaleString()} rows
        </div>
      </div>

      {/* Data Grid */}
      <div className="flex-1 relative">
        <div className="absolute inset-0">
          <DataEditor
            columns={columns}
            rows={processedRows.length}
            getCellContent={getCellContent}
            onHeaderClicked={onColumnHeaderClick}
            smoothScrollX={true}
            smoothScrollY={true}
            freezeColumns={0}
            rowMarkers="number"
            width="100%"
            height="100%"
            theme={{
            accentColor: '#3b82f6',
            accentLight: '#dbeafe',
            textDark: '#1f2937',
            textMedium: '#6b7280',
            textLight: '#9ca3af',
            textBubble: '#1f2937',
            bgIconHeader: '#f3f4f6',
            fgIconHeader: '#6b7280',
            textHeader: '#111827',
            textGroupHeader: '#6b7280',
            bgCell: '#ffffff',
            bgCellMedium: '#f9fafb',
            bgHeader: '#f9fafb',
            bgHeaderHasFocus: '#f3f4f6',
            bgHeaderHovered: '#f3f4f6',
            borderColor: '#e5e7eb',
            horizontalBorderColor: '#e5e7eb',
          }}
          />
        </div>
      </div>
    </div>
  );
}
