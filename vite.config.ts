import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"
import { devPlugin, getReplacer } from "./plugins/devPlugin"
import Optimizer from "vite-plugin-optimizer"
import { buildPlugin } from "./plugins/buildPlugin"

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    rollupOptions: {
      plugins: [buildPlugin()],
    },
  },

  plugins: [Optimizer(getReplacer()), devPlugin(), vue()],
})
