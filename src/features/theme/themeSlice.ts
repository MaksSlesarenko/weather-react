import { createSlice } from '@reduxjs/toolkit'

type ThemeMode = 'light' | 'dark'

export interface ThemeState {
  mode: ThemeMode
}

function getInitialMode(): ThemeMode {
  const stored = localStorage.getItem('theme')
  return stored === 'light' || stored === 'dark' ? stored : 'dark'
}

const themeSlice = createSlice({
  name: 'theme',
  initialState: (): ThemeState => ({ mode: getInitialMode() }),
  reducers: {
    toggleTheme(state) {
      state.mode = state.mode === 'dark' ? 'light' : 'dark'
    },
  },
})

export const { toggleTheme } = themeSlice.actions
export const selectThemeMode = (state: { theme: ThemeState }) => state.theme.mode
export default themeSlice.reducer
