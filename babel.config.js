module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],
    plugins: [
      // 👇 aquí puedes añadir otros plugins si usas
      // por ejemplo: ["module-resolver", { alias: { "@": "./src" } }],

      "react-native-reanimated/plugin", // ⚡ SIEMPRE al final
    ],
  };
};
