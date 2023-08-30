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

export const emptyData = {
    time: 0,
    summary: '',
    icon: '',
    precipIntensity: 0,
    precipProbability: 0,
    precipType: '',
    temperature: 0,
    temperatureLow: 0,
    temperatureHigh: 0,
    apparentTemperature: 0,
    windSpeed: 0,
    windBearing: 0,
}

export const emptyWeatherResponse: WeatherResponse = {
    latitude: 0,
    longitude: 0,
    timezone: '',
    currently: emptyData,
    minutely: { summary: '', icon: '', data: [emptyData] },
    hourly: { summary: '', icon: '', data: [emptyData, emptyData] },
    daily: { summary: '', icon: '', data: [emptyData] },
    alerts: [],
}

export type MapBoxPlace = {
    place_name: string
    center: [number, number]
}

export type Place = {
    placeName: string
    latitude: string
    longitude: string
}
