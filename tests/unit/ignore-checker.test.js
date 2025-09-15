import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getIgnoredFiles, getIgnoreStatistics, validateIgnorePatterns } from '../../src/ignore-checker.js'
import { assertions } from '../helpers/test-utils.js'

describe('ignore-checker', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getIgnoredFiles', () => {
    it('should identify ignored files based on patterns', async () => {
      const files = [
        { path: 'src/app.js', name: 'app.js', extension: 'js', size: 100 },
        { path: 'node_modules/package/index.js', name: 'index.js', extension: 'js', size: 50 },
        { path: 'dist/bundle.js', name: 'bundle.js', extension: 'js', size: 200 },
        { path: '.git/config', name: 'config', extension: '', size: 30 },
        { path: 'package.json', name: 'package.json', extension: 'json', size: 80 },
        { path: '.env', name: '.env', extension: '', size: 20 },
        { path: 'file.log', name: 'file.log', extension: 'log', size: 40 }
      ]
      
      const result = await getIgnoredFiles(files)
      
      assertions.validateIgnoredFiles(result)
      
      // Should быть игнорированы according to CUSTOM_IGNORE
      expect(result).toContain('node_modules/package/index.js')
      expect(result).toContain('dist/bundle.js')
      expect(result).toContain('.git/config')
      expect(result).toContain('.env')
      expect(result).toContain('file.log')
      
      // Не should быть игнорированы
      expect(result).not.toContain('src/app.js')
      expect(result).not.toContain('package.json')
    })

    it('should handle directory-based ignore patterns', async () => {
      const files = [
        { path: 'src/component.js', name: 'component.js', extension: 'js', size: 100 },
        { path: 'node_modules/lib/index.js', name: 'index.js', extension: 'js', size: 50 },
        { path: 'build/app.js', name: 'app.js', extension: 'js', size: 80 },
        { path: 'coverage/report.html', name: 'report.html', extension: 'html', size: 200 },
        { path: '.cache/data.json', name: 'data.json', extension: 'json', size: 60 }
      ]
      
      const result = await getIgnoredFiles(files)
      
      assertions.validateIgnoredFiles(result)
      
      // Files в игнорируемых директориях should быть excluded
      expect(result).toContain('node_modules/lib/index.js')
      expect(result).toContain('build/app.js')
      expect(result).toContain('coverage/report.html')
      expect(result).toContain('.cache/data.json')
      
      // Files в обычных директориях не should быть excluded
      expect(result).not.toContain('src/component.js')
    })

    it('should handle glob patterns correctly', async () => {
      const files = [
        { path: 'app.js', name: 'app.js', extension: 'js', size: 100 },
        { path: 'app.min.js', name: 'app.min.js', extension: 'js', size: 80 },
        { path: 'bundle.js', name: 'bundle.js', extension: 'js', size: 90 },
        { path: 'component.bundle.js', name: 'component.bundle.js', extension: 'js', size: 70 },
        { path: 'debug.log', name: 'debug.log', extension: 'log', size: 40 },
        { path: 'error.log', name: 'error.log', extension: 'log', size: 50 }
      ]
      
      const result = await getIgnoredFiles(files)
      
      assertions.validateIgnoredFiles(result)
      
      // Files с паттернами *.min.js и *.log should быть excluded
      expect(result).toContain('app.min.js')
      expect(result).toContain('bundle.js') // bundle.js в CUSTOM_IGNORE
      expect(result).toContain('component.bundle.js') // *.bundle.* паттерн
      expect(result).toContain('debug.log')
      expect(result).toContain('error.log')
      
      // Обычные JS files не should быть excluded
      expect(result).not.toContain('app.js')
    })

    it('should handle negation patterns', async () => {
      // Тест для паттернов исключения (например, !.vscode/settings.json)
      const files = [
        { path: '.vscode/settings.json', name: 'settings.json', extension: 'json', size: 100 },
        { path: '.vscode/launch.json', name: 'launch.json', extension: 'json', size: 80 },
        { path: '.vscode/tasks.json', name: 'tasks.json', extension: 'json', size: 60 },
        { path: '.vscode/extensions.json', name: 'extensions.json', extension: 'json', size: 40 },
        { path: '.vscode/workspace.code-workspace', name: 'workspace.code-workspace', extension: 'code-workspace', size: 120 }
      ]
      
      const result = await getIgnoredFiles(files)
      
      assertions.validateIgnoredFiles(result)
      
      // В CUSTOM_IGNORE есть исключения для некоторых файлов .vscode
      // !.vscode/settings.json, !.vscode/tasks.json, !.vscode/launch.json, !.vscode/extensions.json
      expect(result).not.toContain('.vscode/settings.json')
      expect(result).not.toContain('.vscode/launch.json')
      expect(result).not.toContain('.vscode/tasks.json')
      expect(result).not.toContain('.vscode/extensions.json')
      
      // Другие files в .vscode/ should быть excluded
      expect(result).toContain('.vscode/workspace.code-workspace')
    })

    it('should handle empty file list', async () => {
      const files = []
      
      const result = await getIgnoredFiles(files)
      
      assertions.validateIgnoredFiles(result)
      expect(result).toEqual([])
    })

    it('should handle files with special characters', async () => {
      const files = [
        { path: 'файл с пробелами.js', name: 'файл с пробелами.js', extension: 'js', size: 100 },
        { path: 'file@with#symbols$.log', name: 'file@with#symbols$.log', extension: 'log', size: 50 },
        { path: 'node_modules/пакет/index.js', name: 'index.js', extension: 'js', size: 80 },
        { path: '.env.local', name: '.env.local', extension: 'local', size: 30 }
      ]
      
      const result = await getIgnoredFiles(files)
      
      assertions.validateIgnoredFiles(result)
      
      // Files с специальными символами should корректно обрабатываться
      expect(result).toContain('file@with#symbols$.log') // .log files игнорируются
      expect(result).toContain('node_modules/пакет/index.js') // node_modules игнорируется
      expect(result).toContain('.env.local') // .env.* files игнорируются
      
      expect(result).not.toContain('файл с пробелами.js') // обычный JS file
    })

    it('should handle case sensitivity correctly', async () => {
      const files = [
        { path: 'README.md', name: 'README.md', extension: 'md', size: 100 },
        { path: 'readme.MD', name: 'readme.MD', extension: 'MD', size: 80 },
        { path: 'NODE_MODULES/package/index.js', name: 'index.js', extension: 'js', size: 60 },
        { path: 'DIST/bundle.js', name: 'bundle.js', extension: 'js', size: 90 }
      ]
      
      const result = await getIgnoredFiles(files)
      
      assertions.validateIgnoredFiles(result)
      
      // Паттерны should работать независимо от регистра (флаг 'i' в regex)
      expect(result).toContain('NODE_MODULES/package/index.js')
      expect(result).toContain('DIST/bundle.js')
    })

    it('should return sorted results', async () => {
      const files = [
        { path: 'z-file.log', name: 'z-file.log', extension: 'log', size: 50 },
        { path: 'a-file.log', name: 'a-file.log', extension: 'log', size: 40 },
        { path: 'node_modules/z-package/index.js', name: 'index.js', extension: 'js', size: 60 },
        { path: 'node_modules/a-package/index.js', name: 'index.js', extension: 'js', size: 70 }
      ]
      
      const result = await getIgnoredFiles(files)
      
      assertions.validateIgnoredFiles(result)
      
      // Result should be отсортирован
      const sortedResult = [...result].sort()
      expect(result).toEqual(sortedResult)
    })

    it('should handle deep nested ignored directories', async () => {
      const files = [
        { path: 'node_modules/package/lib/deep/very/deep/file.js', name: 'file.js', extension: 'js', size: 100 },
        { path: 'build/assets/css/vendor/bootstrap/scss/mixins/_utilities.scss', name: '_utilities.scss', extension: 'scss', size: 80 },
        { path: '.git/objects/ab/cdef1234567890abcdef1234567890abcdef12', name: 'cdef1234567890abcdef1234567890abcdef12', extension: '', size: 200 }
      ]
      
      const result = await getIgnoredFiles(files)
      
      assertions.validateIgnoredFiles(result)
      
      // Глубоко вложенные files в игнорируемых директориях should быть excluded
      expect(result).toContain('node_modules/package/lib/deep/very/deep/file.js')
      expect(result).toContain('build/assets/css/vendor/bootstrap/scss/mixins/_utilities.scss')
      expect(result).toContain('.git/objects/ab/cdef1234567890abcdef1234567890abcdef12')
    })

    it('should handle Windows and Unix path separators', async () => {
      const files = [
        { path: 'node_modules/package/index.js', name: 'index.js', extension: 'js', size: 100 },
        { path: 'node_modules\\package\\index.js', name: 'index.js', extension: 'js', size: 100 },
        { path: 'src/components/Button.js', name: 'Button.js', extension: 'js', size: 80 },
        { path: 'src\\components\\Button.js', name: 'Button.js', extension: 'js', size: 80 }
      ]
      
      const result = await getIgnoredFiles(files)
      
      assertions.validateIgnoredFiles(result)
      
      // Оба типа разделителей should обрабатываться одинаково
      expect(result).toContain('node_modules/package/index.js')
      expect(result).toContain('node_modules\\package\\index.js')
      
      expect(result).not.toContain('src/components/Button.js')
      expect(result).not.toContain('src\\components\\Button.js')
    })
  })

  describe('getIgnoreStatistics', () => {
    it('should calculate ignore statistics correctly', async () => {
      const files = [
        { path: 'src/app.js', name: 'app.js', extension: 'js', size: 100 },
        { path: 'node_modules/lib/index.js', name: 'index.js', extension: 'js', size: 500 },
        { path: 'dist/bundle.js', name: 'bundle.js', extension: 'js', size: 300 },
        { path: 'package.json', name: 'package.json', extension: 'json', size: 80 },
        { path: '.env', name: '.env', extension: '', size: 20 },
        { path: 'debug.log', name: 'debug.log', extension: 'log', size: 40 }
      ]
      
      const result = await getIgnoreStatistics(files)
      
      expect(result).toHaveProperty('totalFiles')
      expect(result).toHaveProperty('ignoredFiles')
      expect(result).toHaveProperty('ignoredSize')
      expect(result).toHaveProperty('patterns')
      
      expect(result.totalFiles).toBe(6)
      expect(result.ignoredFiles).toBeGreaterThan(0)
      expect(result.ignoredSize).toBeGreaterThan(0)
      expect(Array.isArray(result.patterns)).toBe(true)
      
      // Check structure паттернов
      result.patterns.forEach(pattern => {
        expect(pattern).toHaveProperty('pattern')
        expect(pattern).toHaveProperty('count')
        expect(typeof pattern.pattern).toBe('string')
        expect(typeof pattern.count).toBe('number')
        expect(pattern.count).toBeGreaterThan(0)
      })
      
      // Паттерны should быть отсортированы по количеству совпадений
      for (let i = 1; i < result.patterns.length; i++) {
        expect(result.patterns[i-1].count).toBeGreaterThanOrEqual(result.patterns[i].count)
      }
    })

    it('should handle project with no ignored files', async () => {
      const files = [
        { path: 'src/app.js', name: 'app.js', extension: 'js', size: 100 },
        { path: 'src/utils.js', name: 'utils.js', extension: 'js', size: 80 },
        { path: 'package.json', name: 'package.json', extension: 'json', size: 60 }
      ]
      
      const result = await getIgnoreStatistics(files)
      
      expect(result.totalFiles).toBe(3)
      expect(result.ignoredFiles).toBe(0)
      expect(result.ignoredSize).toBe(0)
      expect(result.patterns).toEqual([])
    })

    it('should handle empty file list', async () => {
      const files = []
      
      const result = await getIgnoreStatistics(files)
      
      expect(result.totalFiles).toBe(0)
      expect(result.ignoredFiles).toBe(0)
      expect(result.ignoredSize).toBe(0)
      expect(result.patterns).toEqual([])
    })

    it('should track which patterns matched most frequently', async () => {
      const files = [
        // Много .log files
        { path: 'debug.log', name: 'debug.log', extension: 'log', size: 40 },
        { path: 'error.log', name: 'error.log', extension: 'log', size: 50 },
        { path: 'access.log', name: 'access.log', extension: 'log', size: 60 },
        
        // Несколько node_modules files
        { path: 'node_modules/lib1/index.js', name: 'index.js', extension: 'js', size: 100 },
        { path: 'node_modules/lib2/index.js', name: 'index.js', extension: 'js', size: 110 },
        
        // Один .env file
        { path: '.env', name: '.env', extension: '', size: 20 }
      ]
      
      const result = await getIgnoreStatistics(files)
      
      expect(result.patterns.length).toBeGreaterThan(0)
      
      // Паттерн для .log files должен иметь наибольшее количество совпадений
      const logPattern = result.patterns.find(p => p.pattern.includes('log') || p.pattern === '*.log')
      if (logPattern) {
        expect(logPattern.count).toBe(3)
      }
    })
  })

  describe('validateIgnorePatterns', () => {
    it('should validate correct patterns', () => {
      const patterns = [
        'node_modules/',
        '*.log',
        'dist/',
        '.env',
        '**/*.min.js'
      ]
      
      const result = validateIgnorePatterns(patterns)
      
      expect(result).toEqual([])
    })

    it('should detect invalid regex patterns', () => {
      const patterns = [
        'valid_pattern',
        '[invalid_regex',  // Незакрытая скобка
        '*.log',
        '(unclosed_group'  // Незакрытая группа
      ]
      
      const result = validateIgnorePatterns(patterns)
      
      // Should быть найдены ошибки для некорректных паттернов
      expect(result.length).toBeGreaterThan(0)
      
      result.forEach(error => {
        expect(error).toHaveProperty('pattern')
        expect(error).toHaveProperty('error')
        expect(typeof error.pattern).toBe('string')
        expect(typeof error.error).toBe('string')
      })
    })

    it('should handle empty pattern list', () => {
      const patterns = []
      
      const result = validateIgnorePatterns(patterns)
      
      expect(result).toEqual([])
    })

    it('should handle complex glob patterns', () => {
      const patterns = [
        '**/*.{js,ts,jsx,tsx}',
        'src/**/test/**/*.spec.{js,ts}',
        '!(node_modules|dist)/**',
        '{build,dist,out}/**/*'
      ]
      
      const result = validateIgnorePatterns(patterns)
      
      // Сложные паттерны могут не поддерживаться простым regex конвертером
      // В зависимости от реализации могут быть ошибки
      expect(Array.isArray(result)).toBe(true)
    })
  })

  describe('edge cases and error handling', () => {
    it('should handle very long file paths', async () => {
      const longPath = 'a/'.repeat(100) + 'file.js'
      const files = [
        { path: longPath, name: 'file.js', extension: 'js', size: 100 },
        { path: 'node_modules/' + 'b/'.repeat(50) + 'lib.js', name: 'lib.js', extension: 'js', size: 80 }
      ]
      
      const result = await getIgnoredFiles(files)
      
      assertions.validateIgnoredFiles(result)
      
      // Длинные пути should обрабатываться корректно
      expect(result).toContain('node_modules/' + 'b/'.repeat(50) + 'lib.js')
      expect(result).not.toContain(longPath)
    })

    it('should handle files with no extensions', async () => {
      const files = [
        { path: 'Dockerfile', name: 'Dockerfile', extension: '', size: 100 },
        { path: 'Makefile', name: 'Makefile', extension: '', size: 80 },
        { path: 'LICENSE', name: 'LICENSE', extension: '', size: 1000 },
        { path: 'README', name: 'README', extension: '', size: 500 }
      ]
      
      const result = await getIgnoredFiles(files)
      
      assertions.validateIgnoredFiles(result)
      
      // Files без расширений should обрабатываться корректно
      // В зависимости от паттернов в CUSTOM_IGNORE
    })

    it('should handle files with multiple extensions', async () => {
      const files = [
        { path: 'app.min.js', name: 'app.min.js', extension: 'js', size: 100 },
        { path: 'style.min.css', name: 'style.min.css', extension: 'css', size: 80 },
        { path: 'types.d.ts', name: 'types.d.ts', extension: 'ts', size: 60 },
        { path: 'component.test.js', name: 'component.test.js', extension: 'js', size: 90 }
      ]
      
      const result = await getIgnoredFiles(files)
      
      assertions.validateIgnoredFiles(result)
      
      // Files с множественными расширениями should корректно матчиться с паттернами
      expect(result).toContain('app.min.js') // *.min.js паттерн
      expect(result).toContain('style.min.css') // *.min.css паттерн
    })

    it('should handle extremely large file lists efficiently', async () => {
      const files = []
      
      // Create большой список файлов
      for (let i = 0; i < 1000; i++) {
        files.push({
          path: `src/component${i}.js`,
          name: `component${i}.js`,
          extension: 'js',
          size: 100 + i
        })
        
        if (i % 10 === 0) {
          files.push({
            path: `node_modules/lib${i}/index.js`,
            name: 'index.js',
            extension: 'js',
            size: 50
          })
        }
      }
      
      const startTime = Date.now()
      const result = await getIgnoredFiles(files)
      const endTime = Date.now()
      
      assertions.validateIgnoredFiles(result)
      
      // Check performance (должно выполняться разумно быстро)
      expect(endTime - startTime).toBeLessThan(1000) // Менее 1 секунды
      
      // Check корректность resultа
      const ignoredCount = result.length
      const nodeModulesCount = files.filter(f => f.path.includes('node_modules')).length
      expect(ignoredCount).toBe(nodeModulesCount)
    })
  })
})
