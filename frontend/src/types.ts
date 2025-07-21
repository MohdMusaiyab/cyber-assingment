// Event data structure 
export interface LogEvent {
  serialno: string;
  version: string;
  account_id: string;
  instance_id: string;
  srcaddr: string;
  dstaddr: string;
  srcport: string;
  dstport: string;
  protocol: string;
  packets: string;
  bytes: string;
  starttime: number;
  endtime: number;
  action: string;  // Case-sensitive (REJECT/ACCEPT)
  log_status: string;  // Case-sensitive (OK/FAIL)
  file: string;
  raw?: string;  // Original log line
}

// Search parameters 
export interface SearchParams {
  query?: string;
  startTime?: number;
  endTime?: number;
  page?: number;
}

// API response format
export interface SearchResponse {
  results: LogEvent[];
  page: number;
  total_pages: number;
  total_results: number;
  time_ms?: number;
  debug?: {
    files_processed: number;
    lines_scanned: number;
    sample_lines_shown?: number;
  };
}

// Search form props
export interface SearchFormProps {
  onSubmit: (params: SearchParams) => void;
  currentPage: number;
  totalPages: number;
  totalResults: number;
  isLoading: boolean;
}

// Results table props
export interface ResultsTableProps {
  results: LogEvent[];
}

// Alert component props
export interface AlertProps {
  type: 'error' | 'warning' | 'info';
  message: string;
}

// App component state
export interface AppState {
  searchData: SearchResponse | null;
  isLoading: boolean;
  error: string | null;
}

// Field mapping for search 
export interface SearchFieldMap {
  [key: string]: keyof LogEvent;
}

// Supported search field aliases
export const FIELD_ALIASES: SearchFieldMap = {
  // Primary fields
  'src': 'srcaddr',
  'srcaddr': 'srcaddr',
  'source': 'srcaddr',
  'dst': 'dstaddr',
  'dstaddr': 'dstaddr',
  'destination': 'dstaddr',
  
  // Protocol fields
  'proto': 'protocol',
  'protocol': 'protocol',
  
  // Action fields
  'act': 'action',
  'action': 'action',
  
  // Status fields
  'status': 'log_status',
  'logstatus': 'log_status',
  'log_status': 'log_status'
};

// Time range preset options
export interface TimeRangePreset {
  label: string;
  start: number;
  end: number;
}

// Pagination controls props
export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  disabled?: boolean;
}