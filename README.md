
# Free Sky Weather App

A modern weather application built with Next.js and React Native Web, providing accurate weather forecasts using Apple's WeatherKit API. Free Sky serves as a replacement for the discontinued Dark Sky weather service.

## Features

- **Real-time Weather Data**: Current conditions, hourly forecasts, and 7-day outlook
- **Location-based Forecasts**: Automatic location detection or manual location search
- **Interactive Weather Icons**: Animated weather condition icons
- **Mobile-First Design**: Responsive interface optimized for all devices
- **Weather Alerts**: Display of active weather warnings and alerts
- **Offline Storage**: Saves recently viewed locations for quick access

## Prerequisites

- Node.js 18+ and Yarn
- Apple Developer Account (for WeatherKit API access)
- MapBox API key (for location services)
- Redis instance (for caching)

## Environment Variables

Create a `.env.local` file in the root directory:

```env
# Apple WeatherKit Configuration
APPLETEAMID=your_apple_team_id
APPLEKEYID=your_apple_key_id
APPLE_WEATHERKIT_KEY_PATH=path_to_your_p8_key_file

# MapBox Configuration
MAPBOX_ACCESS_TOKEN=your_mapbox_access_token

# Redis Configuration (optional - for caching)
REDIS_URL=redis://localhost:6379

# Sentry Configuration (optional - for error tracking)
SENTRY_DSN=your_sentry_dsn
```

## Installation

1. Clone the repository:
```bash
git clone https://github.com/jimmcq/free-sky.git
cd free-sky
```

2. Install dependencies:
```bash
yarn install
```

3. Configure environment variables (see above)

4. Start the development server:
```bash
yarn dev
```

## Available Scripts

- `yarn dev` - Start development server
- `yarn build` - Build production application
- `yarn start` - Start production server
- `yarn test` - Run test suite
- `yarn eslint` - Run ESLint code analysis
- `yarn prettier` - Check code formatting

## API Endpoints

### Get Weather Forecast
```
GET /api/forecast?latitude={lat}&longitude={lon}
```

### Search Locations
```
GET /api/searchplace?place={query}
```

### Get Place Name
```
GET /api/getplacename?latitude={lat}&longitude={lon}
```

## Development

The application uses:
- **Next.js 15** for the React framework
- **React Native Web** for cross-platform components
- **TypeScript** for type safety
- **Apple WeatherKit** for weather data
- **MapBox** for location services
- **Redis** for caching
- **Sentry** for error tracking

## Deployment

The application can be deployed to any platform supporting Next.js:

### Vercel (Recommended)
```bash
vercel --prod
```

### Docker
```bash
docker build -t free-sky .
docker run -p 3000:3000 free-sky
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## Author

**Jim McQuillan**
- GitHub: [https://github.com/jimmcq](https://github.com/jimmcq)
- LinkedIn: [https://www.linkedin.com/in/jimmcquillan/](https://www.linkedin.com/in/jimmcquillan/)

## License

This project is licensed under the terms specified in the package.json file.

## Acknowledgments

- Apple WeatherKit for weather data
- MapBox for location services
- The Dark Sky API (discontinued) for inspiration
