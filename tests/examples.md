# BismarkJS Test Usage Examples

## 🎯 Quick Start

### Install Dependencies
```bash
npm install
```

### Run All Tests
```bash
npm test
```

### Run with Code Coverage
```bash
npm run test:coverage
```

## 📝 Testing Examples

### 1. Testing Simple Project Analysis

```javascript
import { analyzeDirectory } from '../src/index.js'
import { createTestDirectory, removeTestDirectory } from './helpers/test-utils.js'

// Create test structure
const structure = {
  'src': {
    'App.jsx': 'import React from "react"; export default App;',
    'style.css': '.app { color: red; }'
  },
  'package.json': '{"dependencies": {"react": "^18.0.0"}}'
}

const testDir = await createTestDirectory(structure)

// Analyze project
const result = await analyzeDirectory(testDir)

// Check results
console.log('Languages:', result.langs)
console.log('Frameworks:', result.frameworks)

// Cleanup
await removeTestDirectory(testDir)
```

### 2. Creating Custom Test Data

```javascript
import { generateFileContent } from './helpers/test-utils.js'

// Generate content for different file types
const jsContent = generateFileContent('js', 500)     // JavaScript file ~500 bytes
const cssContent = generateFileContent('css', 300)   // CSS file ~300 bytes
const pyContent = generateFileContent('py', 400)     // Python file ~400 bytes

const structure = {
  'app.js': jsContent,
  'style.css': cssContent,
  'server.py': pyContent
}
```

### 3. Performance Testing

```javascript
import { measurePerformance } from './helpers/test-utils.js'

const { result, duration } = await measurePerformance(
  () => analyzeDirectory(largeProjectPath),
  'Large project analysis'
)

expect(duration).toBeLessThan(2000) // Less than 2 seconds
expect(result.langs.length).toBeGreaterThan(0)
```

### 4. Using Ready-made Projects

```javascript
import { REACT_PROJECT, VUE_PROJECT, NODE_EXPRESS_PROJECT } from './fixtures/sample-projects.js'

// Test React project
const reactDir = await createTestDirectory(REACT_PROJECT)
const reactResult = await analyzeDirectory(reactDir)
expect(reactResult.frameworks).toContain('react')

// Test Vue project
const vueDir = await createTestDirectory(VUE_PROJECT)
const vueResult = await analyzeDirectory(vueDir)
expect(vueResult.frameworks).toContain('vue')
```

## 🧪 Various Testing Scenarios

### Testing Edge Cases

```javascript
// Empty project
const emptyResult = await analyzeDirectory(emptyDir)
expect(emptyResult.langs).toEqual([])
expect(emptyResult.frameworks).toEqual([])

// Single file project
const singleFileStructure = { 'index.js': 'console.log("Hello");' }
const singleFileResult = await analyzeDirectory(singleFileDir)
expect(singleFileResult.langs[0].percent).toBe(100)

// Very large project
const largeStructure = {}
for (let i = 0; i < 1000; i++) {
  largeStructure[`file${i}.js`] = `console.log("File ${i}");`
}
```

### Testing Errors

```javascript
// Non-existent directory
await expect(analyzeDirectory('/path/that/does/not/exist'))
  .rejects.toThrow()

// Invalid input data
await expect(analyzeDirectory(null)).rejects.toThrow()
await expect(analyzeDirectory(123)).rejects.toThrow()
```

### Testing Special Cases

```javascript
// Files with Unicode symbols
const unicodeStructure = {
  '🚀rocket.js': 'console.log("rocket");',
  '测试文件.py': 'print("Chinese file")',
  'файл.rb': 'puts "Russian file"'
}

// Files without extensions
const noExtStructure = {
  'Dockerfile': 'FROM node:16',
  'Makefile': 'all:\n\techo "build"',
  'LICENSE': 'MIT License'
}

// Conflicting extensions
const conflictStructure = {
  'script.m': 'function result = test()', // MATLAB or Objective-C
  'header.h': '#ifndef HEADER_H',         // C or C++
  'module.py': 'print("python")'          // Python or Jython
}
```

## 📊 Result Validation

### Validating Result Structure

```javascript
import { assertions } from './helpers/test-utils.js'

const result = await analyzeDirectory(testDir)

// Use ready-made validations
assertions.validateLanguageAnalysis(result.langs)
assertions.validateFrameworkDetection(result.frameworks)
assertions.validateIgnoredFiles(result.ignores)

// Or check manually
expect(result).toHaveProperty('langs')
expect(result).toHaveProperty('frameworks')
expect(result).toHaveProperty('ignores')

expect(Array.isArray(result.langs)).toBe(true)
expect(Array.isArray(result.frameworks)).toBe(true)
expect(Array.isArray(result.ignores)).toBe(true)
```

### Checking Language Percentages

```javascript
// Each language percentage should be > 0 and <= 100
result.langs.forEach(lang => {
  expect(lang.percent).toBeGreaterThan(0)
  expect(lang.percent).toBeLessThanOrEqual(100)
  expect(typeof lang.lang).toBe('string')
  expect(typeof lang.percent).toBe('number')
})

// Sum of percentages should not exceed 100
const totalPercent = result.langs.reduce((sum, lang) => sum + lang.percent, 0)
expect(totalPercent).toBeLessThanOrEqual(100.01) // Allow rounding error
```

### Checking Framework Detection

```javascript
// Frameworks should be unique and sorted
const frameworks = result.frameworks
expect(frameworks).toEqual([...new Set(frameworks)]) // No duplicates
expect(frameworks).toEqual([...frameworks].sort())   // Sorted

// Check specific frameworks
if (hasReactFiles) {
  expect(frameworks).toContain('react')
}

if (hasVueFiles) {
  expect(frameworks).toContain('vue')
}

// Check conflict resolution
if (frameworks.includes('nextjs')) {
  expect(frameworks).not.toContain('react') // Next.js excludes React
}
```

## 🔧 Setting Up Custom Tests

### Creating New Test File

```javascript
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { createTestDirectory, removeTestDirectory } from '../helpers/test-utils.js'

describe('My new test', () => {
  let testDir
  
  beforeEach(() => {
    // Setup before each test
  })
  
  afterEach(async () => {
    // Cleanup after each test
    if (testDir) {
      await removeTestDirectory(testDir)
      testDir = null
    }
  })
  
  it('should correctly analyze my project', async () => {
    const structure = {
      // Your project structure
    }
    
    testDir = await createTestDirectory(structure)
    const result = await analyzeDirectory(testDir)
    
    // Your checks
    expect(result).toBeDefined()
  })
})
```

### Creating Custom Utilities

```javascript
// In your test file
function createMyProjectStructure(options = {}) {
  const { 
    includeTests = true,
    framework = 'react',
    language = 'javascript'
  } = options
  
  const structure = {}
  
  // Structure creation logic based on options
  if (framework === 'react') {
    structure['src/App.jsx'] = 'import React from "react";'
  }
  
  if (includeTests) {
    structure['tests/app.test.js'] = 'describe("App", () => {});'
  }
  
  return structure
}

// Usage
const structure = createMyProjectStructure({
  framework: 'vue',
  includeTests: false
})
```

## 📈 Coverage Monitoring

### Checking Coverage for Specific Files

```bash
# Coverage only for file-scanner.js
npx vitest run --coverage tests/unit/file-scanner.test.js

# Coverage with function details
npx vitest run --coverage --reporter=verbose
```

### Setting Coverage Thresholds

In `vitest.config.js`:

```javascript
coverage: {
  thresholds: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    },
    // Individual file thresholds
    'src/file-scanner.js': {
      branches: 90,
      functions: 95,
      lines: 90
    }
  }
}
```

## 🚀 Test Automation

### Pre-commit Hooks

```json
// package.json
{
  "husky": {
    "hooks": {
      "pre-commit": "npm run test:unit && npm run test:coverage"
    }
  }
}
```

### CI/CD Integration

```yaml
# .github/workflows/test.yml
name: Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - run: npm ci
      - run: npm run test:coverage
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          file: ./coverage/coverage-final.json
```

## 💡 Tips and Best Practices

### 1. Test Naming
```javascript
// ❌ Bad
it('test 1', () => {})

// ✅ Good
it('should detect React framework when JSX files are present', () => {})
```

### 2. Test Grouping
```javascript
describe('analyzeDirectory', () => {
  describe('when project is empty', () => {
    it('should return empty arrays', () => {})
  })
  
  describe('when project has React files', () => {
    it('should detect React framework', () => {})
    it('should identify JavaScript language', () => {})
  })
})
```

### 3. Using beforeEach/afterEach
```javascript
describe('file operations', () => {
  let testDir
  
  beforeEach(async () => {
    testDir = await createTestDirectory({})
  })
  
  afterEach(async () => {
    await removeTestDirectory(testDir)
  })
  
  // Tests...
})
```

### 4. Testing Async Code
```javascript
// ✅ Correct
it('should analyze directory asynchronously', async () => {
  const result = await analyzeDirectory(testDir)
  expect(result).toBeDefined()
})

// ❌ Wrong - forgot await
it('should analyze directory', () => {
  const result = analyzeDirectory(testDir) // Returns Promise!
  expect(result).toBeDefined() // Will check Promise, not result
})
```

---

These examples will help you effectively use the BismarkJS testing system and create reliable tests for your code.
