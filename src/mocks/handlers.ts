import { http, HttpResponse } from 'msw'
import { OWM_BASE_URL } from '../app/constants'
import { generateWeather } from './generateWeather'

export const handlers = [
  http.get(`${OWM_BASE_URL}/weather`, ({ request }) => {
    const url = new URL(request.url)
    const city = (url.searchParams.get('q') ?? '').trim()

    if (!city) {
      return HttpResponse.json(
        { cod: '404', message: 'city not found' },
        { status: 404 },
      )
    }

    return HttpResponse.json(generateWeather(city))
  }),
]
