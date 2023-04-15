// This file sets a custom webpack configuration to use your Next.js app
// with Sentry.
// https://nextjs.org/docs/api-reference/next.config.js/introduction
// https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/
const { withSentryConfig } = require('@sentry/nextjs')

// @generated: @expo/next-adapter@2.1.52
// Learn more: https://docs.expo.io/guides/using-nextjs/

const { withExpo } = require('@expo/next-adapter')
const withPlugins = require('next-compose-plugins')

module.exports = withPlugins([withExpo], {
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Important: return the modified config
    return config
  },
  reactStrictMode: true,
  swcMinify: true,
  transpilePackages: [
    'react-native',
    'react-native-web',
    'expo',
    'expo-device',
    'expo-location',
    'expo-modules-core',
    // Add more React Native / Expo packages here...
  ],
})

module.exports = withSentryConfig(module.exports, { silent: true }, { hideSourcemaps: true })
