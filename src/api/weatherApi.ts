import { api } from "./emptyApi";
const injectedRtkApi = api.injectEndpoints({
  endpoints: (build) => ({
    getCurrentWeather: build.query<
      GetCurrentWeatherApiResponse,
      GetCurrentWeatherApiArg
    >({
      query: (queryArg) => ({
        url: `/weather`,
        params: {
          q: queryArg.q,
          appid: queryArg.appid,
          units: queryArg.units,
        },
      }),
    }),
  }),
  overrideExisting: false,
});
export { injectedRtkApi as generatedWeatherApi };
export type GetCurrentWeatherApiResponse = /** status 200 OK */ WeatherResponse;
export type GetCurrentWeatherApiArg = {
  q: string;
  appid?: string;
  units?: "standard" | "metric" | "imperial";
};
export type WeatherResponse = {
  coord: {
    lon?: number;
    lat?: number;
  };
  weather: {
    id: number;
    main: string;
    description: string;
    icon: string;
  }[];
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
  };
  wind: {
    speed: number;
    deg?: number;
  };
  name: string;
  sys: {
    country: string;
    sunrise?: number;
    sunset?: number;
  };
  cod: number;
};
export type ApiError = {
  cod?: string;
  message?: string;
};
export const { useGetCurrentWeatherQuery } = injectedRtkApi;
