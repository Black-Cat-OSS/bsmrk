import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    // Global settings
    globals: true,
    environment: 'node',
    
    // Setup file for tests
    setupFiles: ['./tests/setup.js'],
    
    // Patterns for finding tests
    include: [
      'tests/**/*.{test,spec}.{js,mjs,ts}',
      'src/**/*.{test,spec}.{js,mjs,ts}'
    ],
    
    // Exclusions
    exclude: [
      'node_modules',
      'dist',
      'build',
      'coverage',
      'tests/fixtures',
      'tests/helpers'
    ],
    
    // Coverage settings
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
    
    // Timeouts
    testTimeout: 10000,
    hookTimeout: 10000,
    
    // Mock settings
    clearMocks: true,
    restoreMocks: true,
    
    // Parallel execution settings
    threads: true,
    maxThreads: 4,
    minThreads: 1,
    
    // Reporting settings
    reporter: ['verbose', 'json', 'html'],
    outputFile: {
      json: 'results/test-results.json',
      html: 'results/test-results.html'
    }
  }
})
