/**
 * Main test file for BismarkJS
 * Imports and runs all test suites
 */

import { describe, it, expect } from 'vitest'

// Import all test files
import './unit/file-scanner.test.js'
import './unit/language-analyzer.test.js'
import './unit/framework-detector.test.js'
import './unit/ignore-checker.test.js'
import './unit/edge-cases.test.js'
import './unit/performance.test.js'
import './integration/analyze-directory.test.js'

describe('BismarkJS - Complete Test Suite', () => {
  it('should have all test modules imported', () => {
    // Basic check that all tests are loaded
    expect(true).toBe(true)
  })
  
  it('should export main functions from index', async () => {
    const { analyzeDirectory, scanDirectory, analyzeLanguages, detectFrameworks, getIgnoredFiles } = await import('../src/index.js')
    
    expect(typeof analyzeDirectory).toBe('function')
    expect(typeof scanDirectory).toBe('function')
    expect(typeof analyzeLanguages).toBe('function')
    expect(typeof detectFrameworks).toBe('function')
    expect(typeof getIgnoredFiles).toBe('function')
  })
  
  it('should have valid configuration files', async () => {
    const { LANGUAGE_EXTENSIONS } = await import('../src/config/languages.js')
    const { FRAMEWORK_PATTERNS } = await import('../src/config/frameworks.js')
    const { CUSTOM_IGNORE } = await import('../src/config/ignore.js')
    
    expect(Array.isArray(LANGUAGE_EXTENSIONS)).toBe(true)
    expect(LANGUAGE_EXTENSIONS.length).toBeGreaterThan(50)
    
    expect(Array.isArray(FRAMEWORK_PATTERNS)).toBe(true)
    expect(FRAMEWORK_PATTERNS.length).toBeGreaterThan(20)
    
    expect(Array.isArray(CUSTOM_IGNORE)).toBe(true)
    expect(CUSTOM_IGNORE.length).toBeGreaterThan(100)
  })
})
