import { useState, useEffect, useCallback } from 'react';

export function useFetch(url, query = '') {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [initialLoad, setInitialLoad] = useState(true);

  const fetchData = useCallback(async (pageNum, isInitial = false) => {
    if (!url) return;
    
    try {
      setLoading(true);
      const limit = 12;
      const queryParams = new URLSearchParams({
        _page: pageNum,
        _limit: limit,
        ...(query && { mission_name: `_like=${query}` })
      });
      
      const response = await fetch(`${url}?${queryParams}`);
      
      if (!response.ok) throw new Error('Failed to fetch');
      
      const result = await response.json();
      
      if (isInitial) {
        setData(result);
      } else {
        setData(prev => [...prev, ...result]);
      }
      
      setHasMore(result.length === limit);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setInitialLoad(false);
    }
  }, [url, query]);

  useEffect(() => {
    setPage(1);
    setData([]);
    setHasMore(true);
    fetchData(1, true);
  }, [query]);

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchData(nextPage, false);
    }
  }, [loading, hasMore, page, fetchData]);

  return { data, loading, error, hasMore, loadMore, initialLoad };
}