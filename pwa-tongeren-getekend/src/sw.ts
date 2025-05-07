import { cleanupOutdatedCaches, precacheAndRoute } from "workbox-precaching";
import { NavigationRoute, Route, registerRoute } from "workbox-routing";
import { NetworkFirst, CacheFirst } from "workbox-strategies";

declare let self: ServiceWorkerGlobalScope

cleanupOutdatedCaches();

precacheAndRoute(self.__WB_MANIFEST);

self.skipWaiting();

//cache images
const imageRoute = new Route(
  ({ request, sameOrigin }) => {
    return sameOrigin && request.destination === "image";
  },
  new CacheFirst({
    cacheName: "images",
  })
);

registerRoute(imageRoute);

//cache api calls
const fetchApiRoute = new Route(
  ({ request }) => {
    return request.url === "https://grondslag.be/api/tongerengetekend";
  },
  new NetworkFirst({
    cacheName: "api/tongerengetekend",
  })
);

registerRoute(fetchApiRoute);

//cache naviagtion route

const naviagtionRoute = new NavigationRoute(
  new NetworkFirst({
    cacheName: "pages",

    networkTimeoutSeconds: 3,
  })
  
);

registerRoute(naviagtionRoute);