function setCacheControl({ res, maxAge = 300 }) {
  if (maxAge > 0) {
    res.setHeader('Cache-Control', `public, max-age=${maxAge}`)
  } else {
    res.setHeader('Cache-Control', 'private, no-cache, no-store, max-age=0, must-revalidate')
  }
}

module.exports = setCacheControl
