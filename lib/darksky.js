async function getForecast({ latitude, longitude }) {
  const url = `https://api.darksky.net/forecast/${process.env.DARKSKY_SECRET_KEY}/${latitude},${longitude}`
  const apiResponse = await fetch(url)
  return apiResponse.json()
}

module.exports = { getForecast }
