import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import EamesBird from "/assets/EamesBird.svg";
import Roofvogel from "/assets/roofvogel.svg";

function DetailsPage() {
  const { url } = useParams();
  const navigate = useNavigate();
  const [buildingData, setBuildingData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const imageRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      const cacheName = "datatongerengetekend";
      const apiUrl = "https://grondslag.be/api/tongerengetekend";

      try {
        const cache = await caches.open(cacheName);
        const cachedResponse = await cache.match(apiUrl);
        if (cachedResponse) {
          const cachedData = await cachedResponse.json();
          const foundBuilding = cachedData.find(
            (building) => building.url === url
          );
          if (foundBuilding) {
            setBuildingData(foundBuilding);
            return;
          } else {
            console.error("Building not found in cached data.");
          }
        }
        const networkResponse = await fetch(apiUrl);
        if (networkResponse.ok) {
          const networkData = await networkResponse.json();
          const foundBuilding = networkData.find(
            (building) => building.url === url
          );
          setBuildingData(foundBuilding);
        }
      } catch (error) {
        console.error("Error fetching building data:", error);
      }
    };

    fetchData();
  }, [url]);

  function getStatusIcon(exists) {
    switch (String(exists).toLowerCase()) {
      case "true":
        return (
          <img
            src={EamesBird}
            alt="Bestaat nog"
            className="h-8 w-8"
            style={{ filter: "invert(1)" }}
          />
        );
      case "false":
        return (
          <img
            src={Roofvogel}
            alt="Bestaat niet meer"
            className="h-8 w-8"
            style={{ filter: "invert(1)" }}
          />
        );
      default:
        return null;
    }
  }

  if (!buildingData) return <div className="text-white">Loading...</div>;

  const openModal = () => {
    const img = imageRef.current;
    const container = containerRef.current;

    if (img && container) {
      const imgBounds = img.getBoundingClientRect();
      const containerBounds = container.getBoundingClientRect();
      const zoomX = containerBounds.width / imgBounds.width;
      const zoomY = containerBounds.height / imgBounds.height;
      const initialZoom = Math.min(zoomX, zoomY);

      setZoom(initialZoom);
      setPosition({ x: 0, y: 0 });
    }

    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleZoom = (direction) => {
    setZoom((prevZoom) => {
      let newZoom = direction === "in" ? prevZoom * 1.2 : prevZoom / 1.2;
      newZoom = Math.max(1, Math.min(newZoom, 5));
      return newZoom;
    });
  };

  const handleMouseDown = (e) => {
    e.preventDefault();
    const startX = e.clientX || e.touches?.[0]?.clientX;
    const startY = e.clientY || e.touches?.[0]?.clientY;
    const startPos = { ...position };

    const handleMove = (moveEvent) => {
      const moveX = moveEvent.clientX || moveEvent.touches?.[0]?.clientX;
      const moveY = moveEvent.clientY || moveEvent.touches?.[0]?.clientY;

      const img = imageRef.current;
      if (!img) return;

      const bounds = img.getBoundingClientRect();
      const containerBounds = containerRef.current.getBoundingClientRect();

      const maxX = (bounds.width - containerBounds.width) / (2 * zoom);
      const maxY = (bounds.height - containerBounds.height) / (2 * zoom);

      setPosition({
        x: Math.max(
          -maxX,
          Math.min(maxX, startPos.x + (moveX - startX) / zoom)
        ),
        y: Math.max(
          -maxY,
          Math.min(maxY, startPos.y + (moveY - startY) / zoom)
        ),
      });
    };

    const stopMove = () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", stopMove);
      window.removeEventListener("touchmove", handleMove);
      window.removeEventListener("touchend", stopMove);
    };

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", stopMove);
    window.addEventListener("touchmove", handleMove);
    window.addEventListener("touchend", stopMove);
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center pb-[90px] mb-[54px] sm:p-8 bg-black text-white">
        <div className="w-full max-w-lg h-full flex flex-col text-left shadow-lg sm:rounded-xl overflow-hidden bg-gray-900 text-white">
          <div className="w-full flex-grow min-h-0 flex items-center justify-center border-b border-gray-700">
            <img
              src={buildingData.image_front}
              alt={buildingData.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col w-full space-y-4 p-6 sm:p-8 flex-none min-h-[40%] max-h-[50%] bg-opacity-80 rounded-b-xl">
            <div className="flex flex-col items-center space-y-4 w-full">
              <div className="flex items-center justify-end space-x-4 w-full">
                <button
                  onClick={() => navigate(`/map/${buildingData.url}`)}
                  className="px-2 py-2 bg-black text-white font-semibold rounded-md text-sm shadow-md cursor-pointer"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="size-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 6.75V15m6-6v8.25m.503 3.498 4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 0 0-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0Z"
                    />
                  </svg>
                </button>

                <div className="p-2 bg-black rounded-md flex items-center justify-center text-white">
                  {getStatusIcon(buildingData.exists)}
                </div>

                <button
                  onClick={openModal}
                  className="p-2 bg-black rounded-md flex items-center justify-center text-white cursor-pointer"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="size-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                    />
                  </svg>
                </button>
              </div>

              <h1 className="text-3xl font-bold text-white text-center">
                {buildingData.name}
              </h1>
            </div>

            <div className="text-lg text-white leading-relaxed whitespace-pre-line">
              {buildingData.description}
            </div>

            {/* Architect block only shown if architect is not "onbekend" */}
            {(() => {
              switch (String(buildingData.architect).toLowerCase()) {
                case "onbekend":
                case "":
                case "null":
                case "undefined":
                  return null;
                default:
                  return (
                    <div className="text-lg text-white leading-relaxed whitespace-pre-line pt-10 pb-7">
                      <h3>{buildingData.architect}</h3>
                      {buildingData.architect_description}
                    </div>
                  );
              }
            })()}

            <div className="bg-gray-700 rounded-lg p-4 mt-4">
              <div className="text-lg text-white">
                <div>
                  <span className="font-semibold">Bouwjaar:</span>{" "}
                  {buildingData.year_of_construction || "Onbekend"}
                </div>
                <div>
                  <span className="font-semibold">Architect:</span>{" "}
                  {buildingData.architect || "Onbekend"}
                </div>
                <div>
                  <span className="font-semibold">Bestaat nog:</span>{" "}
                  {String(buildingData.exists).toLowerCase() === "true"
                    ? "Ja"
                    : "Nee"}
                </div>
                <div>
                  <span className="font-semibold">adress:</span>{" "}
                  {buildingData.address || "Onbekend"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-[545px] px-4 pb-[54px] bg-black flex justify-center">
        <audio controls className="w-full shadow-md bg-gray-900 text-white">
          <source src={buildingData.soundfile} type="audio/mp3" />
          Your browser does not support the audio element.
        </audio>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
          <div
            ref={containerRef}
            className="relative w-full h-full flex items-center justify-center overflow-hidden"
          >
            <div
              ref={imageRef}
              className="cursor-grab touch-none"
              style={{
                transform: `scale(${zoom}) translate(${position.x}px, ${position.y}px)`,
                transition: "transform 0.1s ease",
              }}
              onMouseDown={handleMouseDown}
              onTouchStart={handleMouseDown}
            >
              <img
                src={buildingData.image_large}
                alt="Zoomed View"
                className="max-w-none"
              />
            </div>
            {/* Button group absolutely positioned and with high z-index */}
            <div
              className="absolute left-1/2 -translate-x-1/2 z-50 flex space-x-4"
              style={{ bottom: "56px" }}
            >
              <button
                onClick={() => handleZoom("out")}
                className="px-4 py-2 bg-gray-800 text-white rounded-md disabled:opacity-50"
                disabled={zoom <= 1}
              >
                -
              </button>
              <button
                onClick={() => handleZoom("in")}
                className="px-4 py-2 bg-gray-800 text-white rounded-md"
              >
                +
              </button>
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-red-600 text-white rounded-md"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default DetailsPage;
