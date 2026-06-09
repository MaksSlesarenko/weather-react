import { describe, it, expect } from 'vitest'
import { generateWeather } from '../generateWeather'

describe('generateWeather', () => {
  it('returns a valid OWM-shaped response for a city', () => {
    const result = generateWeather('London', 42)
    expect(result.name).toBe('London')
    expect(result.cod).toBe(200)
    expect(result.weather).toHaveLength(1)
    expect(result.main.temp).toBeGreaterThanOrEqual(-20)
    expect(result.main.temp).toBeLessThanOrEqual(45)
    expect(result.main.temp_min).toBeLessThan(result.main.temp)
    expect(result.main.temp_max).toBeGreaterThan(result.main.temp)
    expect(result.wind.speed).toBeGreaterThanOrEqual(0)
    expect(result.wind.speed).toBeLessThanOrEqual(34)
  })

  it('produces deterministic output for the same seed', () => {
    const a = generateWeather('Paris', 100)
    const b = generateWeather('Paris', 100)
    expect(a.main.temp).toBe(b.main.temp)
    expect(a.weather[0].id).toBe(b.weather[0].id)
  })

  it('produces different output for different seeds', () => {
    const a = generateWeather('Berlin', 1)
    const b = generateWeather('Berlin', 2)
    const differs =
      a.main.temp !== b.main.temp || a.weather[0].id !== b.weather[0].id
    expect(differs).toBe(true)
  })

  it('capitalises the first letter of city name', () => {
    const result = generateWeather('tokyo', 42)
    expect(result.name).toBe('Tokyo')
  })

  it('weather condition id is one of the 9 known codes', () => {
    const VALID_CODES = [800, 801, 500, 501, 300, 200, 600, 701, 741]
    const result = generateWeather('Madrid', 99)
    expect(VALID_CODES).toContain(result.weather[0].id)
  })
})
