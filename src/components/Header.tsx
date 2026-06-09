import {AppBar, type AppBarProps, Toolbar, Typography} from '@mui/material'
import WbSunnyIcon from '@mui/icons-material/WbSunny'
import ThemeToggle from '../features/theme/ThemeToggle'

type HeaderProps = {} & AppBarProps

export default function Header({ ...props }: HeaderProps) {
  return (
    <AppBar position="sticky" color="transparent" elevation={0} {...props}>
      <Toolbar sx={{ gap: 1 }}>
        <WbSunnyIcon sx={{ mr: 1, color: 'primary.main' }} />
        <Typography variant="h6" component="h1" sx={{ flex: 1, fontWeight: 700 }}>
          Weather Forecast
        </Typography>
        <ThemeToggle />
      </Toolbar>
    </AppBar>
  )
}
