// vite.config.ts
import { dirname as dirname2, relative } from "path";
import { defineConfig } from "file:///Users/liufeng/Desktop/gemini/Leetcode-Sync-Github-Helper/node_modules/vite/dist/node/index.js";
import Vue from "file:///Users/liufeng/Desktop/gemini/Leetcode-Sync-Github-Helper/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import replace from "file:///Users/liufeng/Desktop/gemini/Leetcode-Sync-Github-Helper/node_modules/@rollup/plugin-replace/dist/es/index.js";
import Icons from "file:///Users/liufeng/Desktop/gemini/Leetcode-Sync-Github-Helper/node_modules/unplugin-icons/dist/vite.js";
import IconsResolver from "file:///Users/liufeng/Desktop/gemini/Leetcode-Sync-Github-Helper/node_modules/unplugin-icons/dist/resolver.js";
import Components from "file:///Users/liufeng/Desktop/gemini/Leetcode-Sync-Github-Helper/node_modules/unplugin-vue-components/dist/vite.js";
import AutoImport from "file:///Users/liufeng/Desktop/gemini/Leetcode-Sync-Github-Helper/node_modules/unplugin-auto-import/dist/vite.js";
import UnoCSS from "file:///Users/liufeng/Desktop/gemini/Leetcode-Sync-Github-Helper/node_modules/unocss/dist/vite.mjs";
import { ElementPlusResolver } from "file:///Users/liufeng/Desktop/gemini/Leetcode-Sync-Github-Helper/node_modules/unplugin-vue-components/dist/resolvers.js";

// scripts/utils.ts
import { resolve } from "path";
import { bgCyan, black } from "file:///Users/liufeng/Desktop/gemini/Leetcode-Sync-Github-Helper/node_modules/kolorist/dist/esm/index.mjs";
var __vite_injected_original_dirname = "/Users/liufeng/Desktop/gemini/Leetcode-Sync-Github-Helper/scripts";
var port = parseInt(process.env.PORT || "") || 3303;
var r = (...args) => resolve(__vite_injected_original_dirname, "..", ...args);
var isDev = process.env.NODE_ENV !== "production";
var isWin = process.platform === "win32";

// vite-mv3-hmr.ts
import { dirname, join } from "path";
import fs from "file:///Users/liufeng/Desktop/gemini/Leetcode-Sync-Github-Helper/node_modules/fs-extra/lib/index.js";
var targetDir = r("extension");
var MV3Hmr = () => {
  return {
    name: "vite-mv3-hmr",
    apply: "serve",
    enforce: "post",
    async configureServer(server) {
      const originWsSend = server.ws.send;
      server.ws.send = async function(payload) {
        if (payload.type === "update") {
          for (const update of payload.updates) {
            await writeToDisk(update.path);
            if (update.acceptedPath !== update.path)
              await writeToDisk(update.acceptedPath);
          }
          payload.updates = payload.updates.map((update) => {
            const isJsUpdate = update.type === "js-update";
            if (!isJsUpdate)
              return update;
            return {
              ...update,
              path: `${update.path}.js`,
              acceptedPath: `${update.acceptedPath}.js`
            };
          });
        }
        originWsSend.call(this, payload);
      };
      async function writeToDisk(url) {
        const result = await server.transformRequest(url.replace(/^\/@id\//, ""));
        let code = result == null ? void 0 : result.code;
        if (!code)
          return;
        const urlModule = await server.moduleGraph.getModuleByUrl(url);
        const importedModules = urlModule == null ? void 0 : urlModule.importedModules;
        if (importedModules) {
          for (const mod of importedModules) {
            code = code.replace(mod.url, normalizeViteUrl(
              isWin ? mod.url.replace(/[A-Z]:\//, "").replace(/:/, ".") : mod.url,
              mod.type
            ));
            writeToDisk(mod.url);
          }
        }
        if (urlModule == null ? void 0 : urlModule.url) {
          code = code.replace(/\/@vite\/client/g, "/dist/mv3client.mjs").replace(/\/@id\//g, "/").replace(/__uno.css/g, "~~uno.css").replace(/__x00__plugin-vue:export-helper/g, "~~x00__plugin-vue:export-helper.js").replace(/(\/\.vite\/deps\/\S+?)\?v=\w+/g, "$1");
          if (isWin) {
            code = code.replace(/(from\s+["']\/@fs\/)[A-Z]:\//g, "$1");
          }
          const targetFile = normalizeFsUrl(
            isWin ? urlModule.url.replace(/[A-Z]:\//, "").replace(/:/, ".") : urlModule.url,
            urlModule.type
          );
          await fs.ensureDir(dirname(targetFile));
          await fs.writeFile(targetFile, code);
        }
      }
      Object.keys(server.config.build.rollupOptions.input).map((entry) => writeToDisk(`/${entry}/main.ts`));
    }
  };
};
function normalizeViteUrl(url, type) {
  url = url.replace(/\?v=\w+$/, "");
  if (type === "js" && !url.endsWith(".js") && !url.endsWith(".mjs"))
    url = `${url}.js`.replace(/vue\?/, "vue.js_");
  return url;
}
function normalizeFsUrl(url, type) {
  return join(
    targetDir,
    normalizeViteUrl(url, type).replace(/^\//, "").replace(/\u0000/g, "__x00__").replace(/^_+/, (match) => "~".repeat(match.length))
  );
}

// vite.config.ts
var sharedConfig = {
  root: r("src"),
  resolve: {
    alias: {
      "~/": `${r("src")}/`
    }
  },
  plugins: [
    Vue(),
    AutoImport({
      imports: [
        "vue",
        {
          "webextension-polyfill": [["*", "browser"]]
        }
      ],
      resolvers: [ElementPlusResolver()],
      dts: r("src/auto-imports.d.ts")
    }),
    Components({
      dirs: [r("src/components")],
      dts: r("src/components.d.ts"),
      resolvers: [
        ElementPlusResolver({
          importStyle: "sass"
        }),
        IconsResolver({
          componentPrefix: ""
        })
      ]
    }),
    Icons(),
    UnoCSS(),
    replace({
      "preventAssignment": true,
      "__DEV__": JSON.stringify(isDev),
      "process.env.NODE_ENV": JSON.stringify(
        isDev ? "development" : "production"
      ),
      "__VUE_OPTIONS_API__": JSON.stringify(true),
      "__VUE_PROD_DEVTOOLS__": JSON.stringify(false)
    }),
    {
      name: "assets-rewrite",
      enforce: "post",
      apply: "build",
      transformIndexHtml(html, { path }) {
        return html.replace(
          /"\/assets\//g,
          `"${relative(dirname2(path), "/assets")}/`
        );
      }
    }
  ],
  optimizeDeps: {
    include: ["vue", "@vueuse/core", "webextension-polyfill"],
    exclude: ["vue-demi"]
  }
};
var vite_config_default = defineConfig(({ command }) => ({
  ...sharedConfig,
  base: command === "serve" ? `http://localhost:${port}/` : "/dist/",
  server: {
    port,
    hmr: {
      host: "localhost"
    }
  },
  build: {
    outDir: r("extension/dist"),
    emptyOutDir: false,
    sourcemap: isDev ? "inline" : false,
    terserOptions: {
      mangle: false
    },
    rollupOptions: {
      input: {
        options: r("src/options/index.html"),
        popup: r("src/popup/index.html")
      }
    }
  },
  plugins: [
    ...sharedConfig.plugins,
    MV3Hmr()
  ],
  test: {
    globals: true,
    environment: "jsdom"
  }
}));
export {
  vite_config_default as default,
  sharedConfig
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiLCAic2NyaXB0cy91dGlscy50cyIsICJ2aXRlLW12My1obXIudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvbGl1ZmVuZy9EZXNrdG9wL2dlbWluaS9MZWV0Y29kZS1TeW5jLUdpdGh1Yi1IZWxwZXJcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy9saXVmZW5nL0Rlc2t0b3AvZ2VtaW5pL0xlZXRjb2RlLVN5bmMtR2l0aHViLUhlbHBlci92aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvbGl1ZmVuZy9EZXNrdG9wL2dlbWluaS9MZWV0Y29kZS1TeW5jLUdpdGh1Yi1IZWxwZXIvdml0ZS5jb25maWcudHNcIjsvLy8gPHJlZmVyZW5jZSB0eXBlcz1cInZpdGVzdFwiIC8+XG5cbmltcG9ydCB7IGRpcm5hbWUsIHJlbGF0aXZlIH0gZnJvbSAncGF0aCdcbmltcG9ydCB0eXBlIHsgVXNlckNvbmZpZyB9IGZyb20gJ3ZpdGUnXG5pbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJ1xuaW1wb3J0IFZ1ZSBmcm9tICdAdml0ZWpzL3BsdWdpbi12dWUnXG5pbXBvcnQgcmVwbGFjZSBmcm9tICdAcm9sbHVwL3BsdWdpbi1yZXBsYWNlJ1xuaW1wb3J0IEljb25zIGZyb20gJ3VucGx1Z2luLWljb25zL3ZpdGUnXG5pbXBvcnQgSWNvbnNSZXNvbHZlciBmcm9tICd1bnBsdWdpbi1pY29ucy9yZXNvbHZlcidcbmltcG9ydCBDb21wb25lbnRzIGZyb20gJ3VucGx1Z2luLXZ1ZS1jb21wb25lbnRzL3ZpdGUnXG5pbXBvcnQgQXV0b0ltcG9ydCBmcm9tICd1bnBsdWdpbi1hdXRvLWltcG9ydC92aXRlJ1xuaW1wb3J0IFVub0NTUyBmcm9tICd1bm9jc3Mvdml0ZSdcbmltcG9ydCB7IEVsZW1lbnRQbHVzUmVzb2x2ZXIgfSBmcm9tICd1bnBsdWdpbi12dWUtY29tcG9uZW50cy9yZXNvbHZlcnMnXG5pbXBvcnQgeyBpc0RldiwgcG9ydCwgciB9IGZyb20gJy4vc2NyaXB0cy91dGlscydcbmltcG9ydCB7IE1WM0htciB9IGZyb20gJy4vdml0ZS1tdjMtaG1yJ1xuXG5leHBvcnQgY29uc3Qgc2hhcmVkQ29uZmlnOiBVc2VyQ29uZmlnID0ge1xuICByb290OiByKCdzcmMnKSxcbiAgcmVzb2x2ZToge1xuICAgIGFsaWFzOiB7XG4gICAgICAnfi8nOiBgJHtyKCdzcmMnKX0vYCxcbiAgICB9LFxuICB9LFxuICBwbHVnaW5zOiBbXG4gICAgVnVlKCksXG5cbiAgICBBdXRvSW1wb3J0KHtcbiAgICAgIGltcG9ydHM6IFtcbiAgICAgICAgJ3Z1ZScsXG4gICAgICAgIHtcbiAgICAgICAgICAnd2ViZXh0ZW5zaW9uLXBvbHlmaWxsJzogW1snKicsICdicm93c2VyJ11dLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICAgIHJlc29sdmVyczogW0VsZW1lbnRQbHVzUmVzb2x2ZXIoKV0sXG4gICAgICBkdHM6IHIoJ3NyYy9hdXRvLWltcG9ydHMuZC50cycpLFxuICAgIH0pLFxuXG4gICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL2FudGZ1L3VucGx1Z2luLXZ1ZS1jb21wb25lbnRzXG4gICAgQ29tcG9uZW50cyh7XG4gICAgICBkaXJzOiBbcignc3JjL2NvbXBvbmVudHMnKV0sXG4gICAgICAvLyBnZW5lcmF0ZSBgY29tcG9uZW50cy5kLnRzYCBmb3IgdHMgc3VwcG9ydCB3aXRoIFZvbGFyXG4gICAgICBkdHM6IHIoJ3NyYy9jb21wb25lbnRzLmQudHMnKSxcbiAgICAgIHJlc29sdmVyczogW1xuICAgICAgICBFbGVtZW50UGx1c1Jlc29sdmVyKHtcbiAgICAgICAgICBpbXBvcnRTdHlsZTogJ3Nhc3MnLFxuICAgICAgICB9KSxcbiAgICAgICAgLy8gYXV0byBpbXBvcnQgaWNvbnNcbiAgICAgICAgSWNvbnNSZXNvbHZlcih7XG4gICAgICAgICAgY29tcG9uZW50UHJlZml4OiAnJyxcbiAgICAgICAgfSksXG4gICAgICBdLFxuICAgIH0pLFxuXG4gICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL2FudGZ1L3VucGx1Z2luLWljb25zXG4gICAgSWNvbnMoKSxcblxuICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS91bm9jc3MvdW5vY3NzXG4gICAgVW5vQ1NTKCksXG5cbiAgICByZXBsYWNlKHtcbiAgICAgICdwcmV2ZW50QXNzaWdubWVudCc6IHRydWUsXG4gICAgICAnX19ERVZfXyc6IEpTT04uc3RyaW5naWZ5KGlzRGV2KSxcbiAgICAgICdwcm9jZXNzLmVudi5OT0RFX0VOVic6IEpTT04uc3RyaW5naWZ5KFxuICAgICAgICBpc0RldiA/ICdkZXZlbG9wbWVudCcgOiAncHJvZHVjdGlvbicsXG4gICAgICApLFxuICAgICAgJ19fVlVFX09QVElPTlNfQVBJX18nOiBKU09OLnN0cmluZ2lmeSh0cnVlKSxcbiAgICAgICdfX1ZVRV9QUk9EX0RFVlRPT0xTX18nOiBKU09OLnN0cmluZ2lmeShmYWxzZSksXG4gICAgfSksXG5cbiAgICAvLyByZXdyaXRlIGFzc2V0cyB0byB1c2UgcmVsYXRpdmUgcGF0aFxuICAgIHtcbiAgICAgIG5hbWU6ICdhc3NldHMtcmV3cml0ZScsXG4gICAgICBlbmZvcmNlOiAncG9zdCcsXG4gICAgICBhcHBseTogJ2J1aWxkJyxcbiAgICAgIHRyYW5zZm9ybUluZGV4SHRtbChodG1sLCB7IHBhdGggfSkge1xuICAgICAgICByZXR1cm4gaHRtbC5yZXBsYWNlKFxuICAgICAgICAgIC9cIlxcL2Fzc2V0c1xcLy9nLFxuICAgICAgICAgIGBcIiR7cmVsYXRpdmUoZGlybmFtZShwYXRoKSwgJy9hc3NldHMnKX0vYCxcbiAgICAgICAgKVxuICAgICAgfSxcbiAgICB9LFxuICBdLFxuICBvcHRpbWl6ZURlcHM6IHtcbiAgICBpbmNsdWRlOiBbJ3Z1ZScsICdAdnVldXNlL2NvcmUnLCAnd2ViZXh0ZW5zaW9uLXBvbHlmaWxsJ10sXG4gICAgZXhjbHVkZTogWyd2dWUtZGVtaSddLFxuICB9LFxufVxuXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoKHsgY29tbWFuZCB9KSA9PiAoe1xuICAuLi5zaGFyZWRDb25maWcsXG4gIGJhc2U6IGNvbW1hbmQgPT09ICdzZXJ2ZScgPyBgaHR0cDovL2xvY2FsaG9zdDoke3BvcnR9L2AgOiAnL2Rpc3QvJyxcbiAgc2VydmVyOiB7XG4gICAgcG9ydCxcbiAgICBobXI6IHtcbiAgICAgIGhvc3Q6ICdsb2NhbGhvc3QnLFxuICAgIH0sXG4gIH0sXG4gIGJ1aWxkOiB7XG4gICAgb3V0RGlyOiByKCdleHRlbnNpb24vZGlzdCcpLFxuICAgIGVtcHR5T3V0RGlyOiBmYWxzZSxcbiAgICBzb3VyY2VtYXA6IGlzRGV2ID8gJ2lubGluZScgOiBmYWxzZSxcbiAgICAvLyBodHRwczovL2RldmVsb3Blci5jaHJvbWUuY29tL2RvY3Mvd2Vic3RvcmUvcHJvZ3JhbV9wb2xpY2llcy8jOn46dGV4dD1Db2RlJTIwUmVhZGFiaWxpdHklMjBSZXF1aXJlbWVudHNcbiAgICB0ZXJzZXJPcHRpb25zOiB7XG4gICAgICBtYW5nbGU6IGZhbHNlLFxuICAgIH0sXG4gICAgcm9sbHVwT3B0aW9uczoge1xuICAgICAgaW5wdXQ6IHtcbiAgICAgICAgb3B0aW9uczogcignc3JjL29wdGlvbnMvaW5kZXguaHRtbCcpLFxuICAgICAgICBwb3B1cDogcignc3JjL3BvcHVwL2luZGV4Lmh0bWwnKSxcbiAgICAgIH0sXG4gICAgfSxcbiAgfSxcbiAgcGx1Z2luczogW1xuICAgIC4uLnNoYXJlZENvbmZpZy5wbHVnaW5zISxcblxuICAgIE1WM0htcigpLFxuICBdLFxuICB0ZXN0OiB7XG4gICAgZ2xvYmFsczogdHJ1ZSxcbiAgICBlbnZpcm9ubWVudDogJ2pzZG9tJyxcbiAgfSxcbn0pKVxuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvbGl1ZmVuZy9EZXNrdG9wL2dlbWluaS9MZWV0Y29kZS1TeW5jLUdpdGh1Yi1IZWxwZXIvc2NyaXB0c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL2xpdWZlbmcvRGVza3RvcC9nZW1pbmkvTGVldGNvZGUtU3luYy1HaXRodWItSGVscGVyL3NjcmlwdHMvdXRpbHMudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL2xpdWZlbmcvRGVza3RvcC9nZW1pbmkvTGVldGNvZGUtU3luYy1HaXRodWItSGVscGVyL3NjcmlwdHMvdXRpbHMudHNcIjtpbXBvcnQgeyByZXNvbHZlIH0gZnJvbSAncGF0aCdcbmltcG9ydCB7IGJnQ3lhbiwgYmxhY2sgfSBmcm9tICdrb2xvcmlzdCdcblxuZXhwb3J0IGNvbnN0IHBvcnQgPSBwYXJzZUludChwcm9jZXNzLmVudi5QT1JUIHx8ICcnKSB8fCAzMzAzXG5leHBvcnQgY29uc3QgciA9ICguLi5hcmdzOiBzdHJpbmdbXSkgPT4gcmVzb2x2ZShfX2Rpcm5hbWUsICcuLicsIC4uLmFyZ3MpXG5leHBvcnQgY29uc3QgaXNEZXYgPSBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nXG5leHBvcnQgY29uc3QgaXNXaW4gPSBwcm9jZXNzLnBsYXRmb3JtID09PSAnd2luMzInXG5cbmV4cG9ydCBmdW5jdGlvbiBsb2cobmFtZTogc3RyaW5nLCBtZXNzYWdlOiBzdHJpbmcpIHtcbiAgY29uc29sZS5sb2coYmxhY2soYmdDeWFuKGAgJHtuYW1lfSBgKSksIG1lc3NhZ2UpXG59XG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9Vc2Vycy9saXVmZW5nL0Rlc2t0b3AvZ2VtaW5pL0xlZXRjb2RlLVN5bmMtR2l0aHViLUhlbHBlclwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL2xpdWZlbmcvRGVza3RvcC9nZW1pbmkvTGVldGNvZGUtU3luYy1HaXRodWItSGVscGVyL3ZpdGUtbXYzLWhtci50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvbGl1ZmVuZy9EZXNrdG9wL2dlbWluaS9MZWV0Y29kZS1TeW5jLUdpdGh1Yi1IZWxwZXIvdml0ZS1tdjMtaG1yLnRzXCI7aW1wb3J0IHsgZGlybmFtZSwgam9pbiB9IGZyb20gJ3BhdGgnXG5pbXBvcnQgdHlwZSB7IEhNUlBheWxvYWQsIFBsdWdpbk9wdGlvbiB9IGZyb20gJ3ZpdGUnXG5pbXBvcnQgZnMgZnJvbSAnZnMtZXh0cmEnXG5pbXBvcnQgeyBpc1dpbiwgciB9IGZyb20gJy4vc2NyaXB0cy91dGlscydcblxuY29uc3QgdGFyZ2V0RGlyID0gcignZXh0ZW5zaW9uJylcblxuZXhwb3J0IGNvbnN0IE1WM0htciA9ICgpOiBQbHVnaW5PcHRpb24gPT4ge1xuICByZXR1cm4ge1xuICAgIG5hbWU6ICd2aXRlLW12My1obXInLFxuICAgIGFwcGx5OiAnc2VydmUnLFxuICAgIGVuZm9yY2U6ICdwb3N0JyxcbiAgICBhc3luYyBjb25maWd1cmVTZXJ2ZXIoc2VydmVyKSB7XG4gICAgICBjb25zdCBvcmlnaW5Xc1NlbmQ6IChwYXlsb2FkOiBITVJQYXlsb2FkKSA9PiB2b2lkID0gc2VydmVyLndzLnNlbmRcblxuICAgICAgc2VydmVyLndzLnNlbmQgPSBhc3luYyBmdW5jdGlvbiAocGF5bG9hZDogSE1SUGF5bG9hZCkge1xuICAgICAgICBpZiAocGF5bG9hZC50eXBlID09PSAndXBkYXRlJykge1xuICAgICAgICAgIGZvciAoY29uc3QgdXBkYXRlIG9mIHBheWxvYWQudXBkYXRlcykge1xuICAgICAgICAgICAgYXdhaXQgd3JpdGVUb0Rpc2sodXBkYXRlLnBhdGgpXG4gICAgICAgICAgICBpZiAodXBkYXRlLmFjY2VwdGVkUGF0aCAhPT0gdXBkYXRlLnBhdGgpXG4gICAgICAgICAgICAgIGF3YWl0IHdyaXRlVG9EaXNrKHVwZGF0ZS5hY2NlcHRlZFBhdGgpXG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcGF5bG9hZC51cGRhdGVzID0gcGF5bG9hZC51cGRhdGVzLm1hcCgodXBkYXRlKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBpc0pzVXBkYXRlID0gdXBkYXRlLnR5cGUgPT09ICdqcy11cGRhdGUnXG5cbiAgICAgICAgICAgIGlmICghaXNKc1VwZGF0ZSlcbiAgICAgICAgICAgICAgcmV0dXJuIHVwZGF0ZVxuXG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAuLi51cGRhdGUsXG4gICAgICAgICAgICAgIHBhdGg6IGAke3VwZGF0ZS5wYXRofS5qc2AsXG4gICAgICAgICAgICAgIGFjY2VwdGVkUGF0aDogYCR7dXBkYXRlLmFjY2VwdGVkUGF0aH0uanNgLFxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICAgICAgb3JpZ2luV3NTZW5kLmNhbGwodGhpcywgcGF5bG9hZClcbiAgICAgIH1cblxuICAgICAgYXN5bmMgZnVuY3Rpb24gd3JpdGVUb0Rpc2sodXJsOiBzdHJpbmcpIHtcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgc2VydmVyLnRyYW5zZm9ybVJlcXVlc3QodXJsLnJlcGxhY2UoL15cXC9AaWRcXC8vLCAnJykpXG4gICAgICAgIGxldCBjb2RlID0gcmVzdWx0Py5jb2RlXG4gICAgICAgIGlmICghY29kZSlcbiAgICAgICAgICByZXR1cm5cblxuICAgICAgICBjb25zdCB1cmxNb2R1bGUgPSBhd2FpdCBzZXJ2ZXIubW9kdWxlR3JhcGguZ2V0TW9kdWxlQnlVcmwodXJsKVxuICAgICAgICBjb25zdCBpbXBvcnRlZE1vZHVsZXMgPSB1cmxNb2R1bGU/LmltcG9ydGVkTW9kdWxlc1xuXG4gICAgICAgIGlmIChpbXBvcnRlZE1vZHVsZXMpIHtcbiAgICAgICAgICBmb3IgKGNvbnN0IG1vZCBvZiBpbXBvcnRlZE1vZHVsZXMpIHtcbiAgICAgICAgICAgIGNvZGUgPSBjb2RlLnJlcGxhY2UobW9kLnVybCwgbm9ybWFsaXplVml0ZVVybChpc1dpblxuICAgICAgICAgICAgICA/IG1vZC51cmwucmVwbGFjZSgvW0EtWl06XFwvLywgJycpLnJlcGxhY2UoLzovLCAnLicpXG4gICAgICAgICAgICAgIDogbW9kLnVybCxcbiAgICAgICAgICAgIG1vZC50eXBlKSkgLy8gZml4IGludmFsaWQgY29sb24gaW4gL0Bmcy9DOiwgL0BpZC9wbHVnaW4tdnVlOmV4cG9ydC1oZWxwZXJcbiAgICAgICAgICAgIHdyaXRlVG9EaXNrKG1vZC51cmwpXG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHVybE1vZHVsZT8udXJsKSB7XG4gICAgICAgICAgY29kZSA9IGNvZGVcbiAgICAgICAgICAgIC5yZXBsYWNlKC9cXC9Adml0ZVxcL2NsaWVudC9nLCAnL2Rpc3QvbXYzY2xpZW50Lm1qcycpXG4gICAgICAgICAgICAucmVwbGFjZSgvXFwvQGlkXFwvL2csICcvJylcbiAgICAgICAgICAgIC5yZXBsYWNlKC9fX3Vuby5jc3MvZywgJ35+dW5vLmNzcycpXG4gICAgICAgICAgICAucmVwbGFjZSgvX194MDBfX3BsdWdpbi12dWU6ZXhwb3J0LWhlbHBlci9nLCAnfn54MDBfX3BsdWdpbi12dWU6ZXhwb3J0LWhlbHBlci5qcycpXG4gICAgICAgICAgICAucmVwbGFjZSgvKFxcL1xcLnZpdGVcXC9kZXBzXFwvXFxTKz8pXFw/dj1cXHcrL2csICckMScpXG4gICAgICAgICAgaWYgKGlzV2luKSB7XG4gICAgICAgICAgICBjb2RlID0gY29kZVxuICAgICAgICAgICAgICAucmVwbGFjZSgvKGZyb21cXHMrW1wiJ11cXC9AZnNcXC8pW0EtWl06XFwvL2csICckMScpXG4gICAgICAgICAgfVxuXG4gICAgICAgICAgY29uc3QgdGFyZ2V0RmlsZSA9IG5vcm1hbGl6ZUZzVXJsKGlzV2luXG4gICAgICAgICAgICA/IHVybE1vZHVsZS51cmwucmVwbGFjZSgvW0EtWl06XFwvLywgJycpLnJlcGxhY2UoLzovLCAnLicpXG4gICAgICAgICAgICA6IHVybE1vZHVsZS51cmwsXG4gICAgICAgICAgdXJsTW9kdWxlLnR5cGUpIC8vIGZpeCBpbnZhbGlkIGNvbG9uIGluIC9AZnMvQzosIC9AaWQvcGx1Z2luLXZ1ZTpleHBvcnQtaGVscGVyXG4gICAgICAgICAgYXdhaXQgZnMuZW5zdXJlRGlyKGRpcm5hbWUodGFyZ2V0RmlsZSkpXG4gICAgICAgICAgYXdhaXQgZnMud3JpdGVGaWxlKHRhcmdldEZpbGUsIGNvZGUpXG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgT2JqZWN0LmtleXMoc2VydmVyLmNvbmZpZy5idWlsZC5yb2xsdXBPcHRpb25zLmlucHV0ISkubWFwKGVudHJ5ID0+IHdyaXRlVG9EaXNrKGAvJHtlbnRyeX0vbWFpbi50c2ApKVxuICAgIH0sXG4gIH1cbn1cblxuZnVuY3Rpb24gbm9ybWFsaXplVml0ZVVybCh1cmw6IHN0cmluZywgdHlwZTogc3RyaW5nKSB7XG4gIHVybCA9IHVybC5yZXBsYWNlKC9cXD92PVxcdyskLywgJycpXG5cbiAgaWYgKHR5cGUgPT09ICdqcycgJiYgIXVybC5lbmRzV2l0aCgnLmpzJykgJiYgIXVybC5lbmRzV2l0aCgnLm1qcycpKVxuICAgIHVybCA9IGAke3VybH0uanNgLnJlcGxhY2UoL3Z1ZVxcPy8sICd2dWUuanNfJylcblxuICByZXR1cm4gdXJsXG59XG5cbmZ1bmN0aW9uIG5vcm1hbGl6ZUZzVXJsKHVybDogc3RyaW5nLCB0eXBlOiBzdHJpbmcpIHtcbiAgcmV0dXJuIGpvaW4oXG4gICAgdGFyZ2V0RGlyLFxuICAgIG5vcm1hbGl6ZVZpdGVVcmwodXJsLCB0eXBlKVxuICAgICAgLnJlcGxhY2UoL15cXC8vLCAnJylcbiAgICAgIC8vIGBcXDBwbHVnaW4tdnVlOmV4cG9ydC1oZWxwZXJgIEVYUE9SVF9IRUxQRVJfSURcbiAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1jb250cm9sLXJlZ2V4XG4gICAgICAucmVwbGFjZSgvXFx1MDAwMC9nLCAnX194MDBfXycpXG4gICAgICAvLyBmaWxlbmFtZXMgc3RhcnRpbmcgd2l0aCBcIl9cIiBhcmUgcmVzZXJ2ZWQgZm9yIHVzZSBieSB0aGUgc3lzdGVtLlxuICAgICAgLnJlcGxhY2UoL15fKy8sIG1hdGNoID0+ICd+Jy5yZXBlYXQobWF0Y2gubGVuZ3RoKSksXG4gIClcbn1cbiJdLAogICJtYXBwaW5ncyI6ICI7QUFFQSxTQUFTLFdBQUFBLFVBQVMsZ0JBQWdCO0FBRWxDLFNBQVMsb0JBQW9CO0FBQzdCLE9BQU8sU0FBUztBQUNoQixPQUFPLGFBQWE7QUFDcEIsT0FBTyxXQUFXO0FBQ2xCLE9BQU8sbUJBQW1CO0FBQzFCLE9BQU8sZ0JBQWdCO0FBQ3ZCLE9BQU8sZ0JBQWdCO0FBQ3ZCLE9BQU8sWUFBWTtBQUNuQixTQUFTLDJCQUEyQjs7O0FDWnFVLFNBQVMsZUFBZTtBQUNqWSxTQUFTLFFBQVEsYUFBYTtBQUQ5QixJQUFNLG1DQUFtQztBQUdsQyxJQUFNLE9BQU8sU0FBUyxRQUFRLElBQUksUUFBUSxFQUFFLEtBQUs7QUFDakQsSUFBTSxJQUFJLElBQUksU0FBbUIsUUFBUSxrQ0FBVyxNQUFNLEdBQUcsSUFBSTtBQUNqRSxJQUFNLFFBQVEsUUFBUSxJQUFJLGFBQWE7QUFDdkMsSUFBTSxRQUFRLFFBQVEsYUFBYTs7O0FDTnFULFNBQVMsU0FBUyxZQUFZO0FBRTdYLE9BQU8sUUFBUTtBQUdmLElBQU0sWUFBWSxFQUFFLFdBQVc7QUFFeEIsSUFBTSxTQUFTLE1BQW9CO0FBQ3hDLFNBQU87QUFBQSxJQUNMLE1BQU07QUFBQSxJQUNOLE9BQU87QUFBQSxJQUNQLFNBQVM7QUFBQSxJQUNULE1BQU0sZ0JBQWdCLFFBQVE7QUFDNUIsWUFBTSxlQUE4QyxPQUFPLEdBQUc7QUFFOUQsYUFBTyxHQUFHLE9BQU8sZUFBZ0IsU0FBcUI7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
