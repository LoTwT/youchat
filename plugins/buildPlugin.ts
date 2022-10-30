import { Plugin } from "vite"
import fs from "node:fs"
import path from "node:path"

export const buildPlugin = (): Plugin => {
  return {
    name: "build-plugin",
    closeBundle: () => {
      const buildObj = new BuildObj()
      buildObj.buildMain()
      buildObj.preparePackageJson()
      buildObj.buildInstaller()
    },
  }
}

class BuildObj {
  // 编译主进程代码
  buildMain() {
    require("esbuild").buildSync({
      entryPoints: ["./src/main/mainEntry.ts"],
      bundle: true,
      platform: "node",
      minify: true,
      outfile: "./dist/mainEntry.js",
      external: ["electron"],
    })
  }

  // 为生产边境准备 package.json
  preparePackageJson() {
    const pkgJsonPath = path.join(process.cwd(), "package.json")
    const localPkgJson = JSON.parse(fs.readFileSync(pkgJsonPath, "utf-8"))
    const electronConfig = localPkgJson.devDependencies.electron.replace(
      "^",
      "",
    )
    localPkgJson.main = "mainEntry.js"
    delete localPkgJson.scripts
    delete localPkgJson.devDependencies

    localPkgJson.devDependencies = { electron: electronConfig }

    const tarJsonPath = path.join(process.cwd(), "dist", "package.json")

    fs.writeFileSync(tarJsonPath, JSON.stringify(localPkgJson))
    fs.mkdirSync(path.join(process.cwd(), "dist/node_modules"))
  }

  // 使用 electron-builder 制成安装包
  buildInstaller() {
    const options = {
      config: {
        directories: {
          output: path.join(process.cwd(), "release"),
          app: path.join(process.cwd(), "dist"),
        },
        files: ["**"],
        extends: null,
        productName: "Youchat",
        appId: "com.youchat.desktop",
        asar: true,
        nsis: {
          oneClick: true,
          perMachine: true,
          allowToChangeInstallationDirectory: false,
          createDesktopShortcut: true,
          createStartMenuShortcut: true,
          shortcutName: "youchatDesktop",
        },
        publish: [{ provider: "generic", url: "http://localhost:5500/" }],
      },
      project: process.cwd(),
    }

    return require("electron-builder").build(options)
  }
}
