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
    <div className="min-h-screen flex flex-col items-center justify-center  py-4 px-4 pb-28">
      {/* Responsive Vertical Layout */}
      <div className="flex flex-col gap-4 w-full max-w-2xl sm:max-w-xs md:max-w-sm lg:max-w-md xl:max-w-lg">
        {buildingData.map((building) => (
          <div
            key={building.url}
            url={building.url}
            className="bg-nav overflow-hidden w-full sm:w-[375px] lg:w-[400px] xl:w-[450px] mx-auto cursor-pointer"
            onClick={() => {
              window.location.href = `/details/${building.url}`;
            }}
          >
            <div className="w-full flex items-center justify-center overflow-hidden">
              <img
                src={building.image_front}
                alt={building.name}
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default GalleryPage;
