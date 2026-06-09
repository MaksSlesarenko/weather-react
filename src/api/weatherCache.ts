import {CACHE_DURATION_S} from "../app/constants.ts";

const STORAGE_PREFIX = 'owm_cache:'

interface CacheEntry<T> {
  data: T
  ts: number
}

function key(args: unknown): string {
  return STORAGE_PREFIX + JSON.stringify(args)
}

export function getCachedRaw<T>(args: unknown): T | null {
  try {
    const raw = localStorage.getItem(key(args))
    if (!raw) return null
    const entry = JSON.parse(raw) as CacheEntry<T>
    const ageSeconds = (Date.now() - entry.ts) / 1000
    if (ageSeconds >= CACHE_DURATION_S) {
      localStorage.removeItem(key(args))
      return null
    }
    return entry.data
  } catch {
    return null
  }
}

export function setCachedRaw<T>(args: unknown, data: T): void {
  try {
    const entry: CacheEntry<T> = { data, ts: Date.now() }
    localStorage.setItem(key(args), JSON.stringify(entry))
  } catch {
    // storage full or unavailable — silent fail
  }
}

export function getCached<T>(args: unknown): T | null {
  if (__MOCK_MODE__) return null
  return getCachedRaw<T>(args)
}

export function setCached<T>(args: unknown, data: T): void {
  if (__MOCK_MODE__) return
  setCachedRaw(args, data)
}
