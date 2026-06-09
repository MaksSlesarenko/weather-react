function envInt(key: string, fallback: number): number {
  const v = Number(import.meta.env[key])
  return Number.isFinite(v) && v > 0 ? v : fallback
}

export const MAX_HISTORY_ITEMS = envInt('VITE_MAX_HISTORY_ITEMS', 10)
export const CACHE_DURATION_S = envInt('VITE_CACHE_DURATION_S', 300)
export const SNACKBAR_DURATION_MS = envInt('VITE_SNACKBAR_DURATION_MS', 5000)
export const OWM_BASE_URL =
  import.meta.env.VITE_OWM_BASE_URL || 'https://api.openweathermap.org/data/2.5'
