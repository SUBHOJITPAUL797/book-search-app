import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useDebounce } from './useDebounce';
import { telegramApi } from '../services/telegramApi';
import { useBookStore } from '../stores/bookStore';

export const useBookSearch = () => {
  const { 
    searchQuery, 
    currentPage, 
    setSearchResults, 
    setLoading, 
    setError,
    hasMore 
  } = useBookStore();
  
  const debouncedQuery = useDebounce(searchQuery, 500);
  
  const { isLoading, error, refetch } = useQuery({
    queryKey: ['books', debouncedQuery, currentPage],
    queryFn: async () => {
      try {
        console.log('🔍 Search hook: Starting search for:', debouncedQuery);
        setLoading(true);
        const result = await telegramApi.searchBooks(debouncedQuery, currentPage);
        console.log('📚 Search hook: Got results:', result);
        console.log('📚 Search hook: Results count:', result.results.length);
        setSearchResults(result.results, result.hasMore, currentPage);
        return result;
      } catch (err: any) {
        console.error('❌ Search hook: Error:', err);
        setError(err.message || 'An unknown error occurred');
        return null;
      }
    },
    enabled: true, // Always enabled to show books even with short queries
    staleTime: 5 * 60 * 1000,
    retry: false, // Disable automatic retries, we handle it manually
  });

  useEffect(() => {
    // This effect is to handle the initial loading state when the query changes
    console.log('🔄 Search hook: Query changed to:', debouncedQuery);
    setLoading(true);
    setError(null);
  }, [debouncedQuery, setLoading, setError]);

  const loadMore = () => {
    if (hasMore && !isLoading) {
      useBookStore.getState().loadMore();
    }
  };

  return {
    isLoading: isLoading,
    error: error,
    refetch,
    loadMore,
    hasMore
  };
};