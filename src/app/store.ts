import { configureStore } from '@reduxjs/toolkit'
import type { Reducer } from '@reduxjs/toolkit'
import undoable from 'redux-undo'
import type { StateWithHistory } from 'redux-undo'
import { createLogger } from 'redux-logger'
import historyReducer from '../features/history/historySlice'
import type { CityEntry } from '../features/history/historySlice'
import themeReducer from '../features/theme/themeSlice'
import type { ThemeState } from '../features/theme/themeSlice'
import { themeMiddleware } from '../features/theme/themeMiddleware'
import { generatedWeatherApi as weatherApi } from '../api/weatherApi'

interface HistoryState { cities: CityEntry[] }

const devMiddleware = import.meta.env.DEV ? [createLogger({ collapsed: true })] : []

export const store = configureStore({
  reducer: {
    // redux-undo v1 types lack the preloaded-state generic required by RTK ≥ 2.x
    history: undoable(historyReducer, { limit: 10 }) as unknown as Reducer<StateWithHistory<HistoryState>>,
    theme: themeReducer as unknown as Reducer<ThemeState>,
    [weatherApi.reducerPath]: weatherApi.reducer,
  },
  middleware: (getDefault) =>
    getDefault().concat(weatherApi.middleware, themeMiddleware, ...devMiddleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
