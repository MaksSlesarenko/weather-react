import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { ActionCreators as UndoActionCreators } from 'redux-undo'
import { MAX_HISTORY_ITEMS } from '../../app/constants'

export interface CityEntry {
  name: string
  countryCode: string
  stateCode: string
  query: string
}

interface HistoryState {
  cities: CityEntry[]
}

const initialState: HistoryState = { cities: [] }

function cityKey(c: CityEntry) {
  return `${c.name}-${c.countryCode}-${c.stateCode}`
}

const historySlice = createSlice({
  name: 'history',
  initialState,
  reducers: {
    addCity(state, action: PayloadAction<CityEntry>) {
      const entry = { ...action.payload, name: action.payload.name.toLowerCase().trim() }
      const key = cityKey(entry)
      state.cities = [
        entry,
        ...state.cities.filter((c) => cityKey(c) !== key),
      ].slice(0, MAX_HISTORY_ITEMS)
    },
    removeCity(state, action: PayloadAction<CityEntry>) {
      const key = cityKey(action.payload)
      state.cities = state.cities.filter((c) => cityKey(c) !== key)
    },
  },
})

export const { addCity, removeCity } = historySlice.actions
export { UndoActionCreators }
export default historySlice.reducer

export const selectHistoryCities = (state: {
  history: { present: HistoryState }
}) => state.history.present.cities

export const selectCanUndo = (state: {
  history: { past: HistoryState[] }
}) => state.history.past.length > 0

export const selectCanRedo = (state: {
  history: { future: HistoryState[] }
}) => state.history.future.length > 0
