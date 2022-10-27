import { Plugin } from "vite"

export const devPlugin = (): Plugin => {
  return {
    name: "dev-plugin",
    configureServer(server) {
      ;(require("esbuild") as typeof import("esbuild")).buildSync({
        entryPoints: ["./src/main/mainEntry.ts"],
        bundle: true,
        platform: "node",
        outfile: "./dist/mainEntry.js",
        external: ["electron"],
      })

      // httpServer 启动成功后，启动 electron 应用
      server.httpServer?.once("listening", () => {
        const { spawn } =
          require("node:child_process") as typeof import("node:child_process")
        console.log(server.config.server.port)
        const electronProcess = spawn(
          require("electron").toString(),
          [
            "./dist/mainEntry.js",
            `http://localhost:${server.config.server.port}`,
          ],
          {
            cwd: process.cwd(),
            stdio: "inherit",
          },
        )

        electronProcess.on("close", () => {
          server.close()
          process.exit()
        })
      })
    },
  }
}
