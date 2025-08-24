import path from 'node:path'
import { build, createServer } from 'vite'

/**
 * This script is designed to run multiple packages of your application in a special development mode.
 * To do this, you need to follow a few steps:
 */

/**
 * 1. We create a few flags to let everyone know that we are in development mode.
 */
const mode = 'development'
process.env.NODE_ENV = mode
process.env.MODE = mode

// 仅在本地开发环境下使用国内镜像下载 Electron，CI 环境（例如 GitHub Actions）保留默认行为
if (!process.env.CI) {
  process.env.ELECTRON_MIRROR =
    process.env.ELECTRON_MIRROR || 'https://npmmirror.com/mirrors/electron/'
  process.env.npm_config_electron_mirror =
    process.env.npm_config_electron_mirror || process.env.ELECTRON_MIRROR
}

/**
 * 2. We create a development server for the renderer. It is assumed that the renderer exists and is located in the “renderer” package.
 * This server should be started first because other packages depend on its settings.
 */
/**
 * @type {import('vite').ViteDevServer}
 */
// 如果需要固定端口可通过环境变量 VITE_DEV_SERVER_PORT 指定；否则使用随机可用端口以避免占用 5173/5174
const devServerPort = process.env.VITE_DEV_SERVER_PORT
  ? Number(process.env.VITE_DEV_SERVER_PORT)
  : 0
const rendererWatchServer = await createServer({
  mode,
  root: path.resolve('packages/renderer'),
  server: {
    port: devServerPort,
    strictPort: false,
  },
})

await rendererWatchServer.listen()

/**
 * 3. We are creating a simple provider plugin.
 * Its only purpose is to provide access to the renderer dev-server to all other build processes.
 */
/** @type {import('vite').Plugin} */
const rendererWatchServerProvider = {
  name: '@app/renderer-watch-server-provider',
  api: {
    provideRendererWatchServer() {
      return rendererWatchServer
    },
  },
}

/**
 * 4. Start building all other packages.
 * For each of them, we add a plugin provider so that each package can implement its own hot update mechanism.
 */

/** @type {string[]} */
const packagesToStart = ['packages/preload', 'packages/main']

for (const pkg of packagesToStart) {
  await build({
    mode,
    root: path.resolve(pkg),
    plugins: [rendererWatchServerProvider],
  })
}
