import Head from 'next/head'
import { ErrorBoundary } from 'react-error-boundary'
import FallbackComponent from '../components/FallbackComponent'
import PageMetadata from '../components/pageMetadata'

function FreeSky({ Component, pageProps }) {
  const { pageMetadata } = pageProps
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <PageMetadata {...pageMetadata} />
      <ErrorBoundary FallbackComponent={FallbackComponent}>
        <Component {...pageProps} />
      </ErrorBoundary>
    </>
  )
}
export default FreeSky
