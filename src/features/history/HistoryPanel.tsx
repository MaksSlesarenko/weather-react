import { useState } from 'react'
import {
  Box,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Paper,
  Snackbar,
  Typography,
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import UndoIcon from '@mui/icons-material/Undo'
import RedoIcon from '@mui/icons-material/Redo'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import {
  removeCity,
  selectHistoryCities,
  selectCanUndo,
  selectCanRedo,
  UndoActionCreators,
  type CityEntry,
} from './historySlice'
import { SNACKBAR_DURATION_MS } from '../../app/constants'

interface Props {
  onCitySelect: (entry: CityEntry) => void
}

export default function HistoryPanel({ onCitySelect }: Props) {
  const dispatch = useAppDispatch()
  const cities = useAppSelector(selectHistoryCities)
  const canUndo = useAppSelector(selectCanUndo)
  const canRedo = useAppSelector(selectCanRedo)
  const [snackbarOpen, setSnackbarOpen] = useState(false)

  const handleDelete = (entry: CityEntry) => {
    dispatch(removeCity(entry))
    setSnackbarOpen(true)
  }

  const handleUndo = () => {
    dispatch(UndoActionCreators.undo())
    setSnackbarOpen(false)
  }

  const handleSnackbarClose = () => {
    setSnackbarOpen(false)
  }

  return (
    <Paper sx={{ p: 2, height: '100%' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        <Typography
          variant="overline"
          color="text.secondary"
          sx={{ flex: 1 }}
        >
          Recent Searches
        </Typography>
        <IconButton
          size="small"
          onClick={handleUndo}
          disabled={!canUndo}
          aria-label="Undo"
          title="Undo"
        >
          <UndoIcon fontSize="small" />
        </IconButton>
        <IconButton
          size="small"
          onClick={() => dispatch(UndoActionCreators.redo())}
          disabled={!canRedo}
          aria-label="Redo"
          title="Redo"
        >
          <RedoIcon fontSize="small" />
        </IconButton>
      </Box>

      {cities.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          No searches yet.
        </Typography>
      ) : (
        <List dense disablePadding>
          {cities.map((entry) => {
            const secondary = [entry.countryCode, entry.stateCode].filter(Boolean).join(' · ')
            return (
              <ListItem
                key={`${entry.name}-${entry.countryCode}-${entry.stateCode}`}
                disablePadding
                secondaryAction={
                  <IconButton
                    edge="end"
                    size="small"
                    onClick={() => handleDelete(entry)}
                    aria-label={`Remove ${entry.name}`}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                }
              >
                <ListItemButton onClick={() => onCitySelect(entry)}>
                  <ListItemText
                    primary={entry.name}
                    secondary={secondary || undefined}
                  />
                </ListItemButton>
              </ListItem>
            )
          })}
        </List>
      )}

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={SNACKBAR_DURATION_MS}
        onClose={handleSnackbarClose}
        message="City removed"
        action={
          <Button size="small" onClick={handleUndo}>
            Undo
          </Button>
        }
      />
    </Paper>
  )
}
