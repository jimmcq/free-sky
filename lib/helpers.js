function translateIcon({ icon, summary }) {
  const lowerSummary = summary.toLowerCase()
  // If you find a summary match for these, use it
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
    return 'mostlycloudy'
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

module.exports = { translateIcon }
