import md5 from 'crypto-js/md5'
import { safeKey } from '../../lib/cache'

describe('safeKey', () => {
  it('should return the same key if it is safe', () => {
    expect.assertions(1)
    expect(safeKey('foo')).toBe('foo')
  })
  it('should return a safe key if the key is not safe', () => {
    expect.assertions(1)
    expect(safeKey('foo bar')).toBe('foo_bar')
  })
  it('should return a safe key if the key is too long', () => {
    expect.assertions(1)
    const key = 'foobar'.repeat(41)
    expect(safeKey(key)).toEqual(md5(key).toString())
  })
  it('should translate line-feed, form-feed, return, tab, vertical-tab, and space to underscore', () => {
    const bad = 'A\nb\rC\vd\tE\fZ '
    const good = 'A_b_C_d_E_Z_'
    expect(safeKey(bad)).toEqual(good)
  })
})
