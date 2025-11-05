const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

// Add `.wasm` to asset extensions
config.resolver.assetExts.push("wasm");

// Export *after* all modifications
module.exports = withNativeWind(config, { input: "./global.css" });
