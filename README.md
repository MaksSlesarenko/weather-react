# Weather Forecast App

React 19 + TypeScript + MUI v9 + Redux Toolkit weather app with OpenWeatherMap API.

## Quick Start

```bash
npm install
npm run dev         # dev server with MSW mock API (no API key needed)
```

Open [http://localhost:5173](http://localhost:5173).

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Vite dev server (MSW active when no API key set) |
| `npm run build` | TypeScript check + production build |
| `npm run test` | Run all unit + integration tests |
| `npm run test:watch` | Vitest watch mode |
| `npm run test:coverage` | Coverage report (v8) |
| `npm run test:e2e` | Playwright end-to-end tests |
| `npm run lint` | ESLint |
| `npm run generate:weather-api` | Regenerate RTK Query client from `src/api/owm.yaml` |

## Using a Real API Key

1. Get a free key at [openweathermap.org](https://openweathermap.org/api)
2. Copy `.env.example` → `.env` and fill in your key:
   ```
   VITE_OWM_API_KEY=your_key_here
   ```
3. Restart `npm run dev` — MSW deactivates automatically

With `VITE_OWM_API_KEY=test`, the app uses Mock Service Worker to serve realistic seeded weather data for every city.

## Architecture

```
src/
├── api/           RTK Query generated client, base query, localStorage cache
├── app/           Redux store, typed hooks, MUI theme, constants
├── components/    Layout, Header, SearchBar (Autocomplete), ThemeToggle, Error Boundary
├── features/
│   ├── history/   redux-undo slice (CityEntry), HistoryPanel with Undo/Redo
│   ├── theme/     light/dark slice with localStorage persistence
│   └── weather/   WeatherCard (RTK Query)
├── mocks/         MSW handlers + seeded weather generator
└── test-utils/    renderWithProviders (full store + MUI theme), Vitest setup
```

## Key Design Decisions

- **Mock mode** is determined at compile time via `__MOCK_MODE__` (Vite `define`). The real API key check throws at startup; no runtime branching in components.
- **City search** uses `country-state-city` (148k cities) with MUI Autocomplete and a 150ms debounce. Module-level `City.getAllCities()` runs once on first load (~100ms).
- **Undo/Redo** wraps the history slice with `redux-undo` (limit 10). Undo/Redo icon buttons live in HistoryPanel. The snackbar on delete also has an Undo button.
- **Weather cache** stores responses in `localStorage` with a TTL (default 5 min). Bypassed in mock/test mode.
- **Theme** persists to `localStorage` via custom Redux middleware, defaults to dark.

## Extending

- **Add forecast endpoint:** Add operation to `src/api/owm.yaml`, run `npm run generate:weather-api`, create feature component using the generated hook.
- **Persist history across sessions:** Add `redux-persist` to `store.ts`.
- **Real-time updates:** Add `pollingInterval` to `useGetCurrentWeatherQuery` in `WeatherCard`.

## Environment Variables

| Variable | Default | Description |
|---|---|---|
| `VITE_OWM_API_KEY` | — | OpenWeatherMap API key; set to `test` for mock mode |
| `VITE_OWM_BASE_URL` | `https://api.openweathermap.org/data/2.5` | API base URL |
| `VITE_MAX_HISTORY_ITEMS` | `10` | Max cities stored in history |
| `VITE_CACHE_DURATION_S` | `300` | Weather cache TTL in seconds |
| `VITE_SNACKBAR_DURATION_MS` | `5000` | Snackbar auto-hide duration |
