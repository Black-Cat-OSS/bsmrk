// Main library exports
export { analyzeDirectory } from './src/index.js'

// Individual module exports for advanced usage
export { scanDirectory } from './src/file-scanner.js'
export { analyzeLanguages } from './src/language-analyzer.js'
export { detectFrameworks } from './src/framework-detector.js'
export { getIgnoredFiles, getIgnoreStatistics, validateIgnorePatterns } from './src/ignore-checker.js'

// Configuration exports
export { LANGUAGE_EXTENSIONS } from './src/config/languages.js'
export { FRAMEWORK_PATTERNS } from './src/config/frameworks.js'
export { CUSTOM_IGNORE } from './src/config/ignore.js'
