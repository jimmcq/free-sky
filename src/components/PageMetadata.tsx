import Head from 'next/head'

function PageMetadata({
    title = 'Free-Sky.Net - Weather',
    description = 'Current minute-by-minute weather forecast with hour, day, and week outlook',
    robots = 'noodp, noydir, max-image-preview:large',
}) {
    return (
        <Head>
            <title key="title">{title}</title>
            <meta key="description" name="description" content={description} />
            <meta key="robots" name="robots" content={robots} />
        </Head>
    )
}

export default PageMetadata
