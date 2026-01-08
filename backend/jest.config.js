export default {
  testEnvironment: "node",
  setupFilesAfterEnv: ["./tests/setup.js"],
  transform: {
    "^.+\\.js$": "babel-jest"
  },
  transformIgnorePatterns: [
    "/node_modules/(?!(uuid)/)" // транспилируем модуль uuid
  ]
};