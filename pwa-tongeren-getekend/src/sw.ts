import { cleanupOutdatedCaches, precacheAndRoute } from "workbox-precaching";
import { NavigationRoute, Route, registerRoute } from "workbox-routing";
import { NetworkFirst, CacheFirst } from "workbox-strategies";

declare let self: ServiceWorkerGlobalScope;

// Clean up outdated caches
cleanupOutdatedCaches();

// Pre-cache all assets listed in the Workbox manifest
precacheAndRoute(self.__WB_MANIFEST);

// Force the Service Worker to take control immediately
self.skipWaiting();
self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

// Cache images
const imageRoute = new Route(
  ({ request }) => request.destination === "image",
  new CacheFirst({
    cacheName: "images",
    plugins: [
      {
        cacheWillUpdate: async ({ response }) => {
          if (response && response.status === 200) {
            console.log(`Caching image: ${response.url}`);
          }
          return response;
        },
      },
    ],
  })
);

registerRoute(imageRoute);


const audioRoute = new Route(
  ({ request }) => request.destination === "audio" || request.url.endsWith(".mp3"),
  new CacheFirst({
    cacheName: "audio-files",
    plugins: [
      {
        cacheWillUpdate: async ({ response }) => {
          if (response && response.status === 200) {
            console.log(`Caching audio file: ${response.url}`);
          }
          return response;
        },
      },
    ],
  })
);

registerRoute(audioRoute);

// Cache API calls
const fetchApiRoute = new Route(
  ({ request }) => request.url === "https://grondslag.be/api/tongerengetekend",
  new NetworkFirst({
    cacheName: "datatongerengetekend",
    plugins: [
      {
        cacheWillUpdate: async ({ response }) => {
          if (response && response.status === 200) {
            const clonedResponse = response.clone();
            const data = await clonedResponse.json();

            // Send the data to the main thread
            self.clients.matchAll().then((clients) => {
              clients.forEach((client) => {
                client.postMessage({
                  type: "CACHE_JSON",
                  data: data,
                });
              });
            });
          }
          return response;
        },
      },
    ],
  })
);

registerRoute(fetchApiRoute);

// Cache navigation routes
const navigationRoute = new NavigationRoute(
  new NetworkFirst({
    cacheName: "pages",
  }),
  {
    allowlist: [/^\/$/, /^\/details\/.+/, /^\/map/, /^\/about/, /^\/gallery/],
  }
);

registerRoute(navigationRoute);

// Preload the JSON file and dynamically cache building links
self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    (async () => {
      const cacheName = "datatongerengetekend";
      const apiUrl = "https://grondslag.be/api/tongerengetekend";

      try {
        // Notify the main thread that preloading has started
        self.clients.matchAll().then((clients) => {
          clients.forEach((client) => {
            client.postMessage({ type: "PRELOADING_START" });
          });
        });

        const cache = await caches.open(cacheName);
        const response = await fetch(apiUrl);
        if (response.ok) {
          // Cache the JSON file
          await cache.put(apiUrl, response.clone());
          console.log("Preloaded JSON file into cache.");

          // Parse the JSON file to get building URLs and images
          const data = await response.json();
          const buildingUrls = data.map((building: { url: string }) => `/details/${building.url}`);
          const imageUrls = data.map((building: { image_front: string }) => building.image_front);
          const soundfileUrls = data
            .map((building: { soundfile?: string }) => building.soundfile)
            .filter((url: string | undefined) => !!url); // filter out undefined
          // Cache each building's navigation route
          const pagesCache = await caches.open("pages");
          await Promise.all(
            buildingUrls.map(async (url) => {
              try {
                const response = await fetch(url);
                if (response.ok) {
                  await pagesCache.put(url, response.clone());
                  console.log(`Cached navigation route: ${url}`);
                } else {
                  console.warn(`Failed to fetch navigation route: ${url}`);
                }
              } catch (error) {
                console.error(`Error caching navigation route: ${url}`, error);
              }
            })
          );

          // Cache each image
          const imageCache = await caches.open("images");
          await Promise.all(
            imageUrls.map(async (url) => {
              try {
                const response = await fetch(url);
                if (response.ok) {
                  await imageCache.put(url, response.clone());
                  console.log(`Cached image: ${url}`);
                } else {
                  console.warn(`Failed to fetch image: ${url}`);
                }
              } catch (error) {
                console.error(`Error caching image: ${url}`, error);
              }
            })
          );


          // Cache each soundfile (MP3)
          const audioCache = await caches.open("audio-files");
          await Promise.all(
            soundfileUrls.map(async (url: string) => {
              try {
                const response = await fetch(url);
                if (response.ok) {
                  await audioCache.put(url, response.clone());
                  console.log(`Cached audio file: ${url}`);
                } else {
                  console.warn(`Failed to fetch audio file: ${url}`);
                }
              } catch (error) {
                console.error(`Error caching audio file: ${url}`, error);
              }
            })
          );
        }

        // Notify the main thread that preloading has ended
        self.clients.matchAll().then((clients) => {
          clients.forEach((client) => {
            client.postMessage({ type: "PRELOADING_END" });
          });
        });
      } catch (error) {
        console.error("Failed to preload JSON file or navigation links:", error);
      }
    })()
  );
});

// Listen for push events
self.addEventListener("push", (event) => {
  console.log("Push notification received:", event);

  const data = event.data ? event.data.json() : {};
  const title = data.title || "Default Title";
  const options = {
    body: data.body || "Default body content",
    icon: data.icon || "/default-icon.png",
    badge: data.badge || "/default-badge.png",
    data: data.url || "/", // URL to open when the notification is clicked
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

// Handle notification click events
self.addEventListener("notificationclick", (event) => {
  console.log("Notification click received:", event);

  event.notification.close(); // Close the notification

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      // If a window is already open, focus it
      for (const client of clientList) {
        if (client.url === event.notification.data && "focus" in client) {
          return client.focus();
        }
      }
      // Otherwise, open a new window
      if (clients.openWindow) {
        return clients.openWindow(event.notification.data);
      }
    })
  );
});