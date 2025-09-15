/**
 * Test environment setup for Vitest
 */

import { vi } from 'vitest'

// Global mocks and settings
global.vi = vi

// Setup timeouts for tests
vi.setConfig({
  testTimeout: 10000,
  hookTimeout: 10000
})

// Mock for console methods in tests
const originalConsole = { ...console }

beforeEach(() => {
  // Clear all mocks before each test
  vi.clearAllMocks()
  
  // Restore console methods
  Object.assign(console, originalConsole)
})

afterEach(() => {
  // Clear all timers and mocks after each test
  vi.clearAllTimers()
  vi.restoreAllMocks()
})

// Global utilities for tests
global.createMockFile = (name, content, size = null) => ({
  path: name,
  name: name.split('/').pop(),
  extension: name.split('.').pop().toLowerCase(),
  size: size || (content ? content.length : 0)
})

// Helper for creating file arrays
global.createMockFiles = (fileMap) => {
  return Object.entries(fileMap).map(([path, content]) => 
    createMockFile(path, content)
  )
}

// Utility for performance measurement
global.measurePerformance = async (fn, label = 'operation') => {
  const startTime = performance.now()
  const result = await fn()
  const endTime = performance.now()
  const duration = endTime - startTime
  
  console.log(`${label} took ${duration.toFixed(2)}ms`)
  
  return { result, duration }
}

// Setup for error handling in tests
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason)
})

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error)
})

// Increase event listeners limit for tests
import { EventEmitter } from 'events'
EventEmitter.defaultMaxListeners = 20

// Setup environment variables for tests
process.env.NODE_ENV = 'test'

// Mock for file system (if needed)
export const createFsMock = (files = {}) => {
  return {
    readdir: vi.fn().mockImplementation(async (path) => {
      const entries = Object.keys(files)
        .filter(key => key.startsWith(path))
        .map(key => ({
          name: key.replace(path + '/', ''),
          isDirectory: () => false,
          isFile: () => true
        }))
      return entries
    }),
    
    stat: vi.fn().mockImplementation(async (path) => {
      if (files[path]) {
        return {
          size: files[path].length,
          isDirectory: () => false,
          isFile: () => true
        }
      }
      throw new Error(`ENOENT: no such file or directory, stat '${path}'`)
    })
  }
}

// Utility for creating temporary directories in tests
export const createTempDir = () => {
  const os = require('os')
  const path = require('path')
  const fs = require('fs')
  
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'bismark-test-'))
  return tempDir
}

// Cleanup resources after all tests complete
afterAll(async () => {
  // Force garbage collection if available
  if (global.gc) {
    global.gc()
  }
})

console.log('Test setup completed successfully')
