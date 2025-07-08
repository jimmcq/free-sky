export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    // Server configuration
    const Sentry = await import('@sentry/nextjs')
    const SENTRY_DSN = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN

    Sentry.init({
      dsn: SENTRY_DSN,
      // Adjust this value in production, or use tracesSampler for greater control
      tracesSampleRate: 1.0,
      // Note: if you want to override the automatic release value, do not set a
      // `release` value here - use the environment variable `SENTRY_RELEASE`, so
      // that it will also get attached to your source maps
    })
  }

  if (process.env.NEXT_RUNTIME === 'edge') {
    // Edge configuration
    const Sentry = await import('@sentry/nextjs')
    const SENTRY_DSN = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN

    Sentry.init({
      dsn: SENTRY_DSN,
      // Adjust this value in production, or use tracesSampler for greater control
      tracesSampleRate: 1.0,
      // Note: if you want to override the automatic release value, do not set a
      // `release` value here - use the environment variable `SENTRY_RELEASE`, so
      // that it will also get attached to your source maps
    })
  }
}