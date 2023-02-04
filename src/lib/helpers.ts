function bearingToCardinal(bearing: number) {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']
  const index = Math.floor((bearing + 22.5) / 45)
  return directions[index % 8]
}

function normalizeCoordinates({ latitude, longitude }: { latitude: string; longitude: string }) {
  const floatLatitude: number = parseFloat(latitude)
  const floatLongitude: number = parseFloat(longitude)

  if (
    isNaN(floatLatitude) ||
    isNaN(floatLongitude) ||
    floatLatitude < -90 ||
    floatLatitude > 90 ||
    floatLongitude < -180 ||
    floatLongitude > 180
  ) {
    throw new Error('Invalid location coordinates')
  }

  const normalizedLatitude: string = floatLatitude.toFixed(4)
  const normalizedLongitude: string = floatLongitude.toFixed(4)

  return { latitude: normalizedLatitude, longitude: normalizedLongitude }
}

export { bearingToCardinal, normalizeCoordinates }
