import type { ReactElement } from 'react'
import { render } from '@testing-library/react'
import type { RenderOptions, RenderResult } from '@testing-library/react'
import { configureStore } from '@reduxjs/toolkit'
import type { EnhancedStore } from '@reduxjs/toolkit'
import { Provider } from 'react-redux'
import { ThemeProvider } from '@mui/material'
import CssBaseline from '@mui/material/CssBaseline'
import undoable from 'redux-undo'
import historyReducer from '../features/history/historySlice'
import themeReducer from '../features/theme/themeSlice'
import { generatedWeatherApi as weatherApi } from '../api/weatherApi'
import { buildMuiTheme } from '../app/theme'
import type { RootState } from '../app/store'


interface Options extends Omit<RenderOptions, 'wrapper'> {
  preloadedState?: Partial<RootState>
  store?: EnhancedStore
}

export function renderWithProviders(
  ui: ReactElement,
  { preloadedState, store, ...renderOptions }: Options = {},
): RenderResult & { store: EnhancedStore } {
  const testStore =
    store ??
    configureStore({
      // redux-undo v1 types lack the preloaded-state generic required by RTK ≥ 2.x
      reducer: {
        history: undoable(historyReducer, { limit: 10 }),
        theme: themeReducer,
        [weatherApi.reducerPath]: weatherApi.reducer,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any,
      // RTK Query middleware type doesn't satisfy RTK ≥ 2.x's strict MiddlewareArray constraint in test stores
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      middleware: (getDefault) => getDefault().concat(weatherApi.middleware) as any,
      preloadedState,
    })

  function Wrapper({ children }: { children: React.ReactNode }) {
    const mode = testStore.getState().theme.mode
    const theme = buildMuiTheme(mode)
    return (
      <Provider store={testStore}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {children}
        </ThemeProvider>
      </Provider>
    )
  }

  return { ...render(ui, { wrapper: Wrapper, ...renderOptions }), store: testStore }
}
