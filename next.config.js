// This file sets a custom webpack configuration to use your Next.js app
// with Sentry.
// https://nextjs.org/docs/api-reference/next.config.js/introduction
// https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/
const { withSentryConfig } = require('@sentry/nextjs')

const nextConfig = {
    experimental: {
        forceSwcTransforms: true,
    },
    webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
        // Important: return the modified config
        return config
    },
    reactStrictMode: true,
}

module.exports = withSentryConfig(nextConfig, { 
    silent: true,
    sourcemaps: {
        deleteSourcemapsAfterUpload: true
    }
}, { 
    hideSourcemaps: true
})
