import { useState } from 'react';
import { SearchFormProps, FIELD_ALIASES } from '../types';

export default function SearchForm({
  onSubmit,
  currentPage,
  totalPages,
  totalResults,
  isLoading
}: SearchFormProps) {
  const [query, setQuery] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [validationError, setValidationError] = useState('');

  // Format search query before submission
  const formatSearchQuery = (rawQuery: string): string => {
    return rawQuery.split(/\s+/).map(term => {
      // Handle field=value terms
      if (term.includes('=')) {
        const [field, value] = term.split('=');
        const normalizedField = field.toLowerCase();

        // Get canonical field name from aliases
        const canonicalField = FIELD_ALIASES[normalizedField] || normalizedField;

        // Special formatting for known fields
        if (canonicalField === 'action') {
          return `action=${value.toUpperCase()}`;
        }
        if (canonicalField === 'log_status') {
          return `log_status=${value.toUpperCase()}`;
        }
        if (canonicalField === 'protocol') {
          return `protocol=${value}`;
        }

        return `${canonicalField}=${value}`;
      }
      return term;
    }).join(' ');
  };

  const handleSearch = (newPage = 1) => {
    try {
      setValidationError('');


      if (startTime && endTime && parseInt(startTime) > parseInt(endTime)) {
        throw new Error('Start time must be before end time');
      }

      // Format the query before submission
      const formattedQuery = query ? formatSearchQuery(query) : '';

      onSubmit({
        query: formattedQuery,
        startTime: startTime ? parseInt(startTime) : undefined,
        endTime: endTime ? parseInt(endTime) : undefined,
        page: newPage
      });
    } catch (error) {
      setValidationError(error instanceof Error ? error.message : 'Invalid search parameters');
    }
  };


  const SearchExamples = () => (
    <div className="mt-2 text-xs text-gray-500">
      <div>Examples:</div>
      <ul className="list-disc pl-5">
        <li><code>action=REJECT</code> (will auto-uppercase)</li>
        <li><code>src=192.168.1.1</code></li>
        <li><code>status=FAIL</code> (will auto-uppercase)</li>
        <li><code>protocol=6</code></li>
      </ul>
    </div>
  );

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-4">
      
      <div className="mb-3">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Search Query
        </label>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="action=REJECT src=192.168.1.1"
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
        />
        <SearchExamples />
      </div>

      
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Start Time (epoch)
          </label>
          <input
            type="number"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            placeholder="1725850449"
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            End Time (epoch)
          </label>
          <input
            type="number"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            placeholder="1725855086"
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
      </div>

      
      {validationError && (
        <div className="mb-3 p-2 text-sm text-red-600 bg-red-50 rounded-md">
          {validationError}
        </div>
      )}
      <button
        onClick={() => handleSearch(1)}
        disabled={isLoading}
        className={`w-full py-2 px-4 rounded-md text-white font-medium ${isLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
          }`}
      >
        {isLoading ? 'Searching...' : 'Search'}
      </button>
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-3">
          <button
            onClick={() => handleSearch(currentPage - 1)}
            disabled={currentPage <= 1 || isLoading}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-sm text-gray-600">
            Page {currentPage} of {totalPages} • {totalResults} results
          </span>
          <button
            onClick={() => handleSearch(currentPage + 1)}
            disabled={currentPage >= totalPages || isLoading}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}