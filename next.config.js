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

    // Environment-specific configurations
    env: {
        VERCEL_ENV: process.env.VERCEL_ENV || 'development',
    },

    // Security headers
    async headers() {
        return [
            {
                // Apply security headers to all routes
                source: '/(.*)',
                headers: [
                    // Prevent clickjacking attacks
                    {
                        key: 'X-Frame-Options',
                        value: 'DENY',
                    },
                    // Prevent MIME type sniffing
                    {
                        key: 'X-Content-Type-Options',
                        value: 'nosniff',
                    },
                    // Control referrer information
                    {
                        key: 'Referrer-Policy',
                        value: 'strict-origin-when-cross-origin',
                    },
                    // Enforce HTTPS (only in production)
                    {
                        key: 'Strict-Transport-Security',
                        value: 'max-age=31536000; includeSubDomains; preload',
                    },
                    // Legacy XSS protection (for older browsers)
                    {
                        key: 'X-XSS-Protection',
                        value: '1; mode=block',
                    },
                    // Restrict browser features
                    {
                        key: 'Permissions-Policy',
                        value: 'camera=(), microphone=(), geolocation=(self), interest-cohort=()',
                    },
                    // Content Security Policy
                    {
                        key: 'Content-Security-Policy',
                        value: [
                            "default-src 'self'",
                            "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://browser.sentry-cdn.com",
                            "style-src 'self' 'unsafe-inline'",
                            "img-src 'self' data: https:",
                            "font-src 'self' data:",
                            "connect-src 'self' https://api.mapbox.com https://*.sentry.io https://*.ingest.sentry.io",
                            "frame-ancestors 'none'",
                            "base-uri 'self'",
                            "form-action 'self'",
                            "object-src 'none'",
                            "upgrade-insecure-requests",
                        ].join('; '),
                    },
                ],
            },
        ]
    },
}

module.exports = withSentryConfig(nextConfig, { 
    silent: true,
    sourcemaps: {
        deleteSourcemapsAfterUpload: true
    }
}, { 
    hideSourcemaps: true
})
