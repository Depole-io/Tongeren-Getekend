import React, { useEffect, useState } from "react";

function GalleryPage() {
  const [buildingData, setBuildingData] = useState([]);

  useEffect(() => {
    fetch("https://grondslag.be/api/tongerengetekend")
      .then((response) => response.json())
      .then((data) => setBuildingData(data));
  }, []);

  // Function to truncate description
  //const truncateDescription = (text, maxLength = 125) => {
  //  if (!text) return "";
  //  return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  //};

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black py-8 px-4 pb-24">
      {/* Responsive Vertical Layout */}
      <div className="flex flex-col gap-6 w-full max-w-2xl sm:max-w-xs md:max-w-sm lg:max-w-md xl:max-w-lg">
        {buildingData.map((building) => (
          <div
            url={building.url}
            className="bg-white rounded-xl shadow-lg overflow-hidden w-full sm:w-[375px] lg:w-[400px] xl:w-[450px] mx-auto cursor-pointer"
            onClick={() => {
              window.location.href = `/details/${building.url}`;
            }}
          >
            <div className="w-full bg-white flex items-center justify-center overflow-hidden">
              <img
                src={building.image_front}
                alt={building.name}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="p-4 flex flex-col text-center">
              <h2 className="text-2xl font-bold text-black">{building.name}</h2>
              <p className="text-gray-700 mt-2 text-lg">{building.title}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default GalleryPage;
