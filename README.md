
# Free Sky Weather App

A modern weather application built with Next.js and React, providing accurate weather forecasts using Apple's WeatherKit API. Free Sky serves as a replacement for the discontinued Dark Sky weather service.

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
- Redis instance (optional - for caching, see development options below)

## Environment Variables

Create a `.env.local` file in the root directory:

```env
# Apple WeatherKit Configuration
APPLETEAMID=your_apple_team_id
APPLEKEYID=your_apple_key_id

# Option 1: Provide key content directly (recommended for production)
APPLE_WEATHERKIT_KEY="-----BEGIN PRIVATE KEY-----\nYourKeyContentHere\n-----END PRIVATE KEY-----"

# Option 2: Provide path to .p8 key file (for development)
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

**Option A: Basic development (no caching)**
```bash
yarn dev
```

**Option B: With Redis for caching**
```bash
# Requires Redis installed locally
yarn dev:with-redis

# Or use the smart script that auto-detects Redis
yarn dev:smart

# Or use Docker Compose (recommended)
yarn dev:docker
```

## Redis Setup Options

The application works without Redis but benefits from caching for better performance:

### Option 1: No Redis (Default)
Simply run `yarn dev` - the app will work without caching.

### Option 2: Local Redis Installation
```bash
# macOS with Homebrew
brew install redis
brew services start redis

# Ubuntu/Debian
sudo apt install redis-server
sudo systemctl start redis-server

# Then use: yarn dev:with-redis or yarn dev:smart
```

### Option 3: Docker Redis (Recommended)
```bash
# Just run this - Redis will be automatically started
yarn dev:docker
```

## Available Scripts

### Development
- `yarn dev` - Start development server (no caching)
- `yarn dev:with-redis` - Start with Redis caching (concurrent)
- `yarn dev:smart` - Intelligent start with Redis auto-detection
- `yarn dev:docker` - Start with Docker Compose (Redis included)
- `yarn dev:docker:down` - Stop Docker Compose services

### Production
- `yarn build` - Build production application
- `yarn start` - Start production server

### Code Quality
- `yarn test` - Run test suite
- `yarn eslint` - Run ESLint code analysis
- `yarn prettier` - Check code formatting
- `yarn prettier:fix` - Fix code formatting

## API Documentation

### Get Weather Forecast
**Endpoint**: `GET /api/forecast?latitude={lat}&longitude={lon}`

**Parameters**:
- `latitude` (required): Latitude coordinate (-90 to 90)
- `longitude` (required): Longitude coordinate (-180 to 180)

**Response**: Comprehensive weather data including current conditions, hourly forecasts, daily forecasts, and alerts.

**Example**:
```bash
curl "https://free-sky.net/api/forecast?latitude=37.7749&longitude=-122.4194"
```

### Search Locations
**Endpoint**: `GET /api/searchplace?place={query}`

**Parameters**:
- `place` (required): Location search query (city name, address, etc.)

**Response**: Array of matching locations with coordinates and place names.

**Example**:
```bash
curl "https://free-sky.net/api/searchplace?place=San%20Francisco"
```

### Get Place Name
**Endpoint**: `GET /api/getplacename?latitude={lat}&longitude={lon}`

**Parameters**:
- `latitude` (required): Latitude coordinate
- `longitude` (required): Longitude coordinate

**Response**: Human-readable place name for the given coordinates.

**Example**:
```bash
curl "https://free-sky.net/api/getplacename?latitude=37.7749&longitude=-122.4194"
```

## Development

The application uses:
- **Next.js 15** for the React framework
- **React** for the user interface
- **TypeScript** for type safety
- **Apple WeatherKit** for weather data
- **MapBox** for location services
- **Redis** for caching
- **Sentry** for error tracking

## Troubleshooting

### Common Issues

**"Weather data not loading"**
- Verify your Apple WeatherKit API credentials are correct
- Check that your Apple Developer account has WeatherKit enabled
- Ensure the `.p8` key file path is correct in your environment variables

**"Location search not working"**
- Verify your MapBox access token is valid
- Check that MapBox Geocoding API is enabled for your account

**"Redis connection errors"**
- For development: Use `yarn dev` instead of `yarn dev:with-redis`
- For Docker: Try `yarn dev:docker:down` followed by `yarn dev:docker`
- For local Redis: Ensure Redis server is running (`redis-server`)

**"Build errors"**
- Clear Next.js cache: `rm -rf .next`
- Clear node_modules: `rm -rf node_modules && yarn install`
- Check that all environment variables are properly set

**"TypeScript errors"**
- Run `yarn build` to see detailed TypeScript errors
- Check that all dependencies are properly installed
- Ensure your Node.js version is 18+ (`node --version`)

### Debug Mode

To enable debug logging, add to your `.env.local`:
```env
DEBUG=true
NODE_ENV=development
```

### Performance Issues

- Enable Redis caching for better performance
- Check network requests in browser dev tools
- Monitor bundle size with `yarn build`

## Screenshots

### Desktop View
![Desktop Weather View](docs/images/desktop-weather.png)

### Location Search
![Location Search](docs/images/location-search.png)


## Deployment

The application can be deployed to any platform supporting Next.js:

### Vercel (Recommended)
```bash
vercel --prod
```

Make sure to set all environment variables in your Vercel dashboard.

### Docker
```bash
docker build -t free-sky .
docker run -p 3000:3000 free-sky
```

### Other Platforms
- **Netlify**: Configure build command as `yarn build` and publish directory as `.next`
- **Railway**: Connect your GitHub repository and set environment variables
- **Heroku**: Add Node.js buildpack and configure environment variables

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
