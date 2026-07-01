import path from "node:path";

import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const devPort = Number(process.env.VITE_DEV_PORT ?? 5173);
const isTunnel = process.env.VITE_TUNNEL === "1";

const tunnelServer = {
  host: "0.0.0.0",
  port: devPort,
  strictPort: true,
  allowedHosts: ["localhost", ".trycloudflare.com"] as string[],
  proxy: {
    "/api": "http://localhost:3000",
    "/uploads": "http://localhost:3000",
  },
  hmr: {
    clientPort: 443,
    protocol: "wss" as const,
  },
};

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: isTunnel
    ? tunnelServer
    : {
        proxy: {
          "/api": "http://localhost:3000",
          "/uploads": "http://localhost:3000",
        },
      },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            {
              name: "react-vendor",
              test: /node_modules[\\/](react|react-dom|react-router|react-router-dom|scheduler)[\\/]/,
              priority: 40,
            },
            {
              name: "antd-vendor",
              test: /node_modules[\\/](antd|@ant-design|@rc-component|@emotion|dayjs)[\\/]/,
              priority: 30,
              maxSize: 260_000,
            },
            {
              name: "motion-vendor",
              test: /node_modules[\\/](framer-motion|motion-dom|motion-utils)[\\/]/,
              priority: 25,
            },
            {
              name: "icons-vendor",
              test: /node_modules[\\/](lucide-react|@ant-design[\\/]icons|@ant-design[\\/]icons-svg)[\\/]/,
              priority: 24,
            },
            {
              name: "radix-vendor",
              test: /node_modules[\\/](@radix-ui|class-variance-authority|clsx|tailwind-merge)[\\/]/,
              priority: 20,
            },
          ],
        },
      },
    },
  },
});
