import {Alert, Box, Card, CardContent, type CardProps, Skeleton, Stack, Typography} from '@mui/material'
import AirIcon from '@mui/icons-material/Air'
import ThermostatIcon from '@mui/icons-material/Thermostat'
import { type ComponentType } from 'react'
import { useGetCurrentWeatherQuery } from '../../api/weatherApi'
import WeatherErrorBoundary from './WeatherErrorBoundary'

function withErrorBoundary<P extends { city: string | null }>(
  WrappedComponent: ComponentType<P>,
) {
  return function BoundaryWrapped(props: P) {
    return (
      <WeatherErrorBoundary key={props.city ?? ''}>
        <WrappedComponent {...props} />
      </WeatherErrorBoundary>
    )
  }
}

type Props = {
  city: string | null
} & CardProps

function ApiErrorThrower({ error }: { error: unknown }) {
  const status = (error as { status?: unknown })?.status
  if (status !== 404) throw error
  return (
    <Alert severity="warning" sx={{ mt: 1 }}>
      City not found. Check the spelling.
    </Alert>
  )
}

function WeatherCard({ city, ...props }: Props) {
  const { data, isLoading, isFetching, error } = useGetCurrentWeatherQuery({ q: city ?? '' }, { skip: !city })

  if (!city) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography color="text.secondary">
          Search for a city to see the weather.
        </Typography>
      </Box>
    )
  }

  if (isLoading || isFetching) {
    return (
      <Card {...props}>
        <CardContent>
          <Skeleton variant="text" width="50%" height={36} />
          <Skeleton variant="text" width="35%" height={72} />
          <Skeleton variant="text" width="70%" height={24} />
          <Skeleton variant="text" width="55%" height={24} />
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return <ApiErrorThrower error={error} />
  }

  if (!data?.weather?.length) return null

  const weather = data.weather[0]
  const safeIcon = /^[0-9]{2}[dn]$/.test(weather.icon ?? '') ? weather.icon : '01d'
  const iconUrl = `https://openweathermap.org/img/wn/${safeIcon}@2x.png`

  return (
    <Card elevation={3} {...props}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          {data.name}{data.sys.country ? `, ${data.sys.country.toUpperCase()}` : ''}
        </Typography>
        <Stack direction="row" spacing={2} sx={{ mb: 1, alignItems: 'center' }}>
          <img src={iconUrl} alt={weather.description ?? ''} width={64} height={64} />
          <Typography variant="h2" component="p">
            {Math.round(data.main.temp)}°C
          </Typography>
        </Stack>
        <Typography
          variant="body1"
          sx={{ textTransform: 'capitalize', mb: 1 }}
        >
          {weather.description}
        </Typography>
        <Stack direction="row" spacing={2}>
          <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
            <ThermostatIcon fontSize="small" color="action" />
            <Typography variant="body2" color="text.secondary">
              {Math.round(data.main.temp_min)}° / {Math.round(data.main.temp_max)}°
            </Typography>
          </Stack>
          <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
            <AirIcon fontSize="small" color="action" />
            <Typography variant="body2" color="text.secondary">
              {data.wind.speed} m/s
            </Typography>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  )
}

export default withErrorBoundary(WeatherCard)
