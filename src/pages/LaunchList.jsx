import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchLaunches, resetLaunches } from '../store/launchesSlice';
import { FaRocket, FaSearch, FaTimes } from 'react-icons/fa';
import LaunchCard from '../components/LaunchCard/LaunchCard';
import LaunchModal from '../components/LaunchModal/LaunchModal';
import Spinner from '../components/Spinner/Spinner';

function LaunchList() {
  const dispatch = useDispatch();
  const launchesData = useSelector((state) => state.launches);
  const launches = launchesData?.launches || [];
  const loading = launchesData?.loading || false;
  const error = launchesData?.error || null;
  const hasMore = launchesData?.hasMore !== false;
  const initialLoad = launchesData?.initialLoad !== false;
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLaunch, setSelectedLaunch] = useState(null);
  const loadMoreRef = useRef(null);
  const [debounceTimer, setDebounceTimer] = useState(null);

  useEffect(() => {
    dispatch(fetchLaunches({ page: 1, query: 'CRS-26' }));
  }, [dispatch]);

  useEffect(() => {
    if (debounceTimer) clearTimeout(debounceTimer);
    
    const timer = setTimeout(() => {
      dispatch(resetLaunches());
      dispatch(fetchLaunches({ page: 1, query: searchQuery }));
    }, 500);

    setDebounceTimer(timer);

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [searchQuery, dispatch]);

  useEffect(() => {
    if (!loadMoreRef.current || !hasMore || loading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          const nextPage = (launches?.length || 0) / 12 + 1;
          dispatch(fetchLaunches({ page: nextPage, query: searchQuery }));
        }
      },
      { threshold: 0.1, rootMargin: '100px' }
    );

    observer.observe(loadMoreRef.current);

    return () => observer.disconnect();
  }, [hasMore, loading, launches?.length, dispatch, searchQuery]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  const handleView = (launch) => {
    setSelectedLaunch(launch);
  };

  const handleCloseModal = () => {
    setSelectedLaunch(null);
  };

  if (initialLoad) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-red-600 text-lg mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">
          SpaceX Launches
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Explore the history of SpaceX missions
        </p>

        <div className="mb-8">
          <div className="relative max-w-md mx-auto">
            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
              <FaSearch />
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearch}
              placeholder="Search missions..."
              className="w-full pl-12 pr-10 py-3 border-2 border-gray-200 rounded-full focus:border-blue-500 focus:outline-none transition-colors"
            />
            {searchQuery && (
              <button
                onClick={handleClearSearch}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <FaTimes />
              </button>
            )}
          </div>
        </div>

        {launches.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No launches found</p>
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-4">
              {launches.map((launch, index) => (
                <LaunchCard 
                  key={`${launch.id}-${index}`} 
                  launch={launch} 
                  onView={handleView}
                />
              ))}
            </div>

            <div ref={loadMoreRef} className="py-8 flex justify-center">
              {loading && <Spinner size="medium" />}
              {!hasMore && launches.length > 0 && (
                <div className="flex items-center gap-2 text-gray-500">
                  <FaRocket />
                  <span>No more launches to show</span>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {selectedLaunch && (
        <LaunchModal launch={selectedLaunch} onClose={handleCloseModal} />
      )}
    </div>
  );
}

export default LaunchList;
