import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";

import {
  AnchorContext,
  AnchorLink,
  AnchorProvider,
  AnchorSection,
} from "react-anchor-navigation";

import markerIcon from "../assets/marker-icon.svg";
import EamesBird from "../assets/EamesBird.svg";
import Roofvogel from "../assets/roofvogel.svg";


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
    <AnchorProvider>
      <div className="min-h-screen flex items-center justify-center pb-[90px] mb-[54px] sm:p-8  text-white">
        <div className="w-full max-w-lg h-full flex flex-col text-left shadow-lg sm:rounded-xl overflow-hidden  text-white">
          <div className="w-full flex-grow min-h-0 flex items-center justify-center border-b border-gray-700">
            <img
              src={buildingData.image_front}
              alt={buildingData.name}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex flex-col items-center space-y-4 w-full">
              <div className="flex items-center justify-between space-x-4 border-b border-white w-full">
                <button
                  onClick={() => navigate(`/map/${buildingData.url}`)}
                  className="px-2 py-2 flex flex-row  text-white font-semibold border-r border-white  text-sm cursor-pointer w-full"
                >
                  <img src={markerIcon} alt="Marker" className="size-8 invert" />
                  <div className="ml-2 flex flex-col">
                  <div className="text-xs text-left">{buildingData.lat} </div>
                  <div className="text-xs text-left">{buildingData.long}</div>
                  </div>
                </button>



                <AnchorLink className="flex flex-row justify-start  text-white font-semibold border-r border-white  text-sm cursor-pointer w-full h-full items-center" href="#id-kit" activeClassName="blue">

                  {getStatusIcon(buildingData.exists)}
                  <div className="">                  {String(buildingData.exists).toLowerCase() === "true"
                    ? "Bewaard"
                    : "Verdwenen"}</div>
                  
                </AnchorLink>




                <button
                  onClick={openModal}
                  className="p-2 flex items-center justify-center text-white cursor-pointer text-sm w-full"
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

                  Inzoemen
                </button>
              </div>


            </div>


          <div className="flex flex-col w-full space-y-4 p-6 sm:p-8 flex-none min-h-[40%] max-h-[50%] bg-opacity-80 rounded-b-xl">



            <div className="text-3xl font-raleway font-bold text-white leading-relaxed text-left">
                {buildingData.name} 
              </div>            
              <div className="text-lg font-raleway font-bold text-white  text-left">
                {buildingData.title} 
              </div>     

            <div className="text-lg text-white font-raleway leading-relaxed whitespace-pre-line">
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
                      <h3 className="mb-2 text-3xl">{buildingData.architect}</h3>
                      {buildingData.architect_description}
                    </div>
                  );
              }
            })()}

<AnchorSection  id="id-kit" />

            <div  className="bg-gray-700 rounded-lg p-4 mt-4">
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
                  <span className="font-semibold">Status:</span>{" "}
                  {String(buildingData.exists).toLowerCase() === "true"
                    ? "Bewaard"
                    : "Verdwenen"}
                </div>
                <div>
                  <span className="font-semibold">Adres:</span>{" "}
                  {buildingData.address || "Onbekend"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      </AnchorProvider>

      {buildingData.soundfile && buildingData.soundfile.trim() !== "" && (
        <div id="sound-bar" className="fixed bottom-0 left-1/2 -translate-x-1/2 w-92 px-4 mb-26 bg-black flex justify-center">
          <audio controls className="w-full shadow-md bg-gray-900 text-white">
            <source src={buildingData.soundfile} type="audio/mp3" />
            Your browser does not support the audio element.
          </audio>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-150">
          <div
            ref={containerRef}
            className="relative w-full h-full flex items-center justify-center overflow-hidden"
          >
            <div
              ref={imageRef}
              className="cursor-grab touch-none"
              style={{
                transform: `scale(${zoom}) translate(${position.x}px, ${position.y}px)`,
                transition: "transform 0.2s ease",
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
                className="nav-bg rounded-full p-3 border-2 border-white rounded-full text-white text-4xl p-3 border-2 border-white disabled:opacity-50"
                disabled={zoom <= 1}

              >
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-8">
              <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607ZM13.5 10.5h-6" />
            </svg>

              </button>
              <button
                onClick={() => handleZoom("in")}
                className="nav-bg rounded-full p-3 border-2 text-white text-4xl border-white"
              >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-8">
              <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607ZM10.5 7.5v6m3-3h-6" />
              </svg>

              </button>
              <button
                onClick={closeModal}
                className="py-2 bg-red-600 text-white text-4xl rounded-full p-3 border-2 border-white"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-8">
                <path fill-rule="evenodd" d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd" />
        </svg>

              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default DetailsPage;
