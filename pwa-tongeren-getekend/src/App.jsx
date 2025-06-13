import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import HomePage from "./Pages/HomePage";
import GalleryPage from "./Pages/GalleryPage";
import DetailsPage from "./Pages/DetailPage";
import MapPage from "./Pages/MapPage";
import AboutUsPage from "./Pages/AboutUsPage";
import "./index.css";
import background from "./assets/background.jsx";

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const preloadData = async () => {
      const cacheName = "datatongerengetekend";
      const apiUrl = "https://grondslag.be/api/tongerengetekend";

      try {
        const cache = await caches.open(cacheName);
        const cachedResponse = await cache.match(apiUrl);
        if (cachedResponse) {
          console.log("Data already exists in the cache. No need to fetch.");
          return;
        }

        const response = await fetch(apiUrl);
        if (response.ok) {
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
    document.body.style.backgroundImage = `
      linear-gradient(135deg, var(--bg-main-1) 50%, var(--bg-main-2) 50%),
      url("${background}")
    `;
    document.body.style.backgroundSize = "cover, cover";
    document.body.style.backgroundBlendMode = "overlay";
    // Clean up on unmount
    return () => {
      document.body.style.backgroundImage = "";
      document.body.style.backgroundSize = "";
      document.body.style.backgroundBlendMode = "";
    };
  }, [background]);

  const menuItems = [
    { path: "/", icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-8">
        <path d="M11.47 3.841a.75.75 0 0 1 1.06 0l8.69 8.69a.75.75 0 1 0 1.06-1.061l-8.689-8.69a2.25 2.25 0 0 0-3.182 0l-8.69 8.69a.75.75 0 1 0 1.061 1.06l8.69-8.689Z" />
        <path d="m12 5.432 8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 0 1-.75-.75v-4.5a.75.75 0 0 0-.75-.75h-3a.75.75 0 0 0-.75.75V21a.75.75 0 0 1-.75.75H5.625a1.875 1.875 0 0 1-1.875-1.875v-6.198a2.29 2.29 0 0 0 .091-.086L12 5.432Z" />
      </svg>
    )},
    { path: "/gallery", icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-8">
        <path fillRule="evenodd" d="M1.5 6a2.25 2.25 0 0 1 2.25-2.25h16.5A2.25 2.25 0 0 1 22.5 6v12a2.25 2.25 0 0 1-2.25 2.25H3.75A2.25 2.25 0 0 1 1.5 18V6ZM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0 0 21 18v-1.94l-2.69-2.689a1.5 1.5 0 0 0-2.12 0l-.88.879.97.97a.75.75 0 1 1-1.06 1.06l-5.16-5.159a1.5 1.5 0 0 0-2.12 0L3 16.061Zm10.125-7.81a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Z" clipRule="evenodd" />
      </svg>
    )},
    { path: "/map", icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-8">
        <path fillRule="evenodd" d="m11.54 22.351.07.04.028.016a.76.76 0 0 0 .723 0l.028-.015.071-.041a16.975 16.975 0 0 0 1.144-.742 19.58 19.58 0 0 0 2.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 0 0-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 0 0 2.682 2.282 16.975 16.975 0 0 0 1.145.742ZM12 13.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" clipRule="evenodd" />
      </svg>
    )},
    { path: "/about", icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-8">
        <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 0 1 .67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 1 1-.671-1.34l.041-.022ZM12 9a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" clipRule="evenodd" />
      </svg>
    )}
  ];

  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/details/:url" element={<DetailsPage />} />
            <Route path="/map/:url?" element={<MapPage />} />
            <Route path="/about" element={<AboutUsPage />} />
          </Routes>
        </div>

        <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 z-100">
          <div className="relative">
            {/* Menu Items */}
            <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 flex items-center justify-center transition-all duration-500 ${isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
              {menuItems.map((item, index) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`absolute rounded-full p-3 border-2 border-white text-white hover:text-gray-300 transition-all duration-500 menu-btn-${(index % 4) + 1}`}
                  style={{
                    transform: isMenuOpen 
                      ? `translate(${Math.cos((index * 45 + 200) * Math.PI / 180) * 100}px, ${Math.sin((index * 45 + 200) * Math.PI / 180) * 100}px) scale(1) rotate(0deg)`
                      : `translate(0, 0) scale(0) rotate(-180deg)`,
                    transitionDelay: `${index * 100}ms`,
                    opacity: isMenuOpen ? 1 : 0
                  }}
                >
                  {item.icon}
                </Link>
              ))}
            </div>

            {/* Main Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="menu-btn-main rounded-full p-3 border-2 border-white text-white hover:text-gray-300 transition-all duration-500"
            >
              {isMenuOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-8">
                  <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-8">
                  <path fillRule="evenodd" d="M3 6.75A.75.75 0 0 1 3.75 6h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 6.75ZM3 12a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 12Zm0 5.25a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75a.75.75 0 0 1-.75-.75Z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          </div>
        </nav>
      </div>
    </Router>
  );
}

export default App;
