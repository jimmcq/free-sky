function checkNightIcon({ icon, currentTime, sunriseTime, sunsetTime }) {
  if (icon.startsWith('nt_') || !currentTime) {
    // Do nothing
    return icon
  }

  if (currentTime < sunriseTime || currentTime > sunsetTime) {
    // It's night
    return `nt_${icon}`
  }

  // It's day
  return icon
}

function translateIcon({ icon, summary, currentTime, sunriseTime, sunsetTime }) {
  const lowerSummary = summary.toLowerCase()
  if (
    lowerSummary.startsWith('possible drizzle') ||
    lowerSummary.startsWith('possible light rain') ||
    lowerSummary.startsWith('possible heavy rain')
  ) {
    return 'chancerain'
  }

  if (
    lowerSummary.startsWith('possible snow') ||
    lowerSummary.startsWith('possible light snow') ||
    lowerSummary.startsWith('possible heavy snow')
  ) {
    return 'chancesnow'
  }

  if (lowerSummary.startsWith('possible flurries')) {
    return 'chanceflurries'
  }

  if (lowerSummary.startsWith('possible sleet')) {
    return 'chancesleet'
  }

  if (lowerSummary.startsWith('possible thunderstorm')) {
    return 'chancethunderstorms'
  }

  if (lowerSummary.startsWith('mostly cloudy')) {
    return checkNightIcon({ icon: 'mostlycloudy', currentTime, sunriseTime, sunsetTime })
  }

  if (lowerSummary.startsWith('flurries')) {
    return 'flurries'
  }

  if (lowerSummary.startsWith('hazy')) {
    return 'hazy'
  }

  if (lowerSummary.startsWith('sleet')) {
    return 'sleet'
  }

  if (lowerSummary.startsWith('thunderstorm')) {
    return 'thunderstorms'
  }

  // Fall back to icon match
  switch (icon) {
    case 'clear-day':
      return 'clear'
    case 'clear-night':
      return 'nt_clear'
    case 'rain':
    case 'light-rain':
    case 'heavy-rain':
      return 'rain'
    case 'snow':
    case 'light-snow':
    case 'heavy-snow':
      return 'snow'
    case 'sleet':
      return 'sleet'
    case 'wind': // The fog icon looks more like wind?
      return 'fog'
    case 'fog':
      return 'cloudy'
    case 'partly-sunny-day':
      return 'partlysunny'
    case 'partly-sunny-night':
      return 'nt_partlysunny'
    case 'partly-cloudy-day':
      return 'partlycloudy'
    case 'partly-cloudy-night':
      return 'nt_partlycloudy'
    case 'cloudy':
      return 'cloudy'
    case 'mostly-sunny-day':
      return 'mostlysunny'
    case 'mostly-sunny-night':
      return 'nt_mostlysunny'
    case 'mostly-cloudy-day':
      return 'mostylcloudy'
    case 'mostly-cloudy-night':
      return 'nt_mostylcloudy'
    case 'overcast':
      return 'cloudy'
  }

  return 'unknown'
}

function bearingToCardinal(bearing) {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']
  const index = Math.floor((bearing + 22.5) / 45)
  return directions[index % 8]
}

module.exports = { translateIcon, bearingToCardinal }
