import React, { useEffect, useState } from "react";

import EamesBird from "../assets/EamesBird.svg";
import Roofvogel from "../assets/roofvogel.svg";
import background from "../assets/background.jsx";


function HomePage() {
  const [buildingData, setBuildingData] = useState([]);

  const duration = 1700; 
  const delay = 300; 
  const animStr = (i) => `fadeIn ${duration}ms ease-out ${delay * i}ms forwards`;


  useEffect(() => {
    fetch("https://grondslag.be/api/tongerengetekend")
      .then((response) => response.json())
      .then((data) => {
        // Shuffle the array and select only 5 random buildings
        const shuffledData = [...data];
        setBuildingData(shuffledData.slice(0, 20));
      });
  }, []);

  // Function to truncate description to first 2 sentences
  //const truncateDescription = (text, maxLength = 125) => {
  //  if (!text) return "";
  //  return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  //};

  return (
    <div className="min-h-screen flex flex-col items-center justify-center  py-6 px-0 pb-[54px]">
    <div className="flex flex-row gap-6 w-full max-w-2xl sm:max-w-xs md:max-w-sm lg:max-w-md xl:max-w-lg">
      <div className="flex flex-col pl-4">
      <div className="text-white text-6xl font-bold [writing-mode:vertical-lr] flex flex-col">
       Tongeren
       </div>
       <img src={EamesBird} alt="Eames Bird" className="my-3 w-10 h-10  border-white" style={{ filter: "invert(1)" }}  />
       <div className="text-white text-6xl font-bold [writing-mode:vertical-lr] flex flex-col">
        Getekend
       </div>
      </div>

      <div id="buildings" className="flex flex-col gap-4 w-full max-w-2xl sm:max-w-xs md:max-w-sm lg:max-w-md xl:max-w-lg overflow-y-auto max-h-[80vh] pb-10">
        {buildingData.map((building, i)  => (
          <div
            key={i}
            className=" w-full sm:w-[375px] lg:w-[400px] xl:w-[450px] mx-auto cursor-pointer text-transparent"
            style={{ animation: animStr(i) }}
            onClick={() => {
              window.location.href = `/details/${building.url}`;
            }}
          >
            <div className="flex flex-col text-left text-2xl font-semibold text-white">
              {building.name}
            </div>
          </div>
        ))}
      </div>

     





    </div>



    </div>
  );
}

export default HomePage;
