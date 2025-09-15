# BismarkJS Test Suite

Comprehensive test suite for the BismarkJS library, ensuring high code coverage and reliability.

## 📁 Test Structure

```
tests/
├── unit/                    # Unit tests for individual modules
│   ├── file-scanner.test.js      # File scanning tests
│   ├── language-analyzer.test.js # Language analysis tests
│   ├── framework-detector.test.js # Framework detection tests
│   ├── ignore-checker.test.js    # File ignoring tests
│   ├── edge-cases.test.js        # Edge cases and error handling
│   └── performance.test.js       # Performance tests
├── integration/             # Integration tests
│   └── analyze-directory.test.js # Full analysis tests
├── fixtures/                # Test data and structures
│   └── sample-projects.js        # Ready-made projects for testing
├── helpers/                 # Helper utilities
│   └── test-utils.js            # Utilities for creating tests
├── setup.js                 # Test environment setup
├── index.test.js           # Main test file
└── README.md               # This file
```

## 🚀 Running Tests

### Basic Commands

```bash
# Run all tests
npm test

# Run in watch mode
npm run test:watch

# Run with code coverage
npm run test:coverage

# Run with UI interface
npm run test:ui
```

### Running Specific Tests

```bash
# Only unit tests
npx vitest run tests/unit/

# Only integration tests
npx vitest run tests/integration/

# Specific test file
npx vitest run tests/unit/file-scanner.test.js

# Tests with specific pattern
npx vitest run --grep "React"
```

## 📊 Test Coverage

The test suite covers:

### Unit Tests (90%+ coverage for each module)

- **file-scanner.js** - file system scanning
  - Recursive directory scanning
  - Various file type handling
  - Pattern-based ignoring
  - Access error handling

- **language-analyzer.js** - programming language analysis
  - Language detection by extension
  - Percentage calculation
  - Extension conflict handling
  - Special cases (config files, no extension)

- **framework-detector.js** - framework detection
  - File and directory patterns
  - Framework conflict resolution
  - Hierarchy and priorities
  - Result count limiting

- **ignore-checker.js** - ignored file checking
  - Glob patterns
  - Negative patterns (exclusions)
  - Ignore statistics
  - Pattern validation

### Integration Tests

- Full analysis of various project types:
  - React applications
  - Vue.js applications  
  - Node.js/Express servers
  - Python Flask applications
  - Mixed multi-language projects
  - Monorepo structures

### Edge Cases

- Invalid input data
- Very large projects
- Deep directory nesting
- Files with special characters
- File system errors
- Concurrent access

### Performance Tests

- Projects of various sizes (< 100, 100-1000, 1000+ files)
- Memory usage
- Parallel execution
- Performance degradation

## 🎯 Coverage Goals

- **Overall coverage**: > 85%
- **Function coverage**: > 90%
- **Branch coverage**: > 80%
- **Line coverage**: > 85%

## 🧪 Test Types

### 1. Functional Tests
Check correctness of main functionality:
- File scanning
- Language analysis
- Framework detection
- File ignoring

### 2. Integration Tests
Check interaction between modules:
- Full project analysis cycle
- Real project structures
- Various technology combinations

### 3. Edge Case Tests
Check behavior in non-standard situations:
- Invalid input data
- File system errors
- Extreme project sizes

### 4. Performance Tests
Check performance and scalability:
- Execution time
- Memory usage
- Parallel execution

## 🛠 Test Utilities

### createTestDirectory(structure)
Creates a temporary directory with specified file structure.

```javascript
const testDir = await createTestDirectory({
  'src': {
    'app.js': 'console.log("Hello");',
    'style.css': '.app { color: red; }'
  },
  'package.json': '{"name": "test"}'
})
```

### generateFileContent(extension, size)
Generates file content of specified type and size.

```javascript
const jsContent = generateFileContent('js', 500)
const cssContent = generateFileContent('css', 300)
```

### assertions
Set of ready-made checks for analysis results.

```javascript
assertions.validateLanguageAnalysis(result.langs)
assertions.validateFrameworkDetection(result.frameworks)
assertions.validateIgnoredFiles(result.ignores)
```

## 📝 Sample Test Projects

The `fixtures/sample-projects.js` contains ready-made project structures:

- **REACT_PROJECT** - typical React application
- **VUE_PROJECT** - Vue.js application with Vite
- **NODE_EXPRESS_PROJECT** - Express.js server
- **PYTHON_FLASK_PROJECT** - Flask application
- **MIXED_LANGUAGE_PROJECT** - multi-language project
- **FRAMEWORK_COMBINATIONS** - various framework combinations
- **EDGE_CASE_PROJECTS** - projects for edge case testing

## 🔧 Test Configuration

### Vitest Configuration
Settings in `vitest.config.js`:
- Global variables
- Code coverage
- Timeouts
- Reporters

### Setup File
`tests/setup.js` contains:
- Global mocks
- Utilities for all tests
- Environment setup
- Resource cleanup

## 🚨 Debugging Tests

### View Coverage
```bash
npm run test:coverage
# Opens HTML report at coverage/index.html
```

### Test UI
```bash
npm run test:ui
# Opens web interface for test management
```

### Debug Specific Test
```bash
npx vitest run --reporter=verbose tests/unit/file-scanner.test.js
```

### Performance Profiling
```bash
node --inspect-brk node_modules/vitest/vitest.mjs run tests/unit/performance.test.js
```

## 📈 Metrics and Reports

After running tests with coverage, available:

- **Console report** - brief coverage summary
- **JSON report** - machine-readable data in `coverage/coverage-final.json`
- **HTML report** - interactive report in `coverage/index.html`
- **Test report** - results in `test-results.json` and `test-results.html`

## 🎨 Best Practices

### 1. Test Structure
- Group related tests in `describe` blocks
- Use descriptive test names
- Follow AAA pattern (Arrange, Act, Assert)

### 2. Mocks and Fixtures
- Use real data where possible
- Mock only external dependencies
- Clean mocks between tests

### 3. Async Tests
- Always use `await` for async operations
- Set adequate timeouts
- Handle errors correctly

### 4. Test Performance
- Avoid unnecessary operations in tests
- Use `beforeEach`/`afterEach` for setup
- Clean resources after tests

## 🔍 Continuous Integration

Tests are integrated into CI/CD pipeline:

```yaml
# Example GitHub Actions
- name: Run tests
  run: npm test

- name: Generate coverage
  run: npm run test:coverage

- name: Upload coverage
  uses: codecov/codecov-action@v3
```

## 📚 Additional Resources

- [Vitest Documentation](https://vitest.dev/)
- [Testing Best Practices](https://github.com/goldbergyoni/javascript-testing-best-practices)
- [Node.js Testing Guide](https://nodejs.org/en/docs/guides/testing/)

---

**Note**: This test suite ensures high quality and reliability of the BismarkJS library. When adding new functionality, be sure to cover it with appropriate tests.
