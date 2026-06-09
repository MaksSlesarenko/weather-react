import { useMemo } from 'react'
import { ThemeProvider } from '@mui/material'
import CssBaseline from '@mui/material/CssBaseline'
import { useAppSelector } from './app/hooks'
import { selectThemeMode } from './features/theme/themeSlice'
import { buildMuiTheme } from './app/theme'
import Layout from './components/Layout'

export default function App() {
  const mode = useAppSelector(selectThemeMode)
  const theme = useMemo(() => buildMuiTheme(mode), [mode])

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Layout />
    </ThemeProvider>
  )
}
