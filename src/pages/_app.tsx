import { ErrorBoundary } from '@sentry/nextjs'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import FallbackComponent from '../components/FallbackComponent'
import PageMetadata from '../components/PageMetadata'

function FreeSky({ Component, pageProps }: AppProps) {
    const { pageMetadata } = pageProps
    return (
        <>
            <Head>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>
            <PageMetadata {...pageMetadata} />
            <ErrorBoundary fallback={FallbackComponent} showDialog>
                <Component {...pageProps} />
            </ErrorBoundary>
        </>
    )
}
export default FreeSky
