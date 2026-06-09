import { defineConfig } from 'vitest/config'
import { loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig(({ mode }) => {
  const isTest = mode === 'test'
  const env = isTest ? { VITE_OWM_API_KEY: 'test' } : loadEnv(mode, process.cwd(), '')

  if (!isTest && !env.VITE_OWM_API_KEY) {
    throw new Error(
      'VITE_OWM_API_KEY is not set. Set it to "test" for mock mode or provide a real OpenWeatherMap API key.',
    )
  }

  const mockMode = env.VITE_OWM_API_KEY === 'test'

  return {
    define: {
      __MOCK_MODE__: JSON.stringify(mockMode),
    },
    plugins: [react()],
    resolve: {
      alias: {
        'react-transition-group/TransitionGroupContext': path.resolve(
          __dirname,
          'node_modules/react-transition-group/cjs/TransitionGroupContext.js',
        ),
        'react-transition-group': path.resolve(
          __dirname,
          'node_modules/react-transition-group/cjs/index.js',
        ),
      },
    },
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: ['./src/test-utils/setup.ts'],
      exclude: ['**/node_modules/**', '**/dist/**', 'e2e/**'],
      coverage: {
        provider: 'v8',
        reporter: ['text', 'lcov'],
        exclude: ['e2e/**'],
      },
    },
  }
})
