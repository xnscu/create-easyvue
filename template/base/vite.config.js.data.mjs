export default function getData() {
  return {
    plugins: [
      {
        id: 'unplugin-vue-components',
        importer: `import Components from "unplugin-vue-components/vite";`,
        initializer: `// https://github.com/unplugin/unplugin-vue-components?tab=readme-ov-file#configuration
    Components({
      dirs: ["./components", "./src/components"],
      extensions: ["vue"],
      dts: "./src/unplugin/components.d.ts",
      directoryAsNamespace: true,
      collapseSamePrefixes: true,
      resolvers: [
        // AntDesignVueResolver({ resolveIcons: true }),
        // PrimeVueResolver()
      ],
    })`
      },
      {
        id: 'unplugin-vue-router',
        importer: `import VueRouter from "unplugin-vue-router/vite";\nimport { VueRouterAutoImports } from 'unplugin-vue-router'`,
        initializer: `// https://uvr.esm.is/guide/configuration.html
    // https://uvr.esm.is/introduction.html#from-scratch
    VueRouter({
      routesFolder: ["./src/views"],
      // allowed extensions to be considered as routes
      extensions: [".vue"],
      exclude: [],
      dts: "./src/unplugin/typed-router.d.ts",
      getRouteName: (arg: any) => arg.value.rawSegment,
      routeBlockLang: "json5",
      importMode: process.env.NODE_ENV === "production" ? "sync" : "async",
    })`
      },
      {
        id: 'unplugin-auto-import',
        importer: `import AutoImport from "unplugin-auto-import/vite"`,
        initializer: `// https://github.com/unplugin/unplugin-auto-import?tab=readme-ov-file#configuration
    AutoImport({
      defaultExportByFilename: true,
      eslintrc: {
        enabled: true, // Default false
        filepath: "./src/unplugin/.eslintrc-auto-import.json", // Default ./.eslintrc-auto-import.json
        globalsPropValue: true, // Default true, (true | false | 'readonly' | 'readable' | 'writable' | 'writeable')
      },
      imports: ["vue", VueRouterAutoImports, { "vue-router/auto": ["useLink"] }, "@vueuse/core"],
      dts: "./src/unplugin/auto-imports.d.ts",
      vueTemplate: true,
      include: [
        /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
        /\.vue$/,
        /\.vue\?vue/, // .vue
      ],
      dirs: [
        "./components", // only root modules
        "./composables", // only root modules
        "./globals",
        "./src/components", // only root modules
        "./src/composables", // only root modules
        "./src/globals",
      ],
    })`
      },
      {
        id: 'vue',
        importer: "import vue from '@vitejs/plugin-vue'",
        initializer: 'vue()'
      }
    ]
  }
}
