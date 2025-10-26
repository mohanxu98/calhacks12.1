const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add web support
config.resolver.platforms = ['ios', 'android', 'native', 'web'];

// Add web-specific extensions
config.resolver.sourceExts.push('web.js', 'web.ts', 'web.tsx');

// Web-specific configuration
config.transformer.minifierConfig = {
  keep_fnames: true,
  mangle: {
    keep_fnames: true,
  },
};

module.exports = config;