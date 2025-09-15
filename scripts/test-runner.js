#!/usr/bin/env node

/**
 * Script for running different types of tests
 */

import { execSync } from 'child_process'
import { existsSync } from 'fs'
import path from 'path'

const args = process.argv.slice(2)
const command = args[0] || 'help'

const commands = {
  // Main commands
  all: () => runCommand('npx vitest run', 'Run all tests'),
  unit: () => runCommand('npx vitest run tests/unit/', 'Run unit tests'),
  integration: () => runCommand('npx vitest run tests/integration/', 'Run integration tests'),
  
  // Tests by category
  scanner: () => runCommand('npx vitest run tests/unit/file-scanner.test.js', 'File scanner tests'),
  analyzer: () => runCommand('npx vitest run tests/unit/language-analyzer.test.js', 'Language analyzer tests'),
  detector: () => runCommand('npx vitest run tests/unit/framework-detector.test.js', 'Framework detector tests'),
  ignore: () => runCommand('npx vitest run tests/unit/ignore-checker.test.js', 'Ignore checker tests'),
  edge: () => runCommand('npx vitest run tests/unit/edge-cases.test.js', 'Edge cases tests'),
  performance: () => runCommand('npx vitest run tests/unit/performance.test.js', 'Performance tests'),
  
  // Run modes
  watch: () => runCommand('npx vitest --watch', 'Watch mode'),
  coverage: () => runCommand('npx vitest run --coverage', 'Tests with coverage'),
  ui: () => runCommand('npx vitest --ui', 'UI interface for tests'),
  
  // Debug
  debug: () => runCommand('node --inspect-brk node_modules/vitest/vitest.mjs run', 'Debug tests'),
  verbose: () => runCommand('npx vitest run --reporter=verbose', 'Verbose output'),
  
  // Utilities
  clean: () => {
    console.log('🧹 Cleaning test artifacts...')
    try {
      execSync('rm -rf coverage/ test-results.* .nyc_output/', { stdio: 'inherit' })
      console.log('✅ Cleanup completed')
    } catch (error) {
      console.error('❌ Cleanup error:', error.message)
    }
  },
  
  install: () => {
    console.log('📦 Installing testing dependencies...')
    runCommand('npm install --save-dev @vitest/coverage-v8 @vitest/ui vitest', 'Install dependencies')
  },
  
  help: () => {
    console.log(`
🧪 BismarkJS Test Runner

Usage: node scripts/test-runner.js <command>

Main commands:
  all           Run all tests
  unit          Run only unit tests
  integration   Run only integration tests

Tests by modules:
  scanner       Tests for file-scanner.js
  analyzer      Tests for language-analyzer.js
  detector      Tests for framework-detector.js
  ignore        Tests for ignore-checker.js
  edge          Edge cases tests
  performance   Performance tests

Run modes:
  watch         Watch mode (auto-restart)
  coverage      Run with coverage analysis
  ui            Web interface for tests
  debug         Run in debug mode
  verbose       Verbose output

Utilities:
  clean         Clean test artifacts
  install       Install testing dependencies
  help          Show this help

Examples:
  node scripts/test-runner.js all
  node scripts/test-runner.js unit
  node scripts/test-runner.js coverage
  node scripts/test-runner.js watch
    `)
  }
}

function runCommand(cmd, description) {
  console.log(`\n🚀 ${description}`)
  console.log(`📝 Command: ${cmd}\n`)
  
  try {
    execSync(cmd, { 
      stdio: 'inherit',
      cwd: process.cwd()
    })
    console.log(`\n✅ ${description} - completed successfully`)
  } catch (error) {
    console.error(`\n❌ ${description} - completed with error`)
    process.exit(error.status || 1)
  }
}

function checkDependencies() {
  const packageJsonPath = path.join(process.cwd(), 'package.json')
  
  if (!existsSync(packageJsonPath)) {
    console.error('❌ package.json not found')
    process.exit(1)
  }
  
  const vitestPath = path.join(process.cwd(), 'node_modules', 'vitest')
  
  if (!existsSync(vitestPath)) {
    console.log('⚠️  Vitest not installed. Running installation...')
    commands.install()
  }
}

// Check dependencies
if (command !== 'help' && command !== 'install') {
  checkDependencies()
}

// Execute command
if (commands[command]) {
  commands[command]()
} else {
  console.error(`❌ Unknown command: ${command}`)
  console.log('💡 Use "help" to view available commands')
  process.exit(1)
}
