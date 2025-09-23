import { defineConfig } from 'vitest/config'

export default defineConfig({
  define: {
    global: 'globalThis',
  },
  test: {
    globals: true,
    environment: 'node',
    
    pool: 'forks',
    
    setupFiles: ['./tests/setup.js'],
    
    include: [
      'tests/**/*.{test,spec}.{js,mjs,ts}',
      'src/**/*.{test,spec}.{js,mjs,ts}'
    ],
    
    exclude: [
      'node_modules',
      'dist',
      'build',
      'coverage',
      'tests/fixtures',
      'tests/helpers'
    ],
    
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      reportsDirectory: 'coverage',
      include: ['src/**/*.js'],
      exclude: [
        'src/**/*.test.js',
        'src/**/*.spec.js',
        'src/config/**',
        'tests/**'
      ],
      thresholds: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80
        }
      }
    },
    
    testTimeout: 30000,
    hookTimeout: 30000,
    
    clearMocks: true,
    restoreMocks: true,
    
    threads: true,
    maxThreads: 2,
    minThreads: 1,
    
    reporter: ['verbose', 'json', 'html'],
    outputFile: {
      json: 'results/test-results.json',
      html: 'results/test-results.html'
    }
  }
})
