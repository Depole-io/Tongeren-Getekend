/// <reference lib="webworker" />
import { cleanupOutdatedCaches, precacheAndRoute } from "workbox-precaching";
import { NavigationRoute, Route, registerRoute } from "workbox-routing";
import { NetworkFirst, CacheFirst } from "workbox-strategies";
import { ExpirationPlugin } from "workbox-expiration";

// Extend ServiceWorkerGlobalScope to include the properties we need
interface ExtendedServiceWorkerGlobalScope extends ServiceWorkerGlobalScope {
  __WB_MANIFEST: Array<{ url: string; revision: string }>;
  clients: Clients;
  skipWaiting(): Promise<void>;
  addEventListener(type: string, listener: EventListener): void;
  registration: ServiceWorkerRegistration;
}

// Add global declarations for clients
declare const clients: Clients;

// Add type declarations for events
interface ExtendableEvent extends Event {
  waitUntil(promise: Promise<any>): void;
}

interface PushEvent extends ExtendableEvent {
  data: PushMessageData;
}

interface NotificationEvent extends ExtendableEvent {
  notification: Notification;
}

declare let self: ExtendedServiceWorkerGlobalScope;

// Clean up outdated caches
cleanupOutdatedCaches();

// Pre-cache all assets listed in the Workbox manifest
precacheAndRoute(self.__WB_MANIFEST);

// Force the Service Worker to take control immediately
self.skipWaiting();
self.addEventListener("activate", ((event: Event) => {
  (event as ExtendableEvent).waitUntil(self.clients.claim());
}) as EventListener);

// Cache images
const imageRoute = new Route(
  ({ request }) => request.destination === "image",
  new CacheFirst({
    cacheName: "images",
    plugins: [
      new ExpirationPlugin({
        maxAgeSeconds: 2 * 60 * 60, // 2 hours
        maxEntries: 100, // Maximum number of entries to keep
      }),
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
      new ExpirationPlugin({
        maxAgeSeconds: 2 * 60 * 60, // 2 hours
        maxEntries: 50, // Maximum number of entries to keep
      }),
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
      new ExpirationPlugin({
        maxAgeSeconds: 2 * 60 * 60, // 2 hours
        maxEntries: 1, // Only one API response needed
      }),
      {
        cacheWillUpdate: async ({ response }) => {
          if (response && response.status === 200) {
            const clonedResponse = response.clone();
            const data = await clonedResponse.json();

            // Send the data to the main thread with proper error handling
            try {
              const clients = await self.clients.matchAll();
              await Promise.all(
                clients.map(async (client) => {
                  try {
                    await client.postMessage({
                      type: "CACHE_JSON",
                      data: data,
                    });
                  } catch (error) {
                    console.error("Error sending message to client:", error);
                  }
                })
              );
            } catch (error) {
              console.error("Error getting clients:", error);
            }
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
    plugins: [
      new ExpirationPlugin({
        maxAgeSeconds: 2 * 60 * 60, // 2 hours
        maxEntries: 50, // Maximum number of pages to keep
      }),
    ],
  }),
  {
    allowlist: [/^\/$/, /^\/details\/.+/, /^\/map/, /^\/about/, /^\/gallery/],
  }
);

registerRoute(navigationRoute);

// Preload the JSON file and dynamically cache building links
self.addEventListener("install", ((event: Event) => {
  self.skipWaiting();
  (event as ExtendableEvent).waitUntil(
    (async () => {
      const cacheName = "datatongerengetekend";
      const apiUrl = "https://grondslag.be/api/tongerengetekend";

      try {
        // Notify the main thread that preloading has started with proper error handling
        try {
          const clients = await self.clients.matchAll();
          await Promise.all(
            clients.map(async (client) => {
              try {
                await client.postMessage({ type: "PRELOADING_START" });
              } catch (error) {
                console.error("Error sending PRELOADING_START message:", error);
              }
            })
          );
        } catch (error) {
          console.error("Error getting clients for PRELOADING_START:", error);
        }

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
            .filter((url: string | undefined) => !!url);

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

        // Notify the main thread that preloading has ended with proper error handling
        try {
          const clients = await self.clients.matchAll();
          await Promise.all(
            clients.map(async (client) => {
              try {
                await client.postMessage({ type: "PRELOADING_END" });
              } catch (error) {
                console.error("Error sending PRELOADING_END message:", error);
              }
            })
          );
        } catch (error) {
          console.error("Error getting clients for PRELOADING_END:", error);
        }
      } catch (error) {
        console.error("Failed to preload JSON file or navigation links:", error);
      }
    })()
  );
}) as EventListener);

// Listen for push events
self.addEventListener("push", ((event: Event) => {
  const pushEvent = event as PushEvent;
  console.log("Push notification received:", pushEvent);

  const data = pushEvent.data ? pushEvent.data.json() : {};
  const title = data.title || "Default Title";
  const options = {
    body: data.body || "Default body content",
    icon: data.icon || "/default-icon.png",
    badge: data.badge || "/default-badge.png",
    data: data.url || "/", // URL to open when the notification is clicked
  };

  pushEvent.waitUntil(self.registration.showNotification(title, options));
}) as EventListener);

// Handle notification click events
self.addEventListener("notificationclick", ((event: Event) => {
  const notificationEvent = event as NotificationEvent;
  console.log("Notification click received:", notificationEvent);

  notificationEvent.notification.close(); // Close the notification

  notificationEvent.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      // If a window is already open, focus it
      for (const client of clientList) {
        if (client.url === notificationEvent.notification.data && "focus" in client) {
          return client.focus();
        }
      }
      // Otherwise, open a new window
      if (clients.openWindow) {
        return clients.openWindow(notificationEvent.notification.data);
      }
    })
  );
}) as EventListener);