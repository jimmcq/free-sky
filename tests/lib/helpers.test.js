import { bearingToCardinal, normalizeCoordinates } from '../../lib/helpers'

describe('bearingToCardinal', () => {
  it('should return "N" for 0 and 360 degrees', () => {
    expect.assertions(2)
    expect(bearingToCardinal(0)).toBe('N')
    expect(bearingToCardinal(360)).toBe('N')
  })
  it('should return "NE" for 45 degrees', () => {
    expect.assertions(1)
    expect(bearingToCardinal(45)).toBe('NE')
  })
  it('should return "E" for 90 degrees', () => {
    expect.assertions(1)
    expect(bearingToCardinal(90)).toBe('E')
  })
  it('should return "SE" for 135 degrees', () => {
    expect.assertions(1)
    expect(bearingToCardinal(135)).toBe('SE')
  })
  it('should return "S" for 180 degrees', () => {
    expect.assertions(1)
    expect(bearingToCardinal(180)).toBe('S')
  })
  it('should return "SW" for 225 degrees', () => {
    expect.assertions(1)
    expect(bearingToCardinal(225)).toBe('SW')
  })
  it('should return "W" for 270 degrees', () => {
    expect.assertions(1)
    expect(bearingToCardinal(270)).toBe('W')
  })
  it('should return "NW" for 315 degrees', () => {
    expect.assertions(1)
    expect(bearingToCardinal(315)).toBe('NW')
  })
})

describe('normalizeCoordinates', () => {
  it('should return the same coordinates extended to 4 decimals for valid coordinates', () => {
    expect.assertions(1)
    expect(normalizeCoordinates({ latitude: 0, longitude: 0 })).toEqual({
      latitude: '0.0000',
      longitude: '0.0000',
    })
  })
  it('should return the same coordinates shortened to 4 decimals for valid coordinates', () => {
    expect.assertions(1)
    expect(normalizeCoordinates({ latitude: 0.123456789, longitude: 0.123456789 })).toEqual({
      latitude: '0.1235',
      longitude: '0.1235',
    })
  })
  it('should throw an error for invalid coordinates', () => {
    expect.assertions(1)
    expect(() => normalizeCoordinates({ latitude: 0, longitude: 200 })).toThrow('Invalid location coordinates')
  })
})
