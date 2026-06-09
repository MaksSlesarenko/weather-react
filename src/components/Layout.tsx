import { useState } from 'react'
import {Box, type BoxProps, Container} from '@mui/material'
import { type ICity } from 'country-state-city'
import { useAppDispatch } from '../app/hooks'
import {addCity, type CityEntry} from '../features/history/historySlice'
import { useGetCurrentWeatherQuery } from '../api/weatherApi'
import Header from './Header'
import SearchBar from './SearchBar'
import WeatherCard from '../features/weather/WeatherCard'
import HistoryPanel from '../features/history/HistoryPanel'

type LayoutProps = {} & BoxProps
export default function Layout({ ...props }: LayoutProps) {
  const dispatch = useAppDispatch()
  const [currentCity, setCurrentCity] = useState<string | null>(null)
  const { isFetching } = useGetCurrentWeatherQuery({ q: currentCity ?? '' }, { skip: !currentCity })

  const handleSearch = (city: ICity) => {
    const name = city.name.toLowerCase().trim()
    const entry = {
      name,
      countryCode: city.countryCode,
      stateCode: city.stateCode,
      query: `${name},${city.countryCode.toLowerCase()}`,
    }
    setCurrentCity(entry.query)
    dispatch(addCity(entry))
  }

  const handleHistorySelect = (entry: CityEntry) => {
    setCurrentCity(entry.query)
    dispatch(addCity(entry))
  }

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }} {...props}>
      <Header />
      <Container maxWidth="md" sx={{ flex: 1, py: 3 }}>
        <Box
          sx={{
            display: 'flex',
            gap: 3,
            flexDirection: { xs: 'column', md: 'row' },
          }}
        >
          <Box sx={{ flex: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <SearchBar onSearch={handleSearch} disabled={isFetching} />
            <WeatherCard city={currentCity} />
          </Box>
          <Box sx={{ flex: 1 }}>
            <HistoryPanel onCitySelect={handleHistorySelect} />
          </Box>
        </Box>
      </Container>
    </Box>
  )
}
