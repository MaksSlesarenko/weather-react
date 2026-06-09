import { useCallback, useRef, useState, type SyntheticEvent } from 'react'
import { Autocomplete, Box, TextField, Typography, type BoxProps } from '@mui/material'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import { City, type ICity } from 'country-state-city'

const ALL_CITIES = City.getAllCities()

type SearchBarProps = {
  onSearch: (city: ICity) => void
  disabled?: boolean
} & BoxProps

export default function SearchBar({ onSearch, disabled, ...props }: SearchBarProps) {
  const [inputValue, setInputValue] = useState('')
  const [debouncedInput, setDebouncedInput] = useState('')
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleChange = (_: SyntheticEvent, value: ICity | null) => {
    if (value) {
      setInputValue(value.name)
      onSearch(value)
    }
  }

  const handleInputChange = (_: SyntheticEvent, value: string, reason: string) => {
    setInputValue(value)
    if (reason === 'input') {
      if (debounceRef.current) clearTimeout(debounceRef.current)
      debounceRef.current = setTimeout(() => setDebouncedInput(value), 150)
    }
  }

  const filterOptions = useCallback((options: ICity[]) => {
    const query = debouncedInput.toLowerCase().trim()
    if (query.length < 2) return []
    const startsWith: ICity[] = []
    const contains: ICity[] = []
    for (const o of options) {
      const name = o.name.toLowerCase()
      if (name.startsWith(query)) {
        startsWith.push(o)
        if (startsWith.length === 8) break
      } else if (name.includes(query) && contains.length < 4) {
        contains.push(o)
      }
    }
    return [...startsWith, ...contains]
  }, [debouncedInput])

  return (
    <Box {...props}>
      <Autocomplete
        fullWidth
        options={ALL_CITIES}
        filterOptions={filterOptions}
        getOptionLabel={(option) => option.name}
        inputValue={inputValue}
        onInputChange={handleInputChange}
        onChange={handleChange}
        disabled={disabled}
        renderOption={(props, option) => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { key: _k, ...rest } = props as { key: string } & React.HTMLAttributes<HTMLLIElement>
          return (
            <Box
              component="li"
              key={`${option.name}-${option.countryCode}-${option.stateCode}`}
              {...rest}
              sx={{ display: 'flex', alignItems: 'center', gap: 1, py: '6px !important' }}
            >
              <LocationOnIcon sx={{ fontSize: 16, color: 'text.secondary', flexShrink: 0 }} />
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {option.name}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary', ml: 'auto', letterSpacing: 1 }}>
                {option.countryCode}
              </Typography>
            </Box>
          )
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder="Search city..."
            size="small"
          />
        )}
        slotProps={{
          paper: {
            elevation: 4,
            sx: {
              borderRadius: 2,
              mt: 0.5,
              '& .MuiAutocomplete-listbox': {
                py: 0.5,
                '& .MuiAutocomplete-option': {
                  borderRadius: 1,
                  mx: 0.5,
                  '&.Mui-focused': { backgroundColor: 'action.hover' },
                },
              },
            },
          },
        }}
      />
    </Box>
  )
}
