import PageMetadata from '../components/pageMetadata'

function FreeSky({ Component, pageProps }) {
  const { pageMetadata } = pageProps
  return (
    <>
      <PageMetadata {...pageMetadata} />
      <Component {...pageProps} />
    </>
  )
}
export default FreeSky
