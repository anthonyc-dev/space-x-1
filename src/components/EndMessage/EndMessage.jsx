import React from 'react';
import Spinner from '../Spinner';

function EndMessage({ hasMore, loading, message = 'No more data to load' }) {
  if (loading) {
    return (
      <div className="p-6 flex justify-center">
        <Spinner />
      </div>
    );
  }

  if (!hasMore) {
    return (
      <div className="p-6 flex flex-col items-center gap-2">
        <span className="text-3xl">🎉</span>
        <p className="text-base text-gray-600 m-0">{message}</p>
      </div>
    );
  }

  return null;
}

export default EndMessage;