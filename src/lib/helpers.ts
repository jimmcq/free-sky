import { ColorSkyconsType } from 'react-color-skycons'

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

function normalizeIcon(icon: string): keyof typeof ColorSkyconsType {
  const iconType = icon
    .replace(/([^ ])([A-Z])/g, '$1 $2')
    .trim()
    .replace(/[- ]/g, '_')
    .toUpperCase() as keyof typeof ColorSkyconsType

  if (Object.keys(ColorSkyconsType).includes(iconType)) {
    return iconType
  }

  switch (icon.replace(/\s+/g, '')) {
    case 'Clear':
    case 'Clear,Sunny':
    case 'MostlyClear':
      return 'CLEAR_DAY'
    case 'PartlyCloudy':
    case 'MostlyCloudy':
      return 'PARTLY_CLOUDY_DAY'
    case 'Haze':
      return 'FOG'
    case 'Drizzle':
    case 'LightRain':
      return 'RAIN'
    case 'Flurries':
    case 'LightSnow':
    case 'HeavySnow':
      return 'SNOW'
    case 'Windy':
      return 'WIND'
    case 'Thunderstorms':
      return 'THUNDER'
    default:
      console.log(icon, iconType)
      return 'FOG'
  }
}

function normalizeSummary(summary: string): string {
  return summary.replace(/([^ ])([A-Z])/g, '$1 $2').trim()
}

function bearingToCardinal(bearing: number): string {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']
  const index = Math.floor((bearing + 22.5) / 45)
  return directions[index % 8]
}

function celsiusToFahrenheit(celsius: number): number {
  return celsius * 1.8 + 32
}

function kilometersToMiles(kilometers: number): number {
  return kilometers * 0.621371
}

function millimetersToInches(millimeters: number): number {
  return millimeters * 0.0393701
}

export {
  normalizeCoordinates,
  normalizeIcon,
  normalizeSummary,
  bearingToCardinal,
  celsiusToFahrenheit,
  kilometersToMiles,
  millimetersToInches,
}
