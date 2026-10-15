import { defineConfig } from "@lovable.dev/vite-tanstack-config";

/**
 * Vercel serves this app at the domain root and picks up Nitro's
 * Build Output API from `.vercel/output` after `npm run build`.
 */
export default defineConfig({
  nitro: {
    preset: "vercel",
  },
  vite: {
    server: {
      allowedHosts: ["localhost", "127.0.0.1"],
    },
    preview: {
      allowedHosts: ["localhost", "127.0.0.1"],
    },
  },
});
