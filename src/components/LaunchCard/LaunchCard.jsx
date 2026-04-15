import React from "react";
import {
  FaRocket,
  FaCheck,
  FaTimesCircle,
  FaClock,
  FaCalendarAlt,
} from "react-icons/fa";

function LaunchCard({ launch, onView }) {
  const { name, date_utc, success, rocket, links } = launch;

  const formatDate = (date) => {
    if (!date) return "Unknown";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="relative bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-row">
      <div className="w-32 h-32 sm:w-40 sm:h-40 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center flex-shrink-0">
        {links?.patch?.small ? (
          <img
            src={links.patch.small}
            alt={name}
            className="w-full h-full object-contain p-4"
          />
        ) : (
          <FaRocket className="text-4xl text-gray-400" />
        )}
      </div>

      <div className="p-4 flex flex-col justify-center flex-grow">
        <h3 className="text-lg font-semibold text-gray-800 mb-2 truncate">
          {name || "Unknown Mission"}
        </h3>

        <div className="flex items-center gap-4 mb-2">
          <span className="text-sm text-gray-500 flex items-center gap-1">
            <FaCalendarAlt />
            {formatDate(date_utc)}
          </span>

          <span
            className={`text-xs px-2 py-1 rounded-full font-medium flex items-center gap-1 ${
              success
                ? "bg-green-100 text-green-700"
                : success === false
                  ? "bg-red-100 text-red-700"
                  : "bg-gray-100 text-gray-700"
            }`}
          >
            {success === true ? (
              <FaCheck />
            ) : success === false ? (
              <FaTimesCircle />
            ) : (
              <FaClock />
            )}
            {success === true
              ? "Success"
              : success === false
                ? "Failed"
                : "Upcoming"}
          </span>
        </div>

        <p className="text-sm text-gray-600 mb-2 flex items-center gap-2">
          <FaRocket />
          {rocket?.name || "Unknown Rocket"}
        </p>
      </div>

      {/* ✅ Move button to top-right */}
      <button
        onClick={() => onView(launch)}
        className="absolute top-3 right-3 px-3 py-1 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700 transition-colors"
      >
        View
      </button>
    </div>
  );
}

export default LaunchCard;
