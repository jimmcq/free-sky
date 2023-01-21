import Head from 'next/head'
import PageMetadata from '../components/pageMetadata'

function FreeSky({ Component, pageProps }) {
  const { pageMetadata } = pageProps
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <PageMetadata {...pageMetadata} />
      <Component {...pageProps} />
    </>
  )
}
export default FreeSky
