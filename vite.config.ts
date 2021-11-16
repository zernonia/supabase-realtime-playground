import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"
import WindiCSS from "vite-plugin-windicss"
import Components from "vite-plugin-components"
import ViteIcons, { ViteIconsResolver } from "vite-plugin-icons"

import path from "path"

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  plugins: [
    vue(),
    WindiCSS(),
    Components({
      customComponentResolvers: ViteIconsResolver(),
    }),
    ViteIcons(),
  ],
})
