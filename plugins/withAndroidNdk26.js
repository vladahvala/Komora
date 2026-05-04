const {
  withGradleProperties,
  withProjectBuildGradle,
  withAppBuildGradle,
} = require("expo/config-plugins");

const NDK_VERSION = "26.2.11394342";

function upsertProperty(properties, key, value) {
  const existing = properties.find(
    (item) => item.type === "property" && item.key === key
  );

  if (existing) {
    existing.value = value;
  } else {
    properties.push({
      type: "property",
      key,
      value,
    });
  }
}

module.exports = function withAndroidNdk26(config) {
  // Adds android.ndkVersion=26.1.10909125 to android/gradle.properties
  config = withGradleProperties(config, (config) => {
    upsertProperty(
      config.modResults,
      "android.ndkVersion",
      NDK_VERSION
    );

    return config;
  });

  // Adds rootProject.ext.ndkVersion override to android/build.gradle
  config = withProjectBuildGradle(config, (config) => {
    if (config.modResults.language !== "groovy") {
      return config;
    }

    let contents = config.modResults.contents;
    const line = `rootProject.ext.ndkVersion = "${NDK_VERSION}"`;

    if (!contents.includes(line)) {
      contents = contents + `\n\n${line}\n`;
    }

    config.modResults.contents = contents;
    return config;
  });

  // Forces app/build.gradle to use literal NDK version
  config = withAppBuildGradle(config, (config) => {
    if (config.modResults.language !== "groovy") {
      return config;
    }

    let contents = config.modResults.contents;

    contents = contents.split("ndkVersion rootProject.ext.ndkVersion").join(
      `ndkVersion "${NDK_VERSION}"`
    );

    config.modResults.contents = contents;
    return config;
  });

  return config;
};