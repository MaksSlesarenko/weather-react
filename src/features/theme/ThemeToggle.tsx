import {type IconButtonProps, IconButton, Tooltip} from '@mui/material'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import LightModeIcon from '@mui/icons-material/LightMode'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { toggleTheme, selectThemeMode } from './themeSlice'

type ThemeToggleProps = IconButtonProps
export default function ThemeToggle({ ...props }: ThemeToggleProps) {
  const dispatch = useAppDispatch()
  const mode = useAppSelector(selectThemeMode)
  const isDark = mode === 'dark'

  return (
    <Tooltip title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}>
      <IconButton
        onClick={() => dispatch(toggleTheme())}
        color="inherit"
        aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        {...props}
      >
        {isDark ? <LightModeIcon /> : <DarkModeIcon />}
      </IconButton>
    </Tooltip>
  )
}
