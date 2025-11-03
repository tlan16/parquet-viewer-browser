export interface ParquetColumn {
  name: string;
  type: string;
}

export interface ParquetData {
  columns: ParquetColumn[];
  rows: Record<string, unknown>[];
  totalRows: number;
}

export interface SortConfig {
  column: string;
  direction: 'asc' | 'desc';
}

export interface FilterConfig {
  column: string;
  value: string;
  isRegex: boolean;
}
