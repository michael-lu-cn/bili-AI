import path from 'node:path'
import react from '@vitejs/plugin-react-swc'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  base: './', // 使用相对路径，确保打包到 asar 后资源以相对路径加载
  plugins: [react()],
  // 解决在 renderer 中通过包名导入 preload 的路径问题（开发模式）
  // 使用 preload 包的浏览器兼容虚拟模块，而不是 Node 专用的 exposed.mjs
  resolve: {
    alias: {
      '@app/preload': path.resolve(__dirname, '../preload/dist/_virtual_browser.mjs'),
    },
  },
  esbuild: false, // 禁用esbuild，使用SWC
  build: {
    target: 'esnext',
    minify: 'terser', // 或者使用 'esbuild' 如果你想要更快的构建
  },
})
