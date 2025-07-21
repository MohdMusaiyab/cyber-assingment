import { useState } from 'react';
import { SearchResponse, SearchParams } from './types';
import SearchForm from './components/SearchForm';
import ResultsTable from './components/ResultsTable';
import Alert from './components/Alert';

export default function App() {
  const [searchData, setSearchData] = useState<SearchResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (params: SearchParams) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const queryParams = new URLSearchParams();
      if (params.query) queryParams.append('q', params.query);
      if (params.startTime) queryParams.append('start', params.startTime.toString());
      if (params.endTime) queryParams.append('end', params.endTime.toString());
      if (params.page) queryParams.append('page', params.page.toString());

      const response = await fetch(`http://localhost:8000/api/search/?${queryParams.toString()}`);
      if (!response.ok) throw new Error(`API Error: ${response.status}`);
      
      const data: SearchResponse = await response.json();
      setSearchData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed');
      console.error('Search error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Event Log Explorer</h1>
        
        <div className="grid grid-cols-1 gap-6">
          <SearchForm
            onSubmit={handleSearch}
            currentPage={searchData?.page || 1}
            totalPages={searchData?.total_pages || 0}
            totalResults={searchData?.total_results || 0}
            isLoading={isLoading}
          />

          {error && (
            <Alert type="error" message={error} />
          )}

          {searchData && (
            <>
              <div className="text-sm text-gray-500">
                Showing {searchData.results.length} of {searchData.total_results} results
                {searchData.time_ms && ` in ${searchData.time_ms}ms`}
              </div>
              <ResultsTable results={searchData.results} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}