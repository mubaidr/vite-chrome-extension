import { crx } from '@crxjs/vite-plugin'
import { dirname, relative } from 'path'
import AutoImport from 'unplugin-auto-import/vite'
import Icons from 'unplugin-icons/vite'
import { URL, fileURLToPath } from 'url'
import { defineConfig, type Plugin } from 'vite'
import { defineViteConfig as define } from './define.config'
import manifest from './manifest.config'
import packageJson from './package.json'

const transformHtmlPlugin = (data) =>
  <Plugin>{
    name: 'transform-html',
    transformIndexHtml: {
      order: 'pre',
      handler(html) {
        return html.replace(/<%=\s*(\w+)\s*%>/gi, (match, p1) => data[p1] || '')
      },
    },
  }

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '~': fileURLToPath(new URL('./src', import.meta.url)),
      src: fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  plugins: [
    crx({ manifest }),

    AutoImport({
      imports: [],
      dts: 'src/auto-imports.d.ts',
      dirs: ['src/composables/'],
    }),

    // https://github.com/antfu/unplugin-icons
    Icons({
      autoInstall: true,
      compiler: 'raw',
      scale: 1.5,
    }),

    // rewrite assets to use relative path
    {
      name: 'assets-rewrite',
      order: 'post',
      apply: 'build',
      transformIndexHtml(html, { path }) {
        return html.replace(
          /"\/assets\//g,
          `"${relative(dirname(path), '/assets')}/`
        )
      },
    },

    transformHtmlPlugin({
      HTML_TITLE: packageJson.displayName || packageJson.name,
    }),
  ],
  define,
  build: {
    rollupOptions: {
      input: {
        iframe: 'src/content-script/iframe/index.html',
        install: 'src/setup/install.html',
        update: 'src/setup/update.html',
      },
    },
  },
  server: {
    port: 8888,
    strictPort: true,
    hmr: {
      port: 8889,
      overlay: true,
    },
  },
  optimizeDeps: {
    include: [],
    exclude: [],
  },
})
