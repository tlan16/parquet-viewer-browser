import { parquetReadObjects } from 'hyparquet';
import { ParquetData, ParquetColumn } from '../types';

export async function parseParquetFile(file: File): Promise<ParquetData> {
  try {
    const arrayBuffer = await file.arrayBuffer();

    // Use hyparquet to read the parquet file
    const rows = await parquetReadObjects({
      file: arrayBuffer,
    });

    if (rows.length === 0) {
      return {
        columns: [],
        rows: [],
        totalRows: 0,
      };
    }

    // Extract column information from the first row
    const firstRow = rows[0];
    const columns: ParquetColumn[] = Object.keys(firstRow).map((name) => ({
      name,
      type: typeof firstRow[name],
    }));

    return {
      columns,
      rows,
      totalRows: rows.length,
    };
  } catch (error) {
    console.error('Error parsing parquet file:', error);
    throw new Error(
      `Failed to parse parquet file: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

export function filterRows(
  rows: Record<string, unknown>[],
  column: string,
  value: string,
  isRegex: boolean
): Record<string, unknown>[] {
  if (!value) return rows;

  try {
    if (isRegex) {
      const regex = new RegExp(value, 'i');
      return rows.filter((row) => {
        const cellValue = String(row[column] ?? '');
        return regex.test(cellValue);
      });
    } else {
      const lowerValue = value.toLowerCase();
      return rows.filter((row) => {
        const cellValue = String(row[column] ?? '').toLowerCase();
        return cellValue.includes(lowerValue);
      });
    }
  } catch (error) {
    console.error('Filter error:', error);
    return rows;
  }
}

export function sortRows(
  rows: Record<string, unknown>[],
  column: string,
  direction: 'asc' | 'desc'
): Record<string, unknown>[] {
  return [...rows].sort((a, b) => {
    const aVal = a[column];
    const bVal = b[column];

    // Handle null/undefined
    if (aVal == null && bVal == null) return 0;
    if (aVal == null) return direction === 'asc' ? -1 : 1;
    if (bVal == null) return direction === 'asc' ? 1 : -1;

    // Compare values
    let comparison = 0;
    if (typeof aVal === 'number' && typeof bVal === 'number') {
      comparison = aVal - bVal;
    } else {
      comparison = String(aVal).localeCompare(String(bVal));
    }

    return direction === 'asc' ? comparison : -comparison;
  });
}
