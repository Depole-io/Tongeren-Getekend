import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import HomePage from "./Pages/HomePage";
import GalleryPage from "./Pages/GalleryPage";
import DetailsPage from "./Pages/DetailPage";
import MapPage from "./Pages/MapPage";
import AboutUsPage from "./Pages/AboutUsPage";
import "./index.css";
import background from "./assets/background.jsx";

function App() {
  useEffect(() => {
    const preloadData = async () => {
      const cacheName = "datatongerengetekend";
      const apiUrl = "https://grondslag.be/api/tongerengetekend";

      try {
        // Open the cache
        const cache = await caches.open(cacheName);

        // Check if the data is already cached
        const cachedResponse = await cache.match(apiUrl);
        if (cachedResponse) {
          console.log("Data already exists in the cache. No need to fetch.");
          return; // Exit the function if data is already cached
        }

        // Fetch the data from the network
        const response = await fetch(apiUrl);
        if (response.ok) {
          // Cache the data
          await cache.put(apiUrl, response.clone());
          console.log("Preloaded JSON file into cache.");
        }
      } catch (error) {
        console.error("Failed to preload JSON file:", error);
      }
    };
    preloadData();
  }, []);

  useEffect(() => {
    console.log('Background SVG:', background); // Debug log
    
    // Create a style element
    const style = document.createElement('style');
    style.textContent = `
      body {
        background-image: url("${background}");
        background-repeat: repeat;
        background-position: center;
        background-size: contain;
        background-blend-mode: overlay;
      }
    `;
    document.head.appendChild(style);

    // Cleanup
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/details/:url" element={<DetailsPage />} />
            <Route path="/map/:url?" element={<MapPage />} />{" "}
            {/* ✅ Optional param */}
            <Route path="/about" element={<AboutUsPage />} />
            {/* Add other routes here */}
          </Routes>
        </div>
        <nav className="p-4  fixed bottom-4 w-full z-100">
          <ul className="flex justify-center space-x-6">
            <li>
              <Link
                to="/"
                className="text-white hover:text-gray-300 transition duration-300"
              >


            <div className="nav-bg rounded-full p-3 border-2 border-white">

            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-8">
              <path d="M11.47 3.841a.75.75 0 0 1 1.06 0l8.69 8.69a.75.75 0 1 0 1.06-1.061l-8.689-8.69a2.25 2.25 0 0 0-3.182 0l-8.69 8.69a.75.75 0 1 0 1.061 1.06l8.69-8.689Z" />
              <path d="m12 5.432 8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 0 1-.75-.75v-4.5a.75.75 0 0 0-.75-.75h-3a.75.75 0 0 0-.75.75V21a.75.75 0 0 1-.75.75H5.625a1.875 1.875 0 0 1-1.875-1.875v-6.198a2.29 2.29 0 0 0 .091-.086L12 5.432Z" />
          </svg>

          </div>
              </Link>
            </li>
            <li>
              <Link
                to="/gallery"
                className="text-white hover:text-gray-300 transition duration-300"
              >

        <div className="nav-bg rounded-full p-3 border-2 border-white">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-8">
        <path fillRule="evenodd" d="M1.5 6a2.25 2.25 0 0 1 2.25-2.25h16.5A2.25 2.25 0 0 1 22.5 6v12a2.25 2.25 0 0 1-2.25 2.25H3.75A2.25 2.25 0 0 1 1.5 18V6ZM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0 0 21 18v-1.94l-2.69-2.689a1.5 1.5 0 0 0-2.12 0l-.88.879.97.97a.75.75 0 1 1-1.06 1.06l-5.16-5.159a1.5 1.5 0 0 0-2.12 0L3 16.061Zm10.125-7.81a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Z" clipRule="evenodd" />
        </svg>

                </div>
              </Link>
            </li>
            <li>
              <Link
                to="/map"
                className="text-white hover:text-gray-300 transition duration-300"
              >
                <div className="nav-bg rounded-full p-3 border-2 border-white">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-8">
                  <path fillRule="evenodd" d="m11.54 22.351.07.04.028.016a.76.76 0 0 0 .723 0l.028-.015.071-.041a16.975 16.975 0 0 0 1.144-.742 19.58 19.58 0 0 0 2.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 0 0-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 0 0 2.682 2.282 16.975 16.975 0 0 0 1.145.742ZM12 13.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" clipRule="evenodd" />
                </svg>

                </div>
              </Link>
            </li>
            <li>
              <Link
                to="/about"
                className="text-white hover:text-gray-300 transition duration-300"
              >
                <div className="nav-bg rounded-full p-3 border-2 border-white">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-8">
                 <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 0 1 .67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 1 1-.671-1.34l.041-.022ZM12 9a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" clipRule="evenodd" />
                </svg>

                </div>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </Router>
  );
}

export default App;
