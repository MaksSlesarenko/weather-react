import { describe, it, expect } from 'vitest'
import { configureStore } from '@reduxjs/toolkit'
import undoable, { ActionCreators as UndoActionCreators } from 'redux-undo'
import historyReducer, {
  addCity,
  removeCity,
  selectHistoryCities,
  selectCanUndo,
  selectCanRedo,
  type CityEntry,
} from '../historySlice'

function entry(name: string, countryCode = '', stateCode = ''): CityEntry {
  return { name, countryCode, stateCode, query: countryCode ? `${name},${countryCode.toLowerCase()}` : name }
}

function makeStore(initialCities: CityEntry[] = []) {
  return configureStore({
    reducer: { history: undoable(historyReducer, { limit: 1 }) },
    preloadedState: {
      history: {
        past: [],
        present: { cities: initialCities },
        future: [],
        _latestUnfiltered: { cities: initialCities },
        group: null,
        index: 0,
        limit: 1,
      },
    },
  })
}

describe('historySlice', () => {
  it('addCity prepends city and normalises to lowercase', () => {
    const store = makeStore()
    store.dispatch(addCity(entry('London', 'GB', 'ENG')))
    expect(selectHistoryCities(store.getState())[0]).toMatchObject({ name: 'london', countryCode: 'GB' })
  })

  it('addCity deduplicates — moves existing city to top', () => {
    const store = makeStore([entry('paris', 'FR', 'IDF'), entry('london', 'GB', 'ENG')])
    store.dispatch(addCity(entry('London', 'GB', 'ENG')))
    const cities = selectHistoryCities(store.getState())
    expect(cities[0]).toMatchObject({ name: 'london' })
    expect(cities[1]).toMatchObject({ name: 'paris' })
  })

  it('addCity treats same name in different country as distinct', () => {
    const store = makeStore([entry('springfield', 'US', 'IL')])
    store.dispatch(addCity(entry('Springfield', 'US', 'MO')))
    const cities = selectHistoryCities(store.getState())
    expect(cities).toHaveLength(2)
    expect(cities[0]).toMatchObject({ name: 'springfield', stateCode: 'MO' })
    expect(cities[1]).toMatchObject({ name: 'springfield', stateCode: 'IL' })
  })

  it('addCity caps list at MAX_HISTORY_ITEMS (10)', () => {
    const initial = Array.from({ length: 10 }, (_, i) => entry(`city${i}`, 'US', String(i)))
    const store = makeStore(initial)
    store.dispatch(addCity(entry('new', 'US', 'NY')))
    const cities = selectHistoryCities(store.getState())
    expect(cities).toHaveLength(10)
    expect(cities[0]).toMatchObject({ name: 'new' })
  })

  it('removeCity removes the given city', () => {
    const store = makeStore([entry('london', 'GB', 'ENG'), entry('paris', 'FR', 'IDF')])
    store.dispatch(removeCity(entry('london', 'GB', 'ENG')))
    const cities = selectHistoryCities(store.getState())
    expect(cities).toHaveLength(1)
    expect(cities[0]).toMatchObject({ name: 'paris' })
  })

  it('selectCanUndo is false initially', () => {
    const store = makeStore()
    expect(selectCanUndo(store.getState())).toBe(false)
  })

  it('selectCanUndo is true after removeCity', () => {
    const store = makeStore([entry('london', 'GB', 'ENG')])
    store.dispatch(removeCity(entry('london', 'GB', 'ENG')))
    expect(selectCanUndo(store.getState())).toBe(true)
  })

  it('undo restores the city after removeCity', () => {
    const store = makeStore([entry('london', 'GB', 'ENG'), entry('paris', 'FR', 'IDF')])
    store.dispatch(removeCity(entry('london', 'GB', 'ENG')))
    store.dispatch(UndoActionCreators.undo())
    const cities = selectHistoryCities(store.getState())
    expect(cities).toHaveLength(2)
    expect(cities[0]).toMatchObject({ name: 'london' })
  })

  it('selectCanRedo is false initially', () => {
    const store = makeStore([entry('london', 'GB', 'ENG')])
    expect(selectCanRedo(store.getState())).toBe(false)
  })

  it('selectCanRedo is true after undo', () => {
    const store = makeStore([entry('london', 'GB', 'ENG')])
    store.dispatch(removeCity(entry('london', 'GB', 'ENG')))
    store.dispatch(UndoActionCreators.undo())
    expect(selectCanRedo(store.getState())).toBe(true)
  })
})
