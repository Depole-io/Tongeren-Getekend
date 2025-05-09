import React,{useEffect} from "react";
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import HomePage from './Pages/HomePage';
import GalleryPage from './Pages/GalleryPage';
import DetailsPage from './Pages/DetailPage';
import MapPage from './Pages/MapPage';
import AboutUsPage from './Pages/AboutUsPage';
import './index.css';



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

  return (

    <Router>
      <div className="min-h-screen flex flex-col">
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/details/:url" element={<DetailsPage />} />
            <Route path="/map/:url?" element={<MapPage/>} /> {/* ✅ Optional param */}
            <Route path="/about" element={<AboutUsPage />} />

            {/* Add other routes here */}
          </Routes>
        </div>
        <nav className="bg-black p-4 shadow-md fixed bottom-0 w-full">
          <ul className="flex justify-center space-x-20">
            <li>
              <Link to="/" className="text-white hover:text-gray-300 transition duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
              </svg>
              </Link>
            </li>
            <li>
              <Link to="/gallery" className="text-white hover:text-gray-300 transition duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
              </svg>
              </Link>
            </li>
            <li>
              <Link to="/map" className="text-white hover:text-gray-300 transition duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498 4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 0 0-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0Z" />
              </svg>
              </Link>
            </li>
            <li>
              <Link to="/about" className="text-white hover:text-gray-300 transition duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
              </svg>
              </Link>
            </li>
            
          </ul>
        </nav>
      </div>
    </Router>
  );
}

export default App