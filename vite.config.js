import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { createReadStream, existsSync } from "fs";
import { join, extname } from "path";

const MIME_TYPES = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".avif": "image/avif",
  ".webp": "image/webp",
  ".gif": "image/gif",
};

export default defineConfig({
  plugins: [
    react(),
    {
      name: "serve-root-assets",
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (!req.url?.startsWith("/assets/")) return next();
          const decoded = decodeURIComponent(req.url.split("?")[0]);
          const relative = decoded.replace(/^\//, "");
          const filePath = join(process.cwd(), relative);
          if (existsSync(filePath)) {
            const mimeType =
              MIME_TYPES[extname(filePath).toLowerCase()] ??
              "application/octet-stream";
            res.setHeader("Content-Type", mimeType);
            createReadStream(filePath).pipe(res);
            return;
          }
          next();
        });
      },
    },
  ],
});
