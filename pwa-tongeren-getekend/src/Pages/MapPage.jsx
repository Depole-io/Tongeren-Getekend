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
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import existingLocation from "leaflet/dist/images/existinglocation.svg";
import lostlocation from "leaflet/dist/images/lostlocation.svg";
import mylocation from "leaflet/dist/images/mylocation.svg";

// Fix default Leaflet marker icon
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [39, 39],
  iconAnchor: [19.5, 39],
});

const getBuildingIcon = (exists) => {
  let iconUrl;
  if (exists === true || exists === "true") {
    iconUrl = existingLocation;
  } else if (exists === false || exists === "false") {
    iconUrl = lostlocation;
  } else if (exists === "found") {
    iconUrl = mylocation;
  } else {
    iconUrl = markerIcon;
  }

  return new L.Icon({
    iconUrl,
    iconRetinaUrl: iconUrl,
    shadowUrl: markerShadow,
    iconSize: [39, 39],
    iconAnchor: [19.5, 39],
  });
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
      weight={2}
      opacity={0.8}
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
    fetch("https://grondslag.be/api/tongerengetekend")
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
            .filter((b) => typeof b.lat === "number" && typeof b.long === "number")
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
    <div className="min-h-screen flex items-center justify-center bg-black">
      {error ? (
        <div className="text-red-500">Error: {error}</div>
      ) : (
        <MapContainer
          center={
            Array.isArray(focusCoordinates) && focusCoordinates.length === 2
              ? focusCoordinates
              : userLocation || fallbackCoordinates
          }
          zoom={10}
          className="w-110 h-[800px] rounded-lg shadow-lg justify-center"
          whenCreated={(mapInstance) => {
            mapRef.current = mapInstance;
          }}
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
            <PulsatingMarker coordinates={focusCoordinates} isZoomed={isZoomed} />
          )}

          {userLocation && (
            <Marker
              position={userLocation}
              icon={
                new L.Icon({
                  iconUrl: mylocation,
                  iconRetinaUrl: mylocation,
                  shadowUrl: markerShadow,
                  iconSize: [39, 39],
                  iconAnchor: [19.5, 39],
                })
              }
            >
              <Popup>You are here!</Popup>
            </Marker>
          )}

          {buildingData.map((building) => {
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
                icon={getBuildingIcon(building.exists)}
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
      )}
    </div>
  );
}
