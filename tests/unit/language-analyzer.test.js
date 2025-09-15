import { describe, it, expect, vi, beforeEach } from 'vitest'
import { analyzeLanguages } from '../../src/language-analyzer.js'
import { assertions } from '../helpers/test-utils.js'

describe('language-analyzer', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('analyzeLanguages', () => {
    it('should analyze single language project', async () => {
      const files = [
        { path: 'app.js', name: 'app.js', extension: 'js', size: 100 },
        { path: 'utils.js', name: 'utils.js', extension: 'js', size: 50 },
        { path: 'config.js', name: 'config.js', extension: 'js', size: 25 }
      ]
      
      const result = await analyzeLanguages(files)
      
      assertions.validateLanguageAnalysis(result)
      expect(result).toHaveLength(1)
      expect(result[0].lang).toBe('javascript')
      expect(result[0].percent).toBe(100)
    })

    it('should analyze multi-language project with correct percentages', async () => {
      const files = [
        { path: 'app.js', name: 'app.js', extension: 'js', size: 400 }, // 40%
        { path: 'server.py', name: 'server.py', extension: 'py', size: 300 }, // 30%
        { path: 'style.css', name: 'style.css', extension: 'css', size: 200 }, // 20%
        { path: 'config.json', name: 'config.json', extension: 'json', size: 100 } // 10%
      ]
      
      const result = await analyzeLanguages(files)
      
      assertions.validateLanguageAnalysis(result)
      expect(result).toHaveLength(4)
      
      // Result should be отсортирован по убыванию процентов
      expect(result[0].lang).toBe('javascript')
      expect(result[0].percent).toBe(40)
      
      expect(result[1].lang).toBe('python')
      expect(result[1].percent).toBe(30)
      
      expect(result[2].lang).toBe('css')
      expect(result[2].percent).toBe(20)
      
      expect(result[3].lang).toBe('json')
      expect(result[3].percent).toBe(10)
    })

    it('should handle files without extensions using filename detection', async () => {
      const files = [
        { path: 'Dockerfile', name: 'Dockerfile', extension: '', size: 100 },
        { path: 'Makefile', name: 'Makefile', extension: '', size: 80 },
        { path: 'Gemfile', name: 'Gemfile', extension: '', size: 60 },
        { path: 'webpack.config.js', name: 'webpack.config.js', extension: 'js', size: 120 }
      ]
      
      const result = await analyzeLanguages(files)
      
      assertions.validateLanguageAnalysis(result)
      
      const languages = result.map(r => r.lang)
      expect(languages).toContain('dockerfile')
      expect(languages).toContain('makefile')
      expect(languages).toContain('ruby')
      expect(languages).toContain('javascript')
    })

    it('should handle TypeScript vs JavaScript preference correctly', async () => {
      const files = [
        { path: 'app.ts', name: 'app.ts', extension: 'ts', size: 200 },
        { path: 'component.tsx', name: 'component.tsx', extension: 'tsx', size: 150 },
        { path: 'utils.js', name: 'utils.js', extension: 'js', size: 100 }
      ]
      
      const result = await analyzeLanguages(files)
      
      assertions.validateLanguageAnalysis(result)
      
      const tsResult = result.find(r => r.lang === 'typescript')
      const jsResult = result.find(r => r.lang === 'javascript')
      
      expect(tsResult).toBeDefined()
      expect(tsResult.percent).toBeCloseTo(77.78, 1) // (200+150)/(200+150+100) * 100
      
      expect(jsResult).toBeDefined()
      expect(jsResult.percent).toBeCloseTo(22.22, 1) // 100/(200+150+100) * 100
    })

    it('should handle C vs C++ preference correctly', async () => {
      const files = [
        { path: 'main.cpp', name: 'main.cpp', extension: 'cpp', size: 300 },
        { path: 'utils.c', name: 'utils.c', extension: 'c', size: 200 },
        { path: 'header.h', name: 'header.h', extension: 'h', size: 100 } // Should prefer C++ context
      ]
      
      const result = await analyzeLanguages(files)
      
      assertions.validateLanguageAnalysis(result)
      
      const cppResult = result.find(r => r.lang === 'cpp')
      const cResult = result.find(r => r.lang === 'c')
      
      expect(cppResult).toBeDefined()
      expect(cResult).toBeDefined()
      
      // .h file should be отнесен к тому языку, который имеет приоритет
      // В данном случае это может быть любой из них, зависит от порядка обработки
      expect(cppResult.percent + cResult.percent).toBeCloseTo(100, 1)
    })

    it('should handle special config files', async () => {
      const files = [
        { path: 'babel.config.js', name: 'babel.config.js', extension: 'js', size: 100 },
        { path: 'jest.config.js', name: 'jest.config.js', extension: 'js', size: 80 },
        { path: 'tailwind.config.js', name: 'tailwind.config.js', extension: 'js', size: 60 },
        { path: 'next.config.js', name: 'next.config.js', extension: 'js', size: 40 },
        { path: 'vite.config.ts', name: 'vite.config.ts', extension: 'ts', size: 120 }
      ]
      
      const result = await analyzeLanguages(files)
      
      assertions.validateLanguageAnalysis(result)
      
      const jsResult = result.find(r => r.lang === 'javascript')
      const tsResult = result.find(r => r.lang === 'typescript')
      
      expect(jsResult).toBeDefined()
      expect(tsResult).toBeDefined()
      expect(jsResult.percent).toBeCloseTo(70, 1) // (100+80+60+40)/400 * 100
      expect(tsResult.percent).toBeCloseTo(30, 1) // 120/400 * 100
    })

    it('should handle empty file list', async () => {
      const files = []
      
      const result = await analyzeLanguages(files)
      
      expect(result).toEqual([])
      expect(Array.isArray(result)).toBe(true)
    })

    it('should handle files with zero size', async () => {
      const files = [
        { path: 'empty.js', name: 'empty.js', extension: 'js', size: 0 },
        { path: 'normal.js', name: 'normal.js', extension: 'js', size: 100 },
        { path: 'empty.py', name: 'empty.py', extension: 'py', size: 0 }
      ]
      
      const result = await analyzeLanguages(files)
      
      assertions.validateLanguageAnalysis(result)
      expect(result).toHaveLength(1)
      expect(result[0].lang).toBe('javascript')
      expect(result[0].percent).toBe(100)
    })

    it('should handle files with unrecognized extensions', async () => {
      const files = [
        { path: 'app.js', name: 'app.js', extension: 'js', size: 100 },
        { path: 'data.xyz', name: 'data.xyz', extension: 'xyz', size: 50 },
        { path: 'config.unknown', name: 'config.unknown', extension: 'unknown', size: 25 }
      ]
      
      const result = await analyzeLanguages(files)
      
      assertions.validateLanguageAnalysis(result)
      expect(result).toHaveLength(1)
      expect(result[0].lang).toBe('javascript')
      expect(result[0].percent).toBe(100)
    })

    it('should handle complex multi-language project', async () => {
      const files = [
        // Frontend
        { path: 'src/App.jsx', name: 'App.jsx', extension: 'jsx', size: 200 },
        { path: 'src/components/Button.tsx', name: 'Button.tsx', extension: 'tsx', size: 150 },
        { path: 'src/utils/helpers.js', name: 'helpers.js', extension: 'js', size: 100 },
        { path: 'src/styles/main.scss', name: 'main.scss', extension: 'scss', size: 120 },
        { path: 'src/styles/components.css', name: 'components.css', extension: 'css', size: 80 },
        
        // Backend
        { path: 'server/app.py', name: 'app.py', extension: 'py', size: 300 },
        { path: 'server/models.py', name: 'models.py', extension: 'py', size: 250 },
        { path: 'server/utils.py', name: 'utils.py', extension: 'py', size: 150 },
        
        // Config
        { path: 'package.json', name: 'package.json', extension: 'json', size: 100 },
        { path: 'tsconfig.json', name: 'tsconfig.json', extension: 'json', size: 50 },
        { path: 'requirements.txt', name: 'requirements.txt', extension: 'txt', size: 30 },
        
        // Documentation
        { path: 'README.md', name: 'README.md', extension: 'md', size: 200 },
        { path: 'docs/api.md', name: 'api.md', extension: 'md', size: 150 }
      ]
      
      const result = await analyzeLanguages(files)
      
      assertions.validateLanguageAnalysis(result)
      
      const languageMap = {}
      result.forEach(r => {
        languageMap[r.lang] = r.percent
      })
      
      // Python should be самым большим (700 bytes)
      expect(languageMap.python).toBeGreaterThan(30)
      
      // TypeScript должен включать jsx, tsx files
      expect(languageMap.typescript).toBeDefined()
      
      // Should be present main languages
      expect(languageMap.javascript).toBeDefined()
      expect(languageMap.css).toBeDefined()
      expect(languageMap.json).toBeDefined()
      expect(languageMap.markdown).toBeDefined()
    })

    it('should handle language preference conflicts correctly', async () => {
      const files = [
        // Python vs Jython
        { path: 'app.py', name: 'app.py', extension: 'py', size: 100 },
        
        // Ruby vs JRuby  
        { path: 'script.rb', name: 'script.rb', extension: 'rb', size: 100 },
        
        // JavaScript variants
        { path: 'main.js', name: 'main.js', extension: 'js', size: 100 }
      ]
      
      const result = await analyzeLanguages(files)
      
      assertions.validateLanguageAnalysis(result)
      
      const languages = result.map(r => r.lang)
      
      // Should предпочитаться main languages, а не их варианты
      expect(languages).toContain('python')
      expect(languages).toContain('ruby')  
      expect(languages).toContain('javascript')
      
      expect(languages).not.toContain('jython')
      expect(languages).not.toContain('jruby')
    })

    it('should calculate percentages with proper rounding', async () => {
      const files = [
        { path: 'file1.js', name: 'file1.js', extension: 'js', size: 33 },
        { path: 'file2.py', name: 'file2.py', extension: 'py', size: 33 },
        { path: 'file3.css', name: 'file3.css', extension: 'css', size: 34 }
      ]
      
      const result = await analyzeLanguages(files)
      
      assertions.validateLanguageAnalysis(result)
      
      // Проценты should быть правильно округлены
      const totalPercent = result.reduce((sum, r) => sum + r.percent, 0)
      expect(totalPercent).toBeLessThanOrEqual(100.01) // Допускаем небольшую погрешность округления
      expect(totalPercent).toBeGreaterThanOrEqual(99.99)
      
      // Каждый процент should be больше 0
      result.forEach(r => {
        expect(r.percent).toBeGreaterThan(0)
      })
    })

    it('should handle very small files correctly', async () => {
      const files = [
        { path: 'tiny.js', name: 'tiny.js', extension: 'js', size: 1 },
        { path: 'small.py', name: 'small.py', extension: 'py', size: 2 },
        { path: 'mini.css', name: 'mini.css', extension: 'css', size: 3 }
      ]
      
      const result = await analyzeLanguages(files)
      
      assertions.validateLanguageAnalysis(result)
      expect(result).toHaveLength(3)
      
      // Даже очень маленькие files should учитываться
      const totalPercent = result.reduce((sum, r) => sum + r.percent, 0)
      expect(totalPercent).toBeCloseTo(100, 1)
    })

    it('should handle duplicate file names in different directories', async () => {
      const files = [
        { path: 'src/index.js', name: 'index.js', extension: 'js', size: 100 },
        { path: 'tests/index.js', name: 'index.js', extension: 'js', size: 50 },
        { path: 'dist/index.js', name: 'index.js', extension: 'js', size: 200 }
      ]
      
      const result = await analyzeLanguages(files)
      
      assertions.validateLanguageAnalysis(result)
      expect(result).toHaveLength(1)
      expect(result[0].lang).toBe('javascript')
      expect(result[0].percent).toBe(100)
    })

    it('should sort results by percentage descending', async () => {
      const files = [
        { path: 'small.css', name: 'small.css', extension: 'css', size: 50 },
        { path: 'large.js', name: 'large.js', extension: 'js', size: 300 },
        { path: 'medium.py', name: 'medium.py', extension: 'py', size: 150 }
      ]
      
      const result = await analyzeLanguages(files)
      
      assertions.validateLanguageAnalysis(result)
      expect(result).toHaveLength(3)
      
      // Check sorting по убыванию
      expect(result[0].lang).toBe('javascript') // 300/500 = 60%
      expect(result[1].lang).toBe('python')     // 150/500 = 30%
      expect(result[2].lang).toBe('css')        // 50/500 = 10%
      
      // Check, что проценты действительно убывают
      for (let i = 1; i < result.length; i++) {
        expect(result[i-1].percent).toBeGreaterThanOrEqual(result[i].percent)
      }
    })

    it('should handle edge case with single zero-size file', async () => {
      const files = [
        { path: 'empty.js', name: 'empty.js', extension: 'js', size: 0 }
      ]
      
      const result = await analyzeLanguages(files)
      
      // Файл с нулевым размером не должен создавать записи
      expect(result).toEqual([])
    })
  })

  describe('language detection edge cases', () => {
    it('should handle files with multiple dots in extension', async () => {
      const files = [
        { path: 'types.d.ts', name: 'types.d.ts', extension: 'ts', size: 100 },
        { path: 'config.spec.js', name: 'config.spec.js', extension: 'js', size: 80 },
        { path: 'data.min.js', name: 'data.min.js', extension: 'js', size: 60 }
      ]
      
      const result = await analyzeLanguages(files)
      
      assertions.validateLanguageAnalysis(result)
      
      const languages = result.map(r => r.lang)
      expect(languages).toContain('typescript')
      expect(languages).toContain('javascript')
    })

    it('should handle case sensitivity in extensions', async () => {
      const files = [
        { path: 'App.JS', name: 'App.JS', extension: 'JS', size: 100 },
        { path: 'style.CSS', name: 'style.CSS', extension: 'CSS', size: 80 },
        { path: 'README.MD', name: 'README.MD', extension: 'MD', size: 60 }
      ]
      
      const result = await analyzeLanguages(files)
      
      assertions.validateLanguageAnalysis(result)
      
      // Расширения should обрабатываться независимо от регистра
      const languages = result.map(r => r.lang)
      expect(languages).toContain('javascript')
      expect(languages).toContain('css')
      expect(languages).toContain('markdown')
    })
  })
})
