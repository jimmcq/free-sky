export type WeatherData = {
  time: number
  summary: string
  icon: string
  precipIntensity: number
  precipProbability: number
  precipType: string
  temperature: number
  temperatureLow: number
  temperatureHigh: number
  apparentTemperature: number
  windSpeed: number
  windBearing: number
}

export type WeatherInfo = {
  summary: string
  icon: string
  data: WeatherData[]
}

export type WeatherAlert = {
  title: string
  uri: string
}

export type WeatherResponse = {
  latitude: number
  longitude: number
  timezone: string
  currently: WeatherData
  minutely: WeatherInfo
  hourly: WeatherInfo
  daily: WeatherInfo
  alerts: WeatherAlert[]
}
