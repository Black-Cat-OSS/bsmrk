import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { analyzeDirectory, scanDirectory, analyzeLanguages, detectFrameworks } from '../../src/index.js'
import { createTestDirectory, removeTestDirectory, generateFileContent } from '../helpers/test-utils.js'

describe('Performance Tests', () => {
  let testDirs = []
  
  beforeEach(() => {
    vi.clearAllMocks()
  })
  
  afterEach(async () => {
    // Clean up все созданные тестовые directories
    await Promise.all(testDirs.map(dir => removeTestDirectory(dir)))
    testDirs = []
  })

  describe('Scalability Tests', () => {
    it('should handle small project (< 100 files) quickly', async () => {
      const structure = {}
      
      // Create 50 files различных типов
      for (let i = 0; i < 20; i++) {
        structure[`src/component${i}.jsx`] = generateFileContent('js', 200)
        structure[`src/style${i}.css`] = generateFileContent('css', 150)
      }
      
      for (let i = 0; i < 10; i++) {
        structure[`server/route${i}.js`] = generateFileContent('js', 300)
      }
      
      const testDir = await createTestDirectory(structure)
      testDirs.push(testDir)
      
      const startTime = performance.now()
      const result = await analyzeDirectory(testDir)
      const endTime = performance.now()
      
      const duration = endTime - startTime
      
      // Должно выполняться очень быстро
      expect(duration).toBeLessThan(500) // Менее 500мwith expect(result.langs.length).toBeGreaterThan(0)
      expect(result.frameworks).toContain('react')
    })

    it('should handle medium project (100-1000 files) efficiently', async () => {
      const structure = {}
      
      // Create проект среднего размера
      for (let i = 0; i < 200; i++) {
        structure[`src/components/Component${i}.tsx`] = generateFileContent('ts', 250)
      }
      
      for (let i = 0; i < 100; i++) {
        structure[`src/utils/util${i}.js`] = generateFileContent('js', 180)
      }
      
      for (let i = 0; i < 50; i++) {
        structure[`src/styles/style${i}.scss`] = generateFileContent('css', 200)
      }
      
      for (let i = 0; i < 30; i++) {
        structure[`server/api/endpoint${i}.js`] = generateFileContent('js', 300)
      }
      
      for (let i = 0; i < 20; i++) {
        structure[`tests/unit/test${i}.spec.js`] = generateFileContent('js', 150)
      }
      
      // Добавляем конфигурационные files
      structure['package.json'] = JSON.stringify({
        name: 'medium-project',
        dependencies: { react: '^18.0.0', express: '^4.18.0' }
      })
      structure['webpack.config.js'] = generateFileContent('js', 300)
      structure['jest.config.js'] = generateFileContent('js', 200)
      
      const testDir = await createTestDirectory(structure)
      testDirs.push(testDir)
      
      const startTime = performance.now()
      const result = await analyzeDirectory(testDir)
      const endTime = performance.now()
      
      const duration = endTime - startTime
      
      // Должно выполняться за разумное время
      expect(duration).toBeLessThan(2000) // Менее 2 секунд
      
      expect(result.langs.length).toBeGreaterThan(2)
      expect(result.frameworks.length).toBeGreaterThan(2)
      
      const languages = result.langs.map(l => l.lang)
      expect(languages).toContain('typescript')
      expect(languages).toContain('javascript')
      expect(languages).toContain('css')
    })

    it('should handle large project (1000+ files) within reasonable time', async () => {
      const structure = {}
      
      // Create большой проект
      for (let i = 0; i < 500; i++) {
        structure[`src/components/Component${i}.tsx`] = generateFileContent('ts', 300)
      }
      
      for (let i = 0; i < 300; i++) {
        structure[`src/pages/Page${i}.jsx`] = generateFileContent('js', 250)
      }
      
      for (let i = 0; i < 200; i++) {
        structure[`src/hooks/use${i}.ts`] = generateFileContent('ts', 200)
      }
      
      for (let i = 0; i < 100; i++) {
        structure[`server/controllers/Controller${i}.js`] = generateFileContent('js', 400)
      }
      
      for (let i = 0; i < 50; i++) {
        structure[`server/models/Model${i}.js`] = generateFileContent('js', 350)
      }
      
      for (let i = 0; i < 100; i++) {
        structure[`src/styles/components/component${i}.scss`] = generateFileContent('css', 150)
      }
      
      const testDir = await createTestDirectory(structure)
      testDirs.push(testDir)
      
      const startTime = performance.now()
      const result = await analyzeDirectory(testDir)
      const endTime = performance.now()
      
      const duration = endTime - startTime
      
      // Даже для большого проекта должно быть приемлемое время
      expect(duration).toBeLessThan(5000) // Менее 5 секунд
      
      expect(result.langs.length).toBeGreaterThan(2)
      expect(result.frameworks.length).toBeGreaterThan(2)
      
      // Check корректность процентного соотношения
      const totalPercent = result.langs.reduce((sum, lang) => sum + lang.percent, 0)
      expect(totalPercent).toBeLessThanOrEqual(100.01)
    }, 10000) // Увеличиваем timeout для этого теста

    it('should handle very deep directory nesting efficiently', async () => {
      const structure = {}
      let current = structure
      
      // Create очень глубокую structure (50 уровней)
      for (let depth = 0; depth < 50; depth++) {
        const dirName = `level${depth}`
        current[dirName] = {}
        current = current[dirName]
        
        // Добавляем files на каждом уровне
        current[`file${depth}.js`] = generateFileContent('js', 100 + depth)
        current[`style${depth}.css`] = generateFileContent('css', 80 + depth)
      }
      
      const testDir = await createTestDirectory(structure)
      testDirs.push(testDir)
      
      const startTime = performance.now()
      const result = await analyzeDirectory(testDir)
      const endTime = performance.now()
      
      const duration = endTime - startTime
      
      // Глубокая вложенность не должна сильно влиять на performance
      expect(duration).toBeLessThan(1000) // Менее 1 секунды
      
      expect(result.langs).toHaveLength(2)
      expect(result.langs.map(l => l.lang)).toContain('javascript')
      expect(result.langs.map(l => l.lang)).toContain('css')
    })

    it('should handle wide directory structure efficiently', async () => {
      const structure = {}
      
      // Create широкую structure (много файлов в одной directories)
      for (let i = 0; i < 1000; i++) {
        structure[`file${i}.js`] = generateFileContent('js', 100)
      }
      
      const testDir = await createTestDirectory(structure)
      testDirs.push(testDir)
      
      const startTime = performance.now()
      const result = await analyzeDirectory(testDir)
      const endTime = performance.now()
      
      const duration = endTime - startTime
      
      // Много файлов в одной directories
      expect(duration).toBeLessThan(2000) // Менее 2 секунд
      
      expect(result.langs).toHaveLength(1)
      expect(result.langs[0].lang).toBe('javascript')
      expect(result.langs[0].percent).toBe(100)
    })
  })

  describe('Memory Usage Tests', () => {
    it('should handle large files without excessive memory usage', async () => {
      const structure = {}
      
      // Create несколько больших файлов
      for (let i = 0; i < 5; i++) {
        structure[`large${i}.js`] = generateFileContent('js', 50000) // ~50KB каждый
      }
      
      const testDir = await createTestDirectory(structure)
      testDirs.push(testDir)
      
      const memBefore = process.memoryUsage().heapUsed
      
      const result = await analyzeDirectory(testDir)
      
      const memAfter = process.memoryUsage().heapUsed
      const memDiff = memAfter - memBefore
      
      // Не должно использовать слишком много памяти
      expect(memDiff).toBeLessThan(10 * 1024 * 1024) // Менее 10MB
      
      expect(result.langs).toHaveLength(1)
      expect(result.langs[0].lang).toBe('javascript')
    })

    it('should handle many small files efficiently', async () => {
      const structure = {}
      
      // Create много маленьких файлов
      for (let i = 0; i < 2000; i++) {
        structure[`small${i}.js`] = `console.log("File ${i}");`
      }
      
      const testDir = await createTestDirectory(structure)
      testDirs.push(testDir)
      
      const memBefore = process.memoryUsage().heapUsed
      const startTime = performance.now()
      
      const result = await analyzeDirectory(testDir)
      
      const endTime = performance.now()
      const memAfter = process.memoryUsage().heapUsed
      
      const duration = endTime - startTime
      const memDiff = memAfter - memBefore
      
      // Должно быть быстро и не использовать много памяти
      expect(duration).toBeLessThan(3000) // Менее 3 секунд
      expect(memDiff).toBeLessThan(50 * 1024 * 1024) // Менее 50MB
      
      expect(result.langs).toHaveLength(1)
      expect(result.langs[0].lang).toBe('javascript')
    }, 10000)
  })

  describe('Component Performance Tests', () => {
    it('should scan directory efficiently', async () => {
      const structure = {}
      
      for (let i = 0; i < 500; i++) {
        structure[`file${i}.js`] = generateFileContent('js', 200)
      }
      
      const testDir = await createTestDirectory(structure)
      testDirs.push(testDir)
      
      const startTime = performance.now()
      const files = await scanDirectory(testDir)
      const endTime = performance.now()
      
      const duration = endTime - startTime
      
      expect(duration).toBeLessThan(1000) // Менее 1 секунды
      expect(files).toHaveLength(500)
      
      files.forEach(file => {
        expect(file).toHaveProperty('path')
        expect(file).toHaveProperty('name')
        expect(file).toHaveProperty('extension')
        expect(file).toHaveProperty('size')
      })
    })

    it('should analyze languages efficiently', async () => {
      const files = []
      
      // Create большой массив файлов for analysisа
      for (let i = 0; i < 1000; i++) {
        files.push({
          path: `file${i}.js`,
          name: `file${i}.js`,
          extension: 'js',
          size: 100 + (i % 50)
        })
      }
      
      for (let i = 0; i < 500; i++) {
        files.push({
          path: `style${i}.css`,
          name: `style${i}.css`,
          extension: 'css',
          size: 80 + (i % 30)
        })
      }
      
      const startTime = performance.now()
      const result = await analyzeLanguages(files)
      const endTime = performance.now()
      
      const duration = endTime - startTime
      
      expect(duration).toBeLessThan(100) // Менее 100мwith expect(result).toHaveLength(2)
      
      const jsLang = result.find(l => l.lang === 'javascript')
      const cssLang = result.find(l => l.lang === 'css')
      
      expect(jsLang.percent).toBeGreaterThan(cssLang.percent)
    })

    it('should detect frameworks efficiently', async () => {
      const files = []
      
      // Create files с различными паттернами фреймворков
      const frameworks = ['react', 'vue', 'angular', 'express', 'django', 'spring']
      
      for (let i = 0; i < 200; i++) {
        const framework = frameworks[i % frameworks.length]
        
        switch (framework) {
          case 'react':
            files.push({ path: `component${i}.jsx`, name: `component${i}.jsx`, extension: 'jsx', size: 200 })
            break
          case 'vue':
            files.push({ path: `component${i}.vue`, name: `component${i}.vue`, extension: 'vue', size: 180 })
            break
          case 'angular':
            files.push({ path: `component${i}.component.ts`, name: `component${i}.component.ts`, extension: 'ts', size: 220 })
            break
          case 'express':
            files.push({ path: `route${i}.js`, name: `route${i}.js`, extension: 'js', size: 150 })
            break
          case 'django':
            files.push({ path: `view${i}.py`, name: `view${i}.py`, extension: 'py', size: 190 })
            break
          case 'spring':
            files.push({ path: `Controller${i}.java`, name: `Controller${i}.java`, extension: 'java', size: 250 })
            break
        }
      }
      
      // Добавляем конфигурационные files
      files.push({ path: 'package.json', name: 'package.json', extension: 'json', size: 500 })
      files.push({ path: 'angular.json', name: 'angular.json', extension: 'json', size: 300 })
      files.push({ path: 'vue.config.js', name: 'vue.config.js', extension: 'js', size: 200 })
      
      const startTime = performance.now()
      const result = await detectFrameworks(files)
      const endTime = performance.now()
      
      const duration = endTime - startTime
      
      expect(duration).toBeLessThan(200) // Менее 200мwith expect(result.length).toBeGreaterThan(3)
      
      expect(result).toContain('react')
      expect(result).toContain('vue')
      expect(result).toContain('angular')
    })
  })

  describe('Concurrent Performance Tests', () => {
    it('should handle multiple concurrent analyses', async () => {
      const projects = []
      
      // Create несколько проектов для параллельного analysisа
      for (let p = 0; p < 3; p++) {
        const structure = {}
        
        for (let i = 0; i < 100; i++) {
          structure[`file${i}.js`] = generateFileContent('js', 150)
          structure[`style${i}.css`] = generateFileContent('css', 100)
        }
        
        const testDir = await createTestDirectory(structure)
        testDirs.push(testDir)
        projects.push(testDir)
      }
      
      const startTime = performance.now()
      
      // Запускаем analysisы параллельно
      const promises = projects.map(dir => analyzeDirectory(dir))
      const results = await Promise.all(promises)
      
      const endTime = performance.now()
      const duration = endTime - startTime
      
      // Параллельное выполнение должно быть эффективнее последовательного
      expect(duration).toBeLessThan(3000) // Менее 3 секунд для всех
      
      expect(results).toHaveLength(3)
      
      results.forEach(result => {
        expect(result.langs).toHaveLength(2)
        expect(result.langs.map(l => l.lang)).toContain('javascript')
        expect(result.langs.map(l => l.lang)).toContain('css')
      })
    })

    it('should maintain performance under load', async () => {
      const structure = {}
      
      for (let i = 0; i < 200; i++) {
        structure[`component${i}.tsx`] = generateFileContent('ts', 300)
      }
      
      const testDir = await createTestDirectory(structure)
      testDirs.push(testDir)
      
      const iterations = 5
      const durations = []
      
      // Выполняем несколько итераций подряд
      for (let i = 0; i < iterations; i++) {
        const startTime = performance.now()
        await analyzeDirectory(testDir)
        const endTime = performance.now()
        
        durations.push(endTime - startTime)
      }
      
      // Все итерации should выполняться за разумное время
      durations.forEach(duration => {
        expect(duration).toBeLessThan(2000) // Менее 2 секунд
      })
      
      // Performance не должна деградировать
      const avgDuration = durations.reduce((sum, d) => sum + d, 0) / durations.length
      const maxDuration = Math.max(...durations)
      
      expect(maxDuration).toBeLessThan(avgDuration * 1.5) // Максимум не более чем в 1.5 раза больше среднего
    })
  })

  describe('Real-world Performance Scenarios', () => {
    it('should handle typical React project efficiently', async () => {
      const structure = {
        'src': {},
        'public': {},
        'node_modules': {}
      }
      
      // Create типичную structure React проекта
      for (let i = 0; i < 50; i++) {
        structure.src[`Component${i}.jsx`] = generateFileContent('js', 250)
        structure.src[`Component${i}.css`] = generateFileContent('css', 150)
      }
      
      for (let i = 0; i < 20; i++) {
        structure.src[`hook${i}.ts`] = generateFileContent('ts', 200)
      }
      
      // Добавляем node_modules (будут игнорироваться)
      for (let i = 0; i < 100; i++) {
        if (!structure.node_modules[`package${i}`]) {
          structure.node_modules[`package${i}`] = {}
        }
        structure.node_modules[`package${i}`]['index.js'] = generateFileContent('js', 300)
      }
      
      structure['package.json'] = JSON.stringify({
        name: 'react-project',
        dependencies: { react: '^18.0.0' }
      })
      
      const testDir = await createTestDirectory(structure)
      testDirs.push(testDir)
      
      const startTime = performance.now()
      const result = await analyzeDirectory(testDir)
      const endTime = performance.now()
      
      const duration = endTime - startTime
      
      // Типичный React проект должен analysisироваться быстро
      expect(duration).toBeLessThan(1500) // Менее 1.5 секунд
      
      expect(result.frameworks).toContain('react')
      
      const languages = result.langs.map(l => l.lang)
      expect(languages).toContain('javascript')
      expect(languages).toContain('typescript')
      expect(languages).toContain('css')
      
      // node_modules files не should влиять на result
      const totalFiles = result.langs.reduce((sum, lang) => sum + (lang.fileCount || 0), 0)
      expect(totalFiles).toBeLessThan(200) // Меньше, чем если бы учитывались node_modules
    })

    it('should handle monorepo structure efficiently', async () => {
      const structure = {
        'packages': {
          'ui': {},
          'utils': {},
          'api': {}
        },
        'apps': {
          'web': {},
          'mobile': {}
        }
      }
      
      // Заполняем каждый пакет
      const packages = ['ui', 'utils', 'api']
      packages.forEach(pkg => {
        for (let i = 0; i < 30; i++) {
          structure.packages[pkg][`file${i}.ts`] = generateFileContent('ts', 200)
        }
        structure.packages[pkg]['package.json'] = JSON.stringify({ name: `@monorepo/${pkg}` })
      })
      
      // Заполняем приложения
      const apps = ['web', 'mobile']
      apps.forEach(app => {
        for (let i = 0; i < 40; i++) {
          structure.apps[app][`component${i}.tsx`] = generateFileContent('ts', 250)
        }
        structure.apps[app]['package.json'] = JSON.stringify({ name: app })
      })
      
      structure['package.json'] = JSON.stringify({
        name: 'monorepo',
        workspaces: ['packages/*', 'apps/*']
      })
      
      const testDir = await createTestDirectory(structure)
      testDirs.push(testDir)
      
      const startTime = performance.now()
      const result = await analyzeDirectory(testDir)
      const endTime = performance.now()
      
      const duration = endTime - startTime
      
      // Monorepo должен analysisироваться эффективно
      expect(duration).toBeLessThan(2000) // Менее 2 секунд
      
      expect(result.langs.length).toBeGreaterThan(1)
      
      const languages = result.langs.map(l => l.lang)
      expect(languages).toContain('typescript')
      expect(languages).toContain('json')
    })
  })

  describe('Performance Regression Tests', () => {
    it('should not degrade with repeated analyses', async () => {
      const structure = {}
      
      for (let i = 0; i < 300; i++) {
        structure[`file${i}.js`] = generateFileContent('js', 200)
      }
      
      const testDir = await createTestDirectory(structure)
      testDirs.push(testDir)
      
      const measurements = []
      
      // Выполняем 10 analysisов подряд
      for (let i = 0; i < 10; i++) {
        const startTime = performance.now()
        await analyzeDirectory(testDir)
        const endTime = performance.now()
        
        measurements.push(endTime - startTime)
      }
      
      // Все измерения should быть в разумных пределах
      measurements.forEach((duration, index) => {
        expect(duration).toBeLessThan(2000) // Менее 2 секунд
      })
      
      // Не должно быть значительной деградации производительности
      const firstHalf = measurements.slice(0, 5)
      const secondHalf = measurements.slice(5)
      
      const avgFirstHalf = firstHalf.reduce((sum, d) => sum + d, 0) / firstHalf.length
      const avgSecondHalf = secondHalf.reduce((sum, d) => sum + d, 0) / secondHalf.length
      
      // Вторая половина не should be значительно медленнее первой
      expect(avgSecondHalf).toBeLessThan(avgFirstHalf * 1.3)
    })
  })
})
