export default {
  presets: [
    [
      "@babel/preset-env",
      {
        targets: {
          node: "current" // компилируем под текущую версию Node
        }
      }
    ]
  ]
};
