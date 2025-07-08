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

export async function onRequestError(
  err: unknown, 
  request: { url: string; method?: string; headers?: Record<string, string>; path?: string }, 
  context?: { routeKind?: string; routePath?: string; routeType?: string }
) {
  const Sentry = await import('@sentry/nextjs')
  // Create a proper RequestInfo object
  const requestInfo = {
    url: request.url,
    method: request.method || 'GET',
    headers: request.headers || {},
    path: request.path || new URL(request.url).pathname
  }
  // Create proper ErrorContext
  const errorContext = {
    routerKind: context?.routeKind || 'unknown',
    routePath: context?.routePath || request.path || new URL(request.url).pathname,
    routeType: context?.routeType || 'unknown'
  }
  Sentry.captureRequestError(err, requestInfo, errorContext)
}