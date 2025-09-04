import { defineConfig } from "vite"
import path from "path"
import glob from "fast-glob"
import injectHTML from "vite-plugin-html-inject"
import VitePluginSvgSpritemap from "@spiriit/vite-plugin-svg-spritemap"
import { createHtmlPlugin } from "vite-plugin-html"
import { imgToPicture } from "@atrocityz/vite-plugin-html-img-to-picture"

const root = path.resolve(__dirname, "src")
const outDir = path.resolve(__dirname, "dist")
const htmlFiles = glob.sync("**/*.html", { cwd: root, ignore: ["**/node_modules/**", "**/_*", "**/partials/*"] })

export default defineConfig({
  root,
  base: "/",
  publicDir: "../public",

  build: {
    outDir,
    emptyOutDir: true,
    minify: true,
    assetsInlineLimit: 0,
    rollupOptions: {
      input: htmlFiles.reduce(
        (acc, file) => ({
          ...acc,
          [file.replace(path.extname(file), "")]: path.resolve(root, file),
        }),
        {},
      ),

      output: {
        entryFileNames: "assets/[name].js",
        chunkFileNames: "assets/[name].js",
        assetFileNames: ({ name }) => {
          name = name.toLowerCase()
          if (/\.(png|jpe?g|gif|webp|svg)$/.test(name ?? "")) {
            return "assets/images/[name][extname]"
          }
          if (/\.(woff2)$/.test(name ?? "")) {
            return "assets/fonts/[name][extname]"
          }
          return "assets/[name][extname]"
        },
      },
    },
  },

  resolve: {
    alias: [
      {
        find: "@/",
        replacement: path.resolve("src") + "/",
      },
    ],
  },

  plugins: [
    imgToPicture(),
    VitePluginSvgSpritemap("./icons/*.svg", {
      prefix: false,
      route: "sprite",
      output: {
        filename: "../sprite.svg",
        name: "sprite.svg",
        view: false,
        use: true,
      },
      svgo: {
        plugins: [
          {
            name: "removeStyleElement",
          },
          {
            name: "convertColors",
            params: {
              currentColor: true,
            },
          },
        ],
      },
    }),
    injectHTML(),
    createHtmlPlugin({
      minify: true,
    }),
  ],

  css: {
    devSourcemap: true,
    preprocessorOptions: {
      scss: {
        additionalData: `@use '@/styles/helpers' as *;`,
        silenceDeprecations: ["legacy-js-api"],
      },
      less: {},
      stylus: {},
    },
  },
})
