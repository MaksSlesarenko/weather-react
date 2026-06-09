import type { GetCurrentWeatherApiResponse } from '../api/weatherApi'

const CONDITION_CODES = [800, 801, 500, 501, 300, 200, 600, 701, 741] as const

const CONDITION_META: Record<number, { description: string; icon: string }> = {
  800: { description: 'clear sky', icon: '01d' },
  801: { description: 'few clouds', icon: '02d' },
  500: { description: 'light rain', icon: '10d' },
  501: { description: 'moderate rain', icon: '10d' },
  300: { description: 'light drizzle', icon: '09d' },
  200: { description: 'thunderstorm with light rain', icon: '11d' },
  600: { description: 'light snow', icon: '13d' },
  701: { description: 'mist', icon: '50d' },
  741: { description: 'fog', icon: '50d' },
}

function hashString(str: string): number {
  let h = 0
  for (let i = 0; i < str.length; i++) {
    h = (Math.imul(31, h) + str.charCodeAt(i)) | 0
  }
  return h >>> 0
}

function seededRandom(seed: number): () => number {
  let s = seed === 0 ? 1 : seed
  return () => {
    s ^= s << 13
    s ^= s >> 17
    s ^= s << 5
    return (s >>> 0) / 4294967296
  }
}

export function generateWeather(
  city: string,
  seed?: number,
): GetCurrentWeatherApiResponse {
  const effectiveSeed =
    seed ?? (hashString(city) ^ (Math.floor(Date.now() / 60_000) & 0xffff))
  const rand = seededRandom(effectiveSeed)

  const temp = Math.round(-20 + rand() * 65)
  const variance = Math.round(rand() * 8) + 2
  const tempMin = temp - variance
  const tempMax = temp + variance
  const windSpeed = Math.round(rand() * 340) / 10
  const conditionCode =
    CONDITION_CODES[Math.floor(rand() * CONDITION_CODES.length)]
  const condition = CONDITION_META[conditionCode]
  const [cityPart, countryPart] = city.split(',')
  const name = cityPart.charAt(0).toUpperCase() + cityPart.slice(1)
  const country = (countryPart ?? '').toUpperCase()

  return {
    coord: { lon: 0, lat: 0 },
    weather: [
      {
        id: conditionCode,
        main: condition.description
          .split(' ')
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(' '),
        description: condition.description,
        icon: condition.icon,
      },
    ],
    main: {
      temp,
      feels_like: temp - 2,
      temp_min: tempMin,
      temp_max: tempMax,
      pressure: 1013,
      humidity: Math.floor(30 + rand() * 60),
    },
    wind: { speed: windSpeed, deg: Math.floor(rand() * 360) },
    name,
    sys: { country, sunrise: 0, sunset: 0 },
    cod: 200,
  }
}
