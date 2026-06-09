import type { ConfigFile } from '@rtk-query/codegen-openapi'

const config: ConfigFile = {
  schemaFile: './src/api/owm.yaml',
  apiFile: './src/api/emptyApi.ts',
  outputFile: './src/api/weatherApi.ts',
  exportName: 'generatedWeatherApi',
  hooks: { queries: true, lazyQueries: false, mutations: false },
}

export default config
