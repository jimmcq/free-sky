import type { NextApiResponse } from 'next'

function setCacheControl({ res, maxAge = 120 }: { res: NextApiResponse<Response>; maxAge?: number }) {
  if (maxAge > 0) {
    res.setHeader('Cache-Control', `public, max-age=${maxAge}`)
  } else {
    res.setHeader('Cache-Control', 'private, no-cache, no-store, max-age=0, must-revalidate')
  }
}

export { setCacheControl }
