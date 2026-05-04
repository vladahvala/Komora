const { withProjectBuildGradle } = require("expo/config-plugins");

module.exports = function withNotifeeMaven(config) {
  return withProjectBuildGradle(config, (config) => {
    if (config.modResults.language !== "groovy") {
      return config;
    }

    let contents = config.modResults.contents;

    const notifeeRepo = `maven { url "$rootDir/../node_modules/@notifee/react-native/android/libs" }`;

    if (contents.includes("@notifee/react-native/android/libs")) {
      return config;
    }

    contents = contents.replace(
      /allprojects\s*\{\s*repositories\s*\{/,
      (match) => `${match}\n    ${notifeeRepo}`
    );

    config.modResults.contents = contents;
    return config;
  });
};