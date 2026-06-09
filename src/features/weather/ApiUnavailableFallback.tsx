import { Button, Paper, Typography } from '@mui/material'
import CloudOffIcon from '@mui/icons-material/CloudOff'

interface Props {
  onRetry: () => void
}

export default function ApiUnavailableFallback({ onRetry }: Props) {
  return (
    <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
      <CloudOffIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
      <Typography variant="h6" gutterBottom>
        Weather data unavailable
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        The data provider is not responding. Try again later.
      </Typography>
      <Button variant="contained" onClick={onRetry}>
        Retry
      </Button>
    </Paper>
  )
}
