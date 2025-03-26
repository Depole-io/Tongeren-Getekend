import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function DetailsPage() {
  const { key } = useParams();
  const navigate = useNavigate();
  const [buildingData, setBuildingData] = useState(null);

  useEffect(() => {
    fetch("/Buildings.json")
      .then((response) => response.json())
      .then((data) => {
        const foundBuilding = data.find((building) => building.key === key);
        setBuildingData(foundBuilding);
      })
      .catch((error) => console.error("Error fetching building data:", error));
  }, [key]);

  if (!buildingData) return <div className="text-white">Loading...</div>;

  return (
    <div className="min-h-screen flex items-center justify-center p-0 sm:p-4 pb-[56px]">
      <div className={`backdrop-blur-md ${buildingData.gradient} w-full max-w-lg flex flex-col items-center text-center shadow-lg sm:rounded-xl overflow-hidden flex-grow`}>
        
        {/* IMAGE (NO PADDING) */}
        <img
          src={buildingData.images}
          alt={buildingData.name}
          className="w-full h-auto object-contain"
        />

        {/* INFO CONTAINER */}
        <div className="flex flex-col items-center w-full space-y-4 p-4 sm:p-6">
          {/* TITLE */}
          <h1 className="text-3xl font-bold text-white">{buildingData.name}</h1>

          {/* STATUS & MAP BUTTON */}
          <div className="flex flex-col sm:flex-row items-center w-full space-y-2 sm:space-y-0 sm:space-x-4">
            {/* Status Box */}
            <div className={`px-4 py-2 w-full sm:w-auto rounded-md text-white text-sm font-semibold text-center ${
              buildingData.status === "Existing" ? "bg-green-600" : "bg-red-600"
            }`}>
              {buildingData.status}
            </div>

            {/* Map Button */}
            <button
              onClick={() => navigate(`/map/${buildingData.key}`)}
              className="px-4 py-2 w-full sm:w-auto bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-md text-sm shadow-md"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498 4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 0 0-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0Z" />
              </svg>

            </button>
          </div>

          {/* DESCRIPTION */}
          <p className="text-md text-white leading-relaxed">{buildingData.description}</p>
        </div>
      </div>
    </div>
  );
}

export default DetailsPage;
