import { MapContainer, TileLayer, Marker, Popup, useMap, CircleMarker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import existingLocation from "leaflet/dist/images/existinglocation.svg";
import lostlocation from "leaflet/dist/images/lostlocation.svg";
import mylocation from "leaflet/dist/images/mylocation.svg";

// Default Leaflet marker fix
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [39, 39],
  iconAnchor: [19.5, 39], // Center the marker properly
});

// Function to get the correct Pokémon status icon
const getBuildingIcon = (status) => {
  let iconUrl;
  switch (status) {
    case "Existing":
      iconUrl = existingLocation;
      break;
    case "Destroyed":
      iconUrl = lostlocation;
      break;
    case "found":
      iconUrl = mylocation;
      break;
    default:
      iconUrl = markerIcon;
  }

  return new L.Icon({
    iconUrl: iconUrl,
    iconRetinaUrl: iconUrl,
    shadowUrl: markerShadow,
    iconSize: [39, 39],
    iconAnchor: [19.5, 39],
  });
};

// Component to move map focus when Pokémon is selected
const MapFocus = ({ coordinates, onZoomComplete, reset }) => {
  const map = useMap();

  useEffect(() => {
    if (reset) {
      // Reset map to default when no key is provided
      map.setView([50.7833, 5.4703], 15);
      onZoomComplete(false);
    } else if (coordinates) {
      map.flyTo(coordinates, 15, { animate: true, duration: 1.5 });

      // Wait for animation to complete before triggering the pulse effect
      setTimeout(() => {
        onZoomComplete(true);
      }, 1500);
    }
  }, [coordinates, map, onZoomComplete, reset]);

  return null;
};

// Pulsating animation, starts only after zoom is complete
const PulsatingMarker = ({ coordinates, isZoomed }) => {
  const [radius, setRadius] = useState(10);

  useEffect(() => {
    if (!isZoomed) return;

    let growing = true;
    const interval = setInterval(() => {
      setRadius((prevRadius) => {
        if (growing) {
          if (prevRadius >= 20) growing = false;
          return prevRadius + 0.5;
        } else {
          if (prevRadius <= 10) growing = true;
          return prevRadius - 0.5;
        }
      });
    }, 50);

    return () => clearInterval(interval);
  }, [isZoomed]);

  if (!coordinates || !isZoomed) return null;

  return (
    <CircleMarker
      center={coordinates}
      radius={radius}
      fillColor="red"
      color="white"
      weight={2}
      opacity={0.8}
      fillOpacity={0.5}
    />
  );
};

export default function MapPage() {
  const { key } = useParams();
  const [buildingData, setPokemonData] = useState([]);
  const [error, setError] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [focusCoordinates, setFocusCoordinates] = useState(null);
  const [isZoomed, setIsZoomed] = useState(false);
  const [resetMap, setResetMap] = useState(false);

  useEffect(() => {
    fetch("/Buildings.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setPokemonData(data);

        if (key) {
          const selectedBuilding = data.find((building) => building.key === key);
          if (selectedBuilding && selectedBuilding.coordinates) {
            setFocusCoordinates(selectedBuilding.coordinates);
            setResetMap(false); // Don't reset if a building is selected
          } else {
            console.warn(`No valid coordinates found for building key: ${key}`);
            setFocusCoordinates(null);
            setResetMap(true); // Reset map if coordinates are invalid
          }
        } else {
          setFocusCoordinates(null);
          setResetMap(true); // Reset map when no building key is provided
        }
      })
      .catch((error) => {
        console.error("Failed to load Building data:", error);
        setError(error.message);
      });

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude]);
        },
        (error) => {
          console.error("Error getting user location:", error);
        }
      );
    }
  }, [key]);

  // Fallback location for when coordinates are not available
  const fallbackCoordinates = [50.7833, 5.4703];

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      {error ? (
        <div className="text-red-500">Error: {error}</div>
      ) : (
        <MapContainer
          center={focusCoordinates || userLocation || fallbackCoordinates}
          zoom={10}
          className="w-110 h-[600px] rounded-lg shadow-lg"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />

          {/* Reset map when key is missing, otherwise focus on building */}
          <MapFocus
            coordinates={focusCoordinates}
            onZoomComplete={setIsZoomed}
            reset={resetMap}
          />

          {focusCoordinates && <PulsatingMarker coordinates={focusCoordinates} isZoomed={isZoomed} />}

          {userLocation && (
            <Marker
              position={userLocation}
              icon={new L.Icon({
                iconUrl: mylocation,
                iconRetinaUrl: mylocation,
                shadowUrl: markerShadow,
                iconSize: [39, 39],
                iconAnchor: [19.5, 39],
              })}
            >
              <Popup>You are here!</Popup>
            </Marker>
          )}

          {buildingData.map((building) => {
            if (!building.coordinates) {
              return null; // Skip buildings with invalid coordinates
            }

            return (
              <Marker
                key={building.key}
                position={building.coordinates}
                icon={getBuildingIcon(building.status)}
              >
                <Popup>
                  <div
                    className="text-center cursor-pointer w-40"
                    onClick={() => {
                      window.location.href = `/details/${building.key}`;
                    }}
                  >
                    <img
                      src={building.images}
                      alt={building.name}
                      className="w-80 h-40 mx-auto mb-2"
                    />
                    <h3 className="font-bold text-lg">{building.name}</h3>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      )}
    </div>
  );
}
