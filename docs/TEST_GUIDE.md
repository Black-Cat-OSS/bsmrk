# 🧪 BismarkJS Testing Guide

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run all tests
npm test

# Run with code coverage
npm run test:coverage

# Interactive UI for tests
npm run test:ui
```

## 📊 Coverage Results

After running `npm run test:coverage` open `coverage/index.html` to view detailed report.

**Target coverage metrics:**
- **Overall coverage**: > 85%
- **Functions**: > 90%  
- **Branches**: > 80%
- **Lines**: > 85%

## 🎯 Test Types

### Unit Tests (tests/unit/)
- ✅ **file-scanner.test.js** - file system scanning
- ✅ **language-analyzer.test.js** - programming language analysis  
- ✅ **framework-detector.test.js** - framework detection
- ✅ **ignore-checker.test.js** - ignored file checking
- ✅ **edge-cases.test.js** - edge cases and error handling
- ✅ **performance.test.js** - performance tests

### Integration Tests (tests/integration/)
- ✅ **analyze-directory.test.js** - full project analysis cycle

## 🔧 Commands

### Basic Commands
```bash
npm test              # All tests
npm run test:unit     # Only unit tests  
npm run test:integration # Only integration tests
npm run test:watch    # Watch mode
npm run test:coverage # With coverage analysis
npm run test:ui       # Web interface
```

### Specialized Commands
```bash
npm run test:performance # Only performance tests
npm run test:edge       # Only edge cases
npm run test:verbose    # Verbose output
npm run test:debug      # Debug mode
npm run test:clean      # Clean artifacts
```

### Convenient Runner
```bash
npm run test:runner help    # Help for all commands
npm run test:runner all     # All tests
npm run test:runner scanner # File scanner tests
npm run test:runner coverage # With coverage
```

## 📁 Test Structure

```
tests/
├── unit/                    # Unit tests
├── integration/             # Integration tests  
├── fixtures/                # Test data
│   └── sample-projects.js   # Ready-made projects
├── helpers/                 # Test utilities
│   └── test-utils.js        # Helper functions
├── setup.js                 # Test environment setup
├── index.test.js           # Main test file
├── examples.md             # Usage examples
└── README.md               # Detailed documentation
```

## 🎨 Test Features

### Automatic Test Project Creation
```javascript
const testDir = await createTestDirectory({
  'src/App.jsx': 'import React from "react";',
  'package.json': '{"dependencies": {"react": "^18.0.0"}}'
})
```

### Ready-made Test Projects
- **REACT_PROJECT** - typical React application
- **VUE_PROJECT** - Vue.js with Vite  
- **NODE_EXPRESS_PROJECT** - Express.js server
- **PYTHON_FLASK_PROJECT** - Flask application
- **MIXED_LANGUAGE_PROJECT** - multi-language project

### Automatic Result Validation
```javascript
assertions.validateLanguageAnalysis(result.langs)
assertions.validateFrameworkDetection(result.frameworks)  
assertions.validateIgnoredFiles(result.ignores)
```

## 🔍 What is Tested

### File Scanning
- Recursive directory traversal
- Various file type handling
- Pattern-based ignoring
- Access error handling

### Language Analysis
- 100+ programming languages
- Detection by extension and content
- Percentage ratio by file size
- Extension conflict resolution

### Framework Detection  
- 50+ popular frameworks
- File and directory patterns
- Conflict resolution and hierarchy
- Result count limiting

### File Ignoring
- Glob patterns (node_modules/, *.log, etc.)
- Negative patterns (exclusions)
- Ignoring statistics
- Pattern validation

### Edge Cases
- Invalid input data
- Very large projects (1000+ files)
- Deep directory nesting
- Files with special characters
- File system errors

### Performance
- Projects of various sizes
- Memory usage
- Parallel execution  
- No degradation

## 📈 Quality Monitoring

### Continuous Integration
Tests run automatically on every commit and pull request.

### Coverage Reports
- Console report
- HTML report (coverage/index.html)
- JSON data (coverage/coverage-final.json)

### Performance Metrics
- Test execution time
- Memory usage
- Performance on large projects

## 🛠 Test Debugging

### Run Specific Test
```bash
npx vitest run tests/unit/file-scanner.test.js
```

### Debug in IDE
```bash
npm run test:debug
# Then connect to debugger on port 9229
```

### Verbose Output
```bash
npm run test:verbose
```

## 💡 Recommendations

1. **Run tests before commit**
   ```bash
   npm run test:coverage
   ```

2. **Use watch mode during development**
   ```bash
   npm run test:watch
   ```

3. **Check coverage of new functions**
   - Add tests for new functionality
   - Aim for coverage > 85%

4. **Test edge cases**
   - Invalid input data
   - Large data volumes
   - File system errors

## 📚 Additional Documentation

- **tests/README.md** - detailed test documentation
- **tests/examples.md** - usage examples
- **vitest.config.js** - test framework configuration

---

**Note**: This test suite ensures high quality and reliability of the BismarkJS library. For questions, refer to the detailed documentation in the `tests/` folder.
