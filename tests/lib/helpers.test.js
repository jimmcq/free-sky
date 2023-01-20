import { bearingToCardinal } from '../../lib/helpers'

describe('bearingToCardinal', () => {
  it('should return "N" for 0 degrees', () => {
    expect.assertions(2)
    expect(bearingToCardinal(0)).toBe('N')
    expect(bearingToCardinal(180)).toBe('S')
  })
})
