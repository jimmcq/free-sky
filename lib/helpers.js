function translateIcon({ icon, summary }) {
  // If you find a summary match for these, use it
  switch (summary) {
    case 'Possible Drizzle':
    case 'Possible Light Rain':
    case 'Possible Heavy Rain':
      return 'chancerain'
    case 'Possible Flurries':
      return 'chanceflurries'
    case 'Possible Sleet':
      return 'chancesleet'
    case 'Possible Snow':
    case 'Possible Light Snow':
    case 'Possible Heavy Snow':
      return 'chancesnow'
    case 'Possible Thunderstorms':
      return 'chancetstorms'
    case 'Flurries':
      return 'flurries'
    case 'Hazy':
      return 'hazy'
    case 'Sleet':
      return 'sleet'
    case 'Thunderstorms':
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
