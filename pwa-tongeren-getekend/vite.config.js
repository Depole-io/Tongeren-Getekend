import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Generate a timestamp-based revision for cache busting
const timestamp = Date.now();

// https://vite.dev/config/
export default defineConfig({
  base: '/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: undefined
      }
    }
  },
  server: {
    host: true,
    port: 3000,
  },
  optimizeDeps: {
    include: ["react-leaflet", "leaflet"],
  },

  preview: {
    host: true,
    allowedHosts: ["*"], // allow all hosts for preview too
  },

  plugins: [
    tailwindcss(),
    react(),
    VitePWA({
      devOptions: {
        enabled: true,
        type: 'module'
      },
      strategies: "injectManifest",
      srcDir: "src",
      filename: "sw.ts",
      registerType: "autoUpdate",
      injectManifest: {
        swDest: "dist/sw.js",
        injectionPoint: 'self.__WB_MANIFEST',
        additionalManifestEntries: [
          { url: '/', revision: timestamp.toString() },
          { url: '/index.html', revision: timestamp.toString() }
        ]
      },
      includeAssets: ["favicon.ico", "apple-touch-icon.png", "mask-icon.svg"],
      manifest: {
        name: "Tongeren Getekend",
        short_name: "Tongeren Getekend",
        theme_color: "#ffffff",
        background_color: "#ffffff",
        start_url: "/",
        display: "standalone",
        orientation: "portrait",
        scope: "/",
        lang: "en",
        icons: [
          {
            src: "pwa-64x64.png",
            sizes: "64x64",
            type: "image/png",
          },
          {
            src: "pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "maskable-icon-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
    }),
    // Custom plugin to ensure proper MIME type
    {
      name: 'configure-server',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url?.endsWith('.js')) {
            res.setHeader('Content-Type', 'application/javascript');
          }
          next();
        });
      }
    }
  ],
});
