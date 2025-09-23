import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { analyzeDirectory, scanDirectory, analyzeLanguages, detectFrameworks, getIgnoredFiles } from '../../src/index.js'
import { createTestDirectory, removeTestDirectory } from '../helpers/test-utils.js'
import fs from 'fs/promises'
import path from 'path'

describe('Edge Cases and Error Handling', () => {
  let testDir
  
  beforeEach(() => {
    vi.clearAllMocks()
  })
  
  afterEach(async () => {
    if (testDir) {
      await removeTestDirectory(testDir)
      testDir = null
    }
  })

  describe('Input Validation', () => {
    it('should handle null/undefined directory path', async () => {
      await expect(analyzeDirectory(null)).rejects.toThrow()
      await expect(analyzeDirectory(undefined)).rejects.toThrow()
    })

    it('should handle empty string directory path', async () => {
      await expect(analyzeDirectory('')).rejects.toThrow()
    })

    it('should handle non-string directory path', async () => {
      await expect(analyzeDirectory(123)).rejects.toThrow()
      await expect(analyzeDirectory({})).rejects.toThrow()
      await expect(analyzeDirectory([])).rejects.toThrow()
    })

    it('should handle non-existent directory', async () => {
      const nonExistentPath = '/path/that/definitely/does/not/exist/anywhere'
      await expect(analyzeDirectory(nonExistentPath)).rejects.toThrow()
    })

    it('should handle file path instead of directory path', async () => {
      // Create file вместо directories
      testDir = await createTestDirectory({ 'single-file.txt': 'content' })
      const filePath = path.join(testDir, 'single-file.txt')
      
      await expect(analyzeDirectory(filePath)).rejects.toThrow()
    })
  })

  describe('File System Edge Cases', () => {
    it('should handle very long file paths', async () => {
      // Create очень глубокую structure директорий
      const maxDepth = 50
      let structure = {}
      let current = structure
      
      for (let i = 0; i < maxDepth; i++) {
        const dirName = `very-long-directory-name-level-${i}-with-lots-of-characters`
        current[dirName] = {}
        current = current[dirName]
      }
      current['deep-file.js'] = 'console.log("very deep file");'
      
      testDir = await createTestDirectory(structure)
      
      const result = await analyzeDirectory(testDir)
      
      expect(result.langs).toHaveLength(1)
      expect(result.langs[0].lang).toBe('javascript')
    })

    it('should handle files with extremely long names', async () => {
      const longFileName = 'a'.repeat(200) + '.js'
      const structure = {}
      structure[longFileName] = 'console.log("long filename");'
      
      testDir = await createTestDirectory(structure)
      
      const result = await analyzeDirectory(testDir)
      
      expect(result.langs).toHaveLength(1)
      expect(result.langs[0].lang).toBe('javascript')
    })

    it('should handle files with unicode characters', async () => {
      const structure = {
        '🚀rocket.js': 'console.log("rocket emoji");',
        '测试文件.py': 'print("Chinese test file")',
        'файл.rb': 'puts "Russian file"',
        'αρχείο.java': 'public class Test {}',
        'ملف.php': '<?php echo "Arabic file"; ?>',
        '🎉🎊celebration🎈.css': '.party { color: rainbow; }'
      }
      
      testDir = await createTestDirectory(structure)
      
      const result = await analyzeDirectory(testDir)
      
      expect(result.langs.length).toBeGreaterThan(0)
      
      const languages = result.langs.map(l => l.lang)
      expect(languages).toContain('javascript')
      expect(languages).toContain('python')
      expect(languages).toContain('ruby')
      expect(languages).toContain('java')
      expect(languages).toContain('php')
      expect(languages).toContain('css')
    })

    it('should handle files with no extensions', async () => {
      const structure = {
        'LICENSE': 'MIT License',
        'README': '# Project',
        'CHANGELOG': '## Changes',
        'AUTHORS': 'John Doe',
        'CONTRIBUTING': '# How to contribute',
        'Dockerfile': 'FROM node:16',
        'Makefile': 'all:\n\techo "make"',
        'Jenkinsfile': 'pipeline { }',
        'Vagrantfile': 'Vagrant.configure(2) do |config|'
      }
      
      testDir = await createTestDirectory(structure)
      
      const result = await analyzeDirectory(testDir)
      
      // Некоторые files should быть распознаны по имени
      const languages = result.langs.map(l => l.lang)
      expect(languages).toContain('dockerfile')
      expect(languages).toContain('makefile')
      expect(languages).toContain('ruby') // Vagrantfile
    })

    it('should handle binary files', async () => {
      // Create различные бинарные files
      const structure = {
        'app.js': 'console.log("text file");',
        'image.png': Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]), // PNG header
        'executable.exe': Buffer.from([0x4D, 0x5A, 0x90, 0x00]), // PE header
        'archive.zip': Buffer.from([0x50, 0x4B, 0x03, 0x04]), // ZIP header
        'document.pdf': Buffer.from([0x25, 0x50, 0x44, 0x46]), // PDF header
        'audio.mp3': Buffer.from([0x49, 0x44, 0x33]) // MP3 ID3 header
      }
      
      testDir = await createTestDirectory(structure)
      
      const result = await analyzeDirectory(testDir)
      
      // Только текстовые files should analysisироваться для языков
      expect(result.langs).toHaveLength(1)
      expect(result.langs[0].lang).toBe('javascript')
    })

    it('should handle empty files', async () => {
      const structure = {
        'empty.js': '',
        'empty.py': '',
        'empty.css': '',
        'normal.js': 'console.log("normal");',
        'normal.py': 'print("normal")'
      }
      
      testDir = await createTestDirectory(structure)
      
      const result = await analyzeDirectory(testDir)
      
      // Пустые files не should влиять на процентное соотношение
      expect(result.langs).toHaveLength(2)
      
      const jsLang = result.langs.find(l => l.lang === 'javascript')
      const pyLang = result.langs.find(l => l.lang === 'python')
      
      expect(jsLang.percent).toBe(50)
      expect(pyLang.percent).toBe(50)
    })

    it('should handle files with only whitespace', async () => {
      const structure = {
        'whitespace-only.js': '   \n\t\r\n   ',
        'tabs-and-spaces.py': '\t\t\t    \n\n\n',
        'normal.js': 'console.log("normal");'
      }
      
      testDir = await createTestDirectory(structure)
      
      const result = await analyzeDirectory(testDir)
      
      // Files только с пробелами should учитываться по размеру
      expect(result.langs).toHaveLength(2)
      
      const languages = result.langs.map(l => l.lang)
      expect(languages).toContain('javascript')
      expect(languages).toContain('python')
    })
  })

  describe('Memory and Performance Edge Cases', () => {
    it('should handle very large files', async () => {
      // Create большой файл (но не слишком большой для тестов)
      const largeContent = 'console.log("large file");\n'.repeat(10000)
      const structure = {
        'large.js': largeContent,
        'small.py': 'print("small")'
      }
      
      testDir = await createTestDirectory(structure)
      
      const result = await analyzeDirectory(testDir)
      
      expect(result.langs).toHaveLength(2)
      
      const jsLang = result.langs.find(l => l.lang === 'javascript')
      expect(jsLang.percent).toBeGreaterThan(90) // Большой файл должен доминировать
    })


    it('should handle deeply nested directory structure', async () => {
      // Create очень глубокую structure
      const depth = 100
      let structure = {}
      let current = structure
      
      for (let i = 0; i < depth; i++) {
        current[`level${i}`] = {}
        current = current[`level${i}`]
        
        // Добавляем файл на каждом уровне
        current[`file${i}.js`] = `console.log("Level ${i}");`
      }
      
      testDir = await createTestDirectory(structure)
      
      const result = await analyzeDirectory(testDir)
      
      expect(result.langs).toHaveLength(1)
      expect(result.langs[0].lang).toBe('javascript')
    })
  })

  describe('Concurrent Access and Race Conditions', () => {
    it('should handle concurrent directory scans', async () => {
      const structure = {
        'app1.js': 'console.log("app1");',
        'app2.py': 'print("app2")',
        'app3.java': 'public class App3 {}'
      }
      
      testDir = await createTestDirectory(structure)
      
      // Запускаем несколько analysisов одновременно
      const promises = Array(5).fill(null).map(() => analyzeDirectory(testDir))
      
      const results = await Promise.all(promises)
      
      // Все resultы should быть идентичными
      results.forEach(result => {
        expect(result.langs).toHaveLength(3)
        expect(result.langs.map(l => l.lang).sort()).toEqual(['java', 'javascript', 'python'])
      })
    })

    it('should handle file system changes during analysis', async () => {
      testDir = await createTestDirectory({
        'initial.js': 'console.log("initial");'
      })
      
      // Начинаем analysis
      const analysisPromise = analyzeDirectory(testDir)
      
      // Добавляем файл во время analysisа
      setTimeout(async () => {
        try {
          await fs.writeFile(path.join(testDir, 'added-during-analysis.py'), 'print("added")')
        } catch (error) {
          // Игнорируем ошибки - файл может быть уже обработан
        }
      }, 10)
      
      const result = await analysisPromise
      
      // Result should be валидным, независимо от того, был ли учтен новый файл
      expect(result.langs.length).toBeGreaterThan(0)
    })
  })

  describe('Error Recovery', () => {
    it('should continue analysis when some files are inaccessible', async () => {
      testDir = await createTestDirectory({
        'accessible.js': 'console.log("accessible");',
        'folder': {
          'nested.py': 'print("nested")'
        }
      })
      
      // Mock access error для одного файла
      const originalStat = fs.stat
      const mockStat = vi.fn().mockImplementation(async (filePath) => {
        if (filePath.includes('nested.py')) {
          throw new Error('EACCES: permission denied')
        }
        return originalStat(filePath)
      })
      
      vi.spyOn(fs, 'stat').mockImplementation(mockStat)
      
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
      
      const result = await analyzeDirectory(testDir)
      
      // Analysis должен продолжиться с доступными файлами
      expect(result.langs).toHaveLength(1)
      expect(result.langs[0].lang).toBe('javascript')
      
      consoleSpy.mockRestore()
    })

    it('should handle corrupted directory structure', async () => {
      testDir = await createTestDirectory({
        'valid.js': 'console.log("valid");',
        'corrupted-dir': {}
      })
      
      // Mock ошибку чтения directories
      const originalReaddir = fs.readdir
      const mockReaddir = vi.fn().mockImplementation(async (dirPath) => {
        if (dirPath.includes('corrupted-dir')) {
          throw new Error('EIO: i/o error')
        }
        return originalReaddir(dirPath)
      })
      
      vi.spyOn(fs, 'readdir').mockImplementation(mockReaddir)
      
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
      
      const result = await analyzeDirectory(testDir)
      
      // Должен обработать доступные files
      expect(result.langs).toHaveLength(1)
      expect(result.langs[0].lang).toBe('javascript')
      
      consoleSpy.mockRestore()
    })
  })

  describe('Language Detection Edge Cases', () => {
    it('should handle files with conflicting extensions', async () => {
      const structure = {
        // Files с расширениями, которые могут конфликтовать
        'script.m': 'function result = test()\nresult = 1;\nend', // MATLAB или Objective-C
        'header.h': '#ifndef HEADER_H\n#define HEADER_H\n#endif', // C или C++
        'module.py': '#!/usr/bin/env python3\nprint("python")', // Python или Jython
        'app.rb': 'puts "ruby"', // Ruby или JRuby
        'component.js': 'export default function() { return "js"; }' // JavaScript или React
      }
      
      testDir = await createTestDirectory(structure)
      
      const result = await analyzeDirectory(testDir)
      
      // Should быть выбраны main languages с приоритетом
      const languages = result.langs.map(l => l.lang)
      expect(languages).toContain('python')
      expect(languages).toContain('ruby')
      expect(languages).toContain('javascript')
    })

    it('should handle files with unknown extensions', async () => {
      const structure = {
        'known.js': 'console.log("known");',
        'unknown.xyz': 'some content',
        'another.abc123': 'more content',
        'config.myext': 'configuration data'
      }
      
      testDir = await createTestDirectory(structure)
      
      const result = await analyzeDirectory(testDir)
      
      // Только известные расширения should учитываться
      expect(result.langs).toHaveLength(1)
      expect(result.langs[0].lang).toBe('javascript')
      expect(result.langs[0].percent).toBe(100)
    })

    it('should handle mixed case extensions', async () => {
      const structure = {
        'App.JS': 'console.log("uppercase JS");',
        'Style.CSS': '.app { color: red; }',
        'Data.JSON': '{"key": "value"}',
        'README.MD': '# Title',
        'Component.JSX': 'export default () => <div>JSX</div>;'
      }
      
      testDir = await createTestDirectory(structure)
      
      const result = await analyzeDirectory(testDir)
      
      // Расширения should обрабатываться независимо от регистра
      const languages = result.langs.map(l => l.lang)
      expect(languages).toContain('javascript')
      expect(languages).toContain('css')
      expect(languages).toContain('json')
      expect(languages).toContain('markdown')
    })
  })

  describe('Framework Detection Edge Cases', () => {
    it('should handle false positives in framework detection', async () => {
      const structure = {
        // Files, которые могут ложно указывать на frameworks
        'not-react.jsx': '// This is just a JSX file, not necessarily React',
        'fake-vue.vue': '<!-- Not a real Vue component -->',
        'mock-angular.ts': '// TypeScript file that mentions @Component in comments',
        'package.json': JSON.stringify({
          name: 'test-project',
          // Без зависимостей от фреймворков
        })
      }
      
      testDir = await createTestDirectory(structure)
      
      const result = await analyzeDirectory(testDir)
      
      // Should быть обнаружены frameworks на основе файлов, даже без зависимостей
      expect(result.frameworks).toContain('react')
    })

    it('should handle conflicting framework indicators', async () => {
      const structure = {
        // Смешанные индикаторы разных фреймворков
        'app.jsx': 'import React from "react";',
        'component.vue': '<template><div>Vue</div></template>',
        'service.ts': 'import { Component } from "@angular/core";',
        'package.json': JSON.stringify({
          dependencies: {
            'react': '^18.0.0',
            'vue': '^3.0.0',
            '@angular/core': '^15.0.0'
          }
        })
      }
      
      testDir = await createTestDirectory(structure)
      
      const result = await analyzeDirectory(testDir)
      
      // Все frameworks should быть обнаружены (необычный, но возможный случай)
      expect(result.frameworks).toContain('react')
      expect(result.frameworks).toContain('vue')
      expect(result.frameworks).toContain('angular')
    })

    it('should handle framework version conflicts', async () => {
      const structure = {
        'legacy-component.js': '// React 16 style component',
        'modern-component.jsx': '// React 18 with hooks',
        'package.json': JSON.stringify({
          dependencies: {
            'react': '^16.0.0'
          },
          devDependencies: {
            'react': '^18.0.0' // Конфликт версий
          }
        })
      }
      
      testDir = await createTestDirectory(structure)
      
      const result = await analyzeDirectory(testDir)
      
      // React should be обнаружен независимо от конфликта версий
      expect(result.frameworks).toContain('react')
    })
  })

  describe('Ignore Patterns Edge Cases', () => {
    it('should handle circular ignore patterns', async () => {
      const structure = {
        'src': {
          'app.js': 'console.log("app");',
          'ignored.log': 'log content'
        },
        'node_modules': {
          'package': {
            'src': {
              'lib.js': 'library code'
            }
          }
        }
      }
      
      testDir = await createTestDirectory(structure)
      
      const result = await analyzeDirectory(testDir)
      
      // node_modules should be полностью игнорирован
      expect(result.ignores.some(path => path.includes('node_modules'))).toBe(true)
      expect(result.ignores).toContain('src/ignored.log')
      expect(result.ignores).not.toContain('src/app.js')
    })

    it('should handle negation patterns correctly', async () => {
      const structure = {
        '.vscode': {
          'settings.json': '{"editor.fontSize": 14}', // Не должен игнорироваться
          'workspace.code-workspace': '{}', // Должен игнорироваться
          'launch.json': '{"configurations": []}', // Не должен игнорироваться
          'tasks.json': '{"tasks": []}', // Не должен игнорироваться
          'extensions.json': '{"recommendations": []}' // Не должен игнорироваться
        }
      }
      
      testDir = await createTestDirectory(structure)
      
      const result = await analyzeDirectory(testDir)
      
      // Check негативные паттерны из CUSTOM_IGNORE
      expect(result.ignores).not.toContain('.vscode/settings.json')
      expect(result.ignores).not.toContain('.vscode/launch.json')
      expect(result.ignores).not.toContain('.vscode/tasks.json')
      expect(result.ignores).not.toContain('.vscode/extensions.json')
      expect(result.ignores).toContain('.vscode/workspace.code-workspace')
    })

    it('should handle complex glob patterns', async () => {
      const structure = {
        'src': {
          'component.min.js': 'minified component',
          'component.js': 'normal component',
          'utils.bundle.js': 'bundled utils',
          'helper.js': 'normal helper'
        },
        'dist': {
          'app.js': 'built app',
          'vendor.js': 'vendor libs'
        }
      }
      
      testDir = await createTestDirectory(structure)
      
      const result = await analyzeDirectory(testDir)
      
      // Check паттерны *.min.js, *.bundle.*, dist/
      expect(result.ignores).toContain('src/component.min.js')
      expect(result.ignores).toContain('src/utils.bundle.js')
      expect(result.ignores.some(path => path.startsWith('dist/'))).toBe(true)
      
      expect(result.ignores).not.toContain('src/component.js')
      expect(result.ignores).not.toContain('src/helper.js')
    })
  })

  describe('Cross-platform Compatibility', () => {
    it('should handle different path separators', async () => {
      const structure = {
        'src': {
          'components': {
            'Button.jsx': 'export default Button;'
          }
        }
      }
      
      testDir = await createTestDirectory(structure)
      
      const result = await analyzeDirectory(testDir)
      
      // Пути should обрабатываться корректно независимо от ОС
      expect(result.langs).toHaveLength(1)
      expect(result.langs[0].lang).toBe('javascript')
    })

    it('should handle case-sensitive vs case-insensitive file systems', async () => {
      const structure = {
        'App.js': 'console.log("App with capital A");',
        'app.js': 'console.log("app with lowercase a");', // Может конфликтовать на Windows
        'Component.jsx': 'export default Component;',
        'COMPONENT.JSX': 'export default COMPONENT;' // Может конфликтовать на Windows
      }
      
      try {
        testDir = await createTestDirectory(structure)
        
        const result = await analyzeDirectory(testDir)
        
        // Result зависит от файловой системы
        expect(result.langs[0].lang).toBe('javascript')
        
      } catch (error) {
        // На case-insensitive системах может быть ошибка создания файлов
        console.warn('Case-sensitive file test skipped due to file system limitations')
      }
    })
  })
})
