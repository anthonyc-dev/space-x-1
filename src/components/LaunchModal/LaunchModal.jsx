import React, { useEffect } from 'react';
import { FaRocket, FaCheck, FaTimesCircle, FaClock, FaCalendarAlt, FaNewspaper, FaExternalLinkAlt, FaWikipediaW, FaYoutube, FaFlickr, FaWindowClose } from 'react-icons/fa';

function LaunchModal({ launch, onClose }) {
  const { name, date_utc, success, rocket, links, details, upcoming } = launch;

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const formatDate = (date) => {
    if (!date) return 'Unknown';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const hasImage = links?.patch?.large || links?.flickr?.original?.length > 0;
  const imageUrl = links?.patch?.large || links?.flickr?.original?.[0];

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">{name}</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <FaWindowClose className="text-xl text-gray-500" />
          </button>
        </div>

        <div className="p-4">
          {hasImage ? (
            <div className="mb-4 flex justify-center">
              <img 
                src={imageUrl} 
                alt={name}
                className="max-h-64 object-contain"
              />
            </div>
          ) : (
            <div className="mb-4 h-48 bg-gray-100 rounded-lg flex items-center justify-center">
              <span className="text-gray-400 flex items-center gap-2">
                <FaRocket />
                No image available
              </span>
            </div>
          )}

          <div className="flex flex-wrap gap-3 mb-4">
            <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${
              success ? 'bg-green-100 text-green-700' : 
              success === false ? 'bg-red-100 text-red-700' : 
              'bg-gray-100 text-gray-700'
            }`}>
              {success ? <FaCheck /> : success === false ? <FaTimesCircle /> : <FaClock />}
              {upcoming ? 'Upcoming' : success === true ? 'Success' : success === false ? 'Failed' : 'Unknown'}
            </span>

            <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-medium flex items-center gap-1">
              <FaCalendarAlt />
              {formatDate(date_utc)}
            </span>
          </div>

          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-gray-700 flex items-center gap-2 mb-2">
              <FaRocket />
              Rocket
            </h3>
            <p className="text-gray-600">{rocket?.name || 'Unknown'}</p>
            {rocket?.type && <p className="text-sm text-gray-500">{rocket.type}</p>}
          </div>

          <div className="mb-4">
            <h3 className="font-medium text-gray-700 mb-2">Description</h3>
            <p className="text-gray-600">
              {details || 'No description available for this mission.'}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            {links?.article && (
              <a 
                href={links.article}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-blue-700 transition-colors"
              >
                <FaNewspaper />
                Article
                <FaExternalLinkAlt />
              </a>
            )}
            {links?.wikipedia && (
              <a 
                href={links.wikipedia}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-2 bg-gray-800 text-white rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-gray-900 transition-colors"
              >
                <FaWikipediaW />
                Wikipedia
              </a>
            )}
            {links?.webcast && (
              <a 
                href={links.webcast}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-2 bg-red-600 text-white rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-red-700 transition-colors"
              >
                <FaYoutube />
                Webcast
              </a>
            )}
            {links?.flickr?.original?.length > 0 && (
              <a 
                href={links.flickr.original[0]}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-2 bg-pink-600 text-white rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-pink-700 transition-colors"
              >
                <FaFlickr />
                Flickr
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default LaunchModal;