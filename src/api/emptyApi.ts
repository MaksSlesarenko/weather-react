// Base API file for codegen — DO NOT EDIT manually after running `npm run generate`
import {
  createApi,
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react'
import { OWM_BASE_URL, CACHE_DURATION_S } from '../app/constants'
import { getCached, setCached } from './weatherCache'

const rawBase = fetchBaseQuery({ baseUrl: OWM_BASE_URL })

const owmBaseQuery: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extra) => {
  const adjusted: FetchArgs =
    typeof args === 'string'
      ? { url: args }
      : {
          ...args,
          params: {
            units: 'metric',
            ...(args.params ?? {}),
            ...(!__MOCK_MODE__ ? { appid: import.meta.env.VITE_OWM_API_KEY } : {}),
          },
        }

  const cached = getCached<unknown>(adjusted)
  if (cached) return { data: cached }

  const result = await rawBase(adjusted, api, extra)
  if (result.data) setCached(adjusted, result.data)
  return result
}

export const emptyWeatherApi = createApi({
  reducerPath: 'weatherApi',
  baseQuery: owmBaseQuery,
  keepUnusedDataFor: CACHE_DURATION_S,
  endpoints: () => ({}),
})

export const api = emptyWeatherApi
