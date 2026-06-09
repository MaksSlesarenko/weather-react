import { describe, it, expect, beforeEach, vi } from 'vitest'
import { getCachedRaw, setCachedRaw } from '../weatherCache'

const ARGS = { url: '/weather', params: { q: 'london,gb' } }

beforeEach(() => {
  localStorage.clear()
  vi.restoreAllMocks()
})

describe('weatherCache', () => {
  it('returns null when nothing cached', () => {
    expect(getCachedRaw(ARGS)).toBeNull()
  })

  it('stores and retrieves data', () => {
    const data = { temp: 20 }
    setCachedRaw(ARGS, data)
    expect(getCachedRaw(ARGS)).toEqual(data)
  })

  it('returns null and evicts entry past TTL', () => {
    setCachedRaw(ARGS, { temp: 20 })
    // advance time beyond CACHE_DURATION_S (300s default)
    vi.spyOn(Date, 'now').mockReturnValue(Date.now() + 301_000)
    expect(getCachedRaw(ARGS)).toBeNull()
    expect(localStorage.getItem('owm_cache:' + JSON.stringify(ARGS))).toBeNull()
  })

  it('returns data within TTL', () => {
    setCachedRaw(ARGS, { temp: 20 })
    vi.spyOn(Date, 'now').mockReturnValue(Date.now() + 100_000)
    expect(getCachedRaw(ARGS)).toEqual({ temp: 20 })
  })

  it('returns null on corrupted localStorage entry', () => {
    localStorage.setItem('owm_cache:' + JSON.stringify(ARGS), 'not-json')
    expect(getCachedRaw(ARGS)).toBeNull()
  })

  it('silently ignores localStorage write errors', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('QuotaExceededError')
    })
    expect(() => setCachedRaw(ARGS, { temp: 20 })).not.toThrow()
  })
})
