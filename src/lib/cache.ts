import { Redis } from 'ioredis'
import md5 from 'crypto-js/md5'

let cacheBuilder: Redis

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

export function safeKey(key: string) {
  let safe = key
  // Using the text protocol, a key can't be empty, can't be longer than 250 characters,
  // and can't contain space, newline, return, tab, vertical tab or form feed. Everything else is fine.
  // we are checking for 240 because HTTPCache adds 10 characters to its key
  safe = safe.replace(/[ \n\r\t\v\f]+/g, '_')
  if (safe.length > 240) {
    safe = md5(safe).toString()
  }
  return safe
}

/* eslint-disable-next-line  @typescript-eslint/no-explicit-any */
export function cacheSet({ key, value, expire = 60 }: { key: string; value: any; expire?: number }) {
  cacheBuilder = cacheInstance()
  if (cacheBuilder && key && Number.isInteger(expire)) {
    try {
      cacheBuilder.set(key, JSON.stringify(value), 'EX', expire)
    } catch (error) {
      //
    }
  }
}

export async function cacheGet(key: string) {
  cacheBuilder = cacheInstance()
  if (cacheBuilder) {
    try {
      const result = await cacheBuilder.get(key)
      return JSON.parse(result || '')
    } catch (error) {
      //
    }
  }
}
