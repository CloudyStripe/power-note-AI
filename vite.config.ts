import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { crx } from '@crxjs/vite-plugin'
import nodePolyfills from 'vite-plugin-node-stdlib-browser';
import manifest from './manifest.json'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), nodePolyfills(), crx({ manifest })],
})
