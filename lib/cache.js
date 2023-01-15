import Redis from 'ioredis'
import md5 from 'crypto-js/md5'

let cacheBuilder

function createCache() {
  if (process.env.REDIS_HOST) {
    return new Redis({
      host: process.env.REDIS_HOST,
    })
  }
}

function cacheInstance() {
  const _cacheBuilder = cacheBuilder ?? createCache()

  return _cacheBuilder
}

export function safeKey(key) {
  let safe = key
  // Using the text protocol, a key can't be empty, can't be longer than 250 characters,
  // and can't contain space, newline, return, tab, vertical tab or form feed. Everything else is fine.
  // we are checking for 240 because HTTPCache adds 10 characters to its key
  safe = safe.replace(/[ \n\r\t\v\f]+/g, '_')
  if (safe.length > 240) {
    safe = md5(safe)
  }
  return safe
}

export function cacheSet({ key, value, expire = 60 }) {
  cacheBuilder = cacheInstance()
  if (cacheBuilder && key && Number.isInteger(expire)) {
    try {
      cacheBuilder.set(key, JSON.stringify(value), 'ex', expire)
    } catch (error) {
      //
    }
  }
}

export async function cacheGet(key) {
  cacheBuilder = cacheInstance()
  if (cacheBuilder) {
    try {
      const result = await cacheBuilder.get(key)
      return JSON.parse(result)
    } catch (error) {
      //
    }
  }
}
