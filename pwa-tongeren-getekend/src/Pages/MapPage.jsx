import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  CircleMarker,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import markerIcon2x from "../assets/marker-icon-2x.svg";
import markerIcon from "../assets/marker-icon.svg";
import mylocation from "../assets/mylocation.svg";

// Fix default Leaflet marker icon
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  iconSize: [39, 39],
  iconAnchor: [19.5, 39],
});

const createNumberedMarkerIcon = (number) => {
  const svgString = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
      <path fill-rule="evenodd" d="m11.54 22.351.07.04.028.016a.76.76 0 0 0 .723 0l.028-.015.071-.041a16.975 16.975 0 0 0 1.144-.742 19.58 19.58 0 0 0 2.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 0 0-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 0 0 2.682 2.282 16.975 16.975 0 0 0 1.145.742Z" clip-rule="evenodd" />
      <text x="12" y="14" text-anchor="middle" fill="white" font-size="8" font-weight="bold" font-family="Raleway, Arial, Helvetica, sans-serif">${number}</text>
    </svg>
  `;
  
  const blob = new Blob([svgString], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(blob);
  
  return new L.Icon({
    iconUrl: url,
    iconRetinaUrl: url,
    iconSize: [39, 39],
    iconAnchor: [19.5, 39],
  });
};

const getBuildingIcon = (exists, number) => {
  if (exists === "found") {
    return new L.Icon({
      iconUrl: mylocation,
      iconRetinaUrl: mylocation,
      iconSize: [39, 39],
      iconAnchor: [19.5, 39],
    });
  }
  
  return createNumberedMarkerIcon(number);
};

const MapFocus = ({ coordinates, onZoomComplete, reset }) => {
  const map = useMap();

  useEffect(() => {
    if (reset) {
      map.setView([50.7833, 5.4703], 15);
      onZoomComplete(false);
    } else if (coordinates) {
      map.flyTo(coordinates, 15, { animate: true, duration: 1.5 });
      setTimeout(() => {
        onZoomComplete(true);
      }, 1500);
    }
  }, [coordinates, map, onZoomComplete, reset]);

  return null;
};

const PulsatingMarker = ({ coordinates, isZoomed }) => {
  const [radius, setRadius] = useState(10);

  useEffect(() => {
    if (!isZoomed) return;

    let growing = true;
    const interval = setInterval(() => {
      setRadius((prev) => {
        if (growing) {
          if (prev >= 20) growing = false;
          return prev + 0.5;
        } else {
          if (prev <= 10) growing = true;
          return prev - 0.5;
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
      weight={0.5}
      fillOpacity={0.5}
    />
  );
};

export default function MapPage() {
  const { url } = useParams();
  const [buildingData, setBuildingData] = useState([]);
  const [error, setError] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [focusCoordinates, setFocusCoordinates] = useState(null);
  const [isZoomed, setIsZoomed] = useState(false);
  const [resetMap, setResetMap] = useState(false);
  const mapRef = useRef(null);

  const fallbackCoordinates = [50.7833, 5.4703];

  useEffect(() => {
    fetch("https://grondslag.be/api/tongerengetekend-v2")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setBuildingData(data);

        if (url) {
          const selected = data.find((b) => b.url === url);
          if (
            selected &&
            typeof selected.lat === "number" &&
            typeof selected.long === "number"
          ) {
            setFocusCoordinates([selected.lat, selected.long]);
            setResetMap(false);
          } else {
            console.warn("Invalid building coords for:", url);
            setFocusCoordinates(null);
            setResetMap(true);
          }
        } else {
          setFocusCoordinates(null);
          setResetMap(true);

          // ✅ Fit map to all markers when no building is selected
          const validCoords = data
            .filter(
              (b) => typeof b.lat === "number" && typeof b.long === "number"
            )
            .map((b) => [b.lat, b.long]);

          if (validCoords.length > 0) {
            const bounds = L.latLngBounds(validCoords);
            setTimeout(() => {
              const map = mapRef.current;
              if (map && bounds.isValid()) {
                map.fitBounds(bounds, { padding: [50, 50] });
              }
            }, 500);
          }
        }
      })
      .catch((err) => {
        console.error("Failed to load buildings:", err);
        setError(err.message);
      });

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation([pos.coords.latitude, pos.coords.longitude]);
        },
        (err) => {
          console.error("Geolocation error:", err);
        }
      );
    }
  }, [url]);

  return (
    <div className="min-h-screen ">
      {error ? (
        <div className="text-red-500">Error: {error}</div>
      ) : (
        <div className="w-full max-w-3xl mx-auto h-[100vh] overflow-hidden z-0">
          <MapContainer
            center={
              Array.isArray(focusCoordinates) && focusCoordinates.length === 2
                ? focusCoordinates
                : userLocation || fallbackCoordinates
            }
            zoom={10}
            className="w-full h-full z-0"
            whenCreated={(mapInstance) => {
              mapRef.current = mapInstance;
            }}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />

            <MapFocus
              coordinates={focusCoordinates}
              onZoomComplete={setIsZoomed}
              reset={resetMap}
            />

            {focusCoordinates && (
              <PulsatingMarker
                coordinates={focusCoordinates}
                isZoomed={isZoomed}
              />
            )}

            {userLocation && (
              <Marker
                position={userLocation}
                icon={
                  new L.Icon({
                    iconUrl: mylocation,
                    iconRetinaUrl: mylocation,
                    iconSize: [39, 39],
                    iconAnchor: [19.5, 39],
                  })
                }
              >
                <Popup>Jij bent hier!</Popup>
              </Marker>
            )}

            {buildingData.map((building, index) => {
              if (
                typeof building.lat !== "number" ||
                typeof building.long !== "number"
              ) {
                return null;
              }

              return (
                <Marker
                  key={building.key}
                  position={{ lat: building.lat, lng: building.long }}
                  icon={getBuildingIcon(building.exists, index + 1)}
                >
                  <Popup>
                    <div
                      className="text-center cursor-pointer w-40"
                      onClick={() =>
                        (window.location.href = `/details/${building.url}`)
                      }
                    >
                      <img
                        src={building.image_front}
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
        </div>
      )}
    </div>
  );
}
