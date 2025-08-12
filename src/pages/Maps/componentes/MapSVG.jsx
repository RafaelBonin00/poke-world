import React from 'react';

function MapSVG({
  locations,
  selectedLocation,
  hoveredLocation,
  setHoveredLocation,
  fetchPokemonsByLocation,
}) {
  const getColor = (locationName, isHover) => {
    if (selectedLocation === locationName) {
      return 'rgba(255, 255, 255, 0.3)';
    } else if (isHover) {
      return 'rgba(255, 255, 255, 0.6)';
    } else {
      return 'transparent';
    }
  };

  const handleKeyPress = (event, locationName) => {
    if (event.key === 'Enter' || event.key === ' ') {
      fetchPokemonsByLocation(locationName);
    }
  };

  return (
    <svg
      className="maps-svg"
      viewBox="0 0 1000 500"
      preserveAspectRatio="xMidYMid meet"
    >
      {locations.map(({ id, label, points, textPos }) => (
        <React.Fragment key={id}>
          <polygon
            points={points}
            fill={getColor(id, hoveredLocation === id)}
            strokeWidth="3"
            onClick={() => fetchPokemonsByLocation(id)}
            onMouseEnter={() => setHoveredLocation(id)}
            onMouseLeave={() => setHoveredLocation(null)}
            tabIndex={0}
            onKeyDown={(e) => handleKeyPress(e, id)}
            role="button"
            aria-label={id}
          />
          <text x={textPos.x} y={textPos.y} fill="white" fontSize="12">
            {label}
          </text>
        </React.Fragment>
      ))}
    </svg>
  );
}

export default MapSVG;
