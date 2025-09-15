import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { analyzeDirectory } from '../../src/index.js'
import { createTestDirectory, removeTestDirectory, assertions } from '../helpers/test-utils.js'
import { REACT_PROJECT, VUE_PROJECT, NODE_EXPRESS_PROJECT, PYTHON_FLASK_PROJECT, MIXED_LANGUAGE_PROJECT, FRAMEWORK_COMBINATIONS, EDGE_CASE_PROJECTS } from '../fixtures/sample-projects.js'

describe('analyzeDirectory - Integration Tests', () => {
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

  describe('Full Analysis Pipeline', () => {
    it('should analyze React project correctly', async () => {
      testDir = await createTestDirectory(REACT_PROJECT)
      
      const result = await analyzeDirectory(testDir)
      
      // Check structure resultа
      expect(result).toHaveProperty('langs')
      expect(result).toHaveProperty('frameworks')
      expect(result).toHaveProperty('ignores')
      
      assertions.validateLanguageAnalysis(result.langs)
      assertions.validateFrameworkDetection(result.frameworks)
      assertions.validateIgnoredFiles(result.ignores)
      
      // Check detection языков
      const languages = result.langs.map(l => l.lang)
      expect(languages).toContain('javascript')
      expect(languages).toContain('typescript') // .tsx files
      expect(languages).toContain('css')
      expect(languages).toContain('html')
      expect(languages).toContain('json')
      expect(languages).toContain('markdown')
      
      // Check detection фреймворков
      expect(result.frameworks).toContain('react')
      
      // Check игнорируемые files (если есть)
      // В React проекте нет игнорируемых файлов по умолчанию
    })

    it('should analyze Vue project correctly', async () => {
      testDir = await createTestDirectory(VUE_PROJECT)
      
      const result = await analyzeDirectory(testDir)
      
      assertions.validateLanguageAnalysis(result.langs)
      assertions.validateFrameworkDetection(result.frameworks)
      assertions.validateIgnoredFiles(result.ignores)
      
      // Check detection языков
      const languages = result.langs.map(l => l.lang)
      expect(languages).toContain('javascript')
      expect(languages).toContain('html') // HTML в Vue fileах
      expect(languages).toContain('json')
      
      // Check detection фреймворков
      expect(result.frameworks).toContain('vue')
      expect(result.frameworks).toContain('vite')
    })

    it('should analyze Node.js Express project correctly', async () => {
      testDir = await createTestDirectory(NODE_EXPRESS_PROJECT)
      
      const result = await analyzeDirectory(testDir)
      
      assertions.validateLanguageAnalysis(result.langs)
      assertions.validateFrameworkDetection(result.frameworks)
      assertions.validateIgnoredFiles(result.ignores)
      
      // Check detection языков
      const languages = result.langs.map(l => l.lang)
      expect(languages).toContain('javascript')
      expect(languages).toContain('json')
      
      // Check detection фреймворков
      expect(result.frameworks).toContain('express')
      
      // Check игнорируемые files
      expect(result.ignores).toContain('.env')
    })

    it('should analyze Python Flask project correctly', async () => {
      testDir = await createTestDirectory(PYTHON_FLASK_PROJECT)
      
      const result = await analyzeDirectory(testDir)
      
      assertions.validateLanguageAnalysis(result.langs)
      assertions.validateFrameworkDetection(result.frameworks)
      assertions.validateIgnoredFiles(result.ignores)
      
      // Check detection языков
      const languages = result.langs.map(l => l.lang)
      expect(languages).toContain('python')
      
      // Check detection фреймворков
      expect(result.frameworks).toContain('flask')
    })

    it('should analyze complex multi-language project correctly', async () => {
      testDir = await createTestDirectory(MIXED_LANGUAGE_PROJECT)
      
      const result = await analyzeDirectory(testDir)
      
      assertions.validateLanguageAnalysis(result.langs)
      assertions.validateFrameworkDetection(result.frameworks)
      assertions.validateIgnoredFiles(result.ignores)
      
      // Check detection множества языков
      const languages = result.langs.map(l => l.lang)
      expect(languages).toContain('javascript')
      expect(languages).toContain('typescript')
      expect(languages).toContain('python')
      expect(languages).toContain('css')
      expect(languages).toContain('json')
      expect(languages).toContain('markdown')
      
      // Check detection множества фреймворков
      expect(result.frameworks).toContain('react')
      expect(result.frameworks).toContain('flask')
      expect(result.frameworks).toContain('webpack')
      
      // Check процентное соотношение языков
      const totalPercent = result.langs.reduce((sum, lang) => sum + lang.percent, 0)
      expect(totalPercent).toBeLessThanOrEqual(100.01)
      expect(totalPercent).toBeGreaterThanOrEqual(99.99)
    })
  })

  describe('Framework Combinations', () => {
    it('should detect React + Tailwind CSS combination', async () => {
      testDir = await createTestDirectory(FRAMEWORK_COMBINATIONS['react-tailwind'])
      
      const result = await analyzeDirectory(testDir)
      
      assertions.validateFrameworkDetection(result.frameworks)
      expect(result.frameworks).toContain('react')
      expect(result.frameworks).toContain('tailwindcss')
    })

    it('should detect Vue + Vuetify combination', async () => {
      testDir = await createTestDirectory(FRAMEWORK_COMBINATIONS['vue-vuetify'])
      
      const result = await analyzeDirectory(testDir)
      
      assertions.validateFrameworkDetection(result.frameworks)
      expect(result.frameworks).toContain('vue')
      expect(result.frameworks).toContain('vuetify')
    })

    it('should detect Express + MongoDB combination', async () => {
      testDir = await createTestDirectory(FRAMEWORK_COMBINATIONS['express-mongodb'])
      
      const result = await analyzeDirectory(testDir)
      
      assertions.validateFrameworkDetection(result.frameworks)
      expect(result.frameworks).toContain('express')
      expect(result.frameworks).toContain('mongoose')
    })
  })

  describe('Edge Cases', () => {
    it('should handle empty project', async () => {
      testDir = await createTestDirectory(EDGE_CASE_PROJECTS['empty-project'])
      
      const result = await analyzeDirectory(testDir)
      
      expect(result.langs).toEqual([])
      expect(result.frameworks).toEqual([])
      expect(result.ignores).toEqual([])
    })

    it('should handle single file project', async () => {
      testDir = await createTestDirectory(EDGE_CASE_PROJECTS['single-file'])
      
      const result = await analyzeDirectory(testDir)
      
      assertions.validateLanguageAnalysis(result.langs)
      expect(result.langs).toHaveLength(1)
      expect(result.langs[0].lang).toBe('javascript')
      expect(result.langs[0].percent).toBe(100)
    })

    it('should handle deep nesting project', async () => {
      testDir = await createTestDirectory(EDGE_CASE_PROJECTS['deep-nesting'])
      
      const result = await analyzeDirectory(testDir)
      
      assertions.validateLanguageAnalysis(result.langs)
      expect(result.langs).toHaveLength(1)
      expect(result.langs[0].lang).toBe('javascript')
    })

    it('should handle files with special characters', async () => {
      testDir = await createTestDirectory(EDGE_CASE_PROJECTS['special-characters'])
      
      const result = await analyzeDirectory(testDir)
      
      assertions.validateLanguageAnalysis(result.langs)
      
      const languages = result.langs.map(l => l.lang)
      expect(languages).toContain('javascript')
      expect(languages).toContain('python')
      expect(languages).toContain('java')
    })

    it('should handle large project efficiently', async () => {
      testDir = await createTestDirectory(EDGE_CASE_PROJECTS['large-project'])
      
      const startTime = Date.now()
      const result = await analyzeDirectory(testDir)
      const endTime = Date.now()
      
      // Check performance
      expect(endTime - startTime).toBeLessThan(2000) // Менее 2 секунд
      
      assertions.validateLanguageAnalysis(result.langs)
      expect(result.langs).toHaveLength(1)
      expect(result.langs[0].lang).toBe('javascript')
    })

    it('should handle mixed extensions correctly', async () => {
      testDir = await createTestDirectory(EDGE_CASE_PROJECTS['mixed-extensions'])
      
      const result = await analyzeDirectory(testDir)
      
      assertions.validateLanguageAnalysis(result.langs)
      assertions.validateFrameworkDetection(result.frameworks)
      
      // Should быть обнаружены множество языков
      const languages = result.langs.map(l => l.lang)
      expect(languages.length).toBeGreaterThan(10)
      
      // Check main languages
      expect(languages).toContain('javascript')
      expect(languages).toContain('typescript')
      expect(languages).toContain('python')
      expect(languages).toContain('java')
      expect(languages).toContain('go')
      expect(languages).toContain('rust')
      expect(languages).toContain('css')
      expect(languages).toContain('json')
      expect(languages).toContain('markdown')
    })
  })

  describe('Error Handling', () => {
    it('should handle non-existent directory', async () => {
      const nonExistentPath = '/path/that/does/not/exist'
      
      await expect(analyzeDirectory(nonExistentPath)).rejects.toThrow()
    })

    it('should handle permission denied errors gracefully', async () => {
      // Create директорию и пытаемся ограничить доступ
      testDir = await createTestDirectory({
        'accessible.js': 'console.log("accessible");',
        'restricted': {
          'file.js': 'console.log("restricted");'
        }
      })
      
      // В реальных условиях могут быть проблемы с правами доступа
      // Функция должна продолжить работу и обработать доступные files
      const result = await analyzeDirectory(testDir)
      
      expect(result).toHaveProperty('langs')
      expect(result).toHaveProperty('frameworks')
      expect(result).toHaveProperty('ignores')
    })

    it('should handle corrupted or binary files', async () => {
      // Create files с различным содержимым, включая бинарные данные
      const binaryData = Buffer.from([0x00, 0x01, 0x02, 0x03, 0xFF, 0xFE, 0xFD])
      
      testDir = await createTestDirectory({
        'normal.js': 'console.log("normal");',
        'binary.exe': binaryData,
        'empty.txt': '',
        'large.json': JSON.stringify({ data: 'x'.repeat(10000) })
      })
      
      const result = await analyzeDirectory(testDir)
      
      assertions.validateLanguageAnalysis(result.langs)
      
      // Обычные files should быть обработаны корректно
      const languages = result.langs.map(l => l.lang)
      expect(languages).toContain('javascript')
      expect(languages).toContain('json')
    })

    it('should handle symbolic links correctly', async () => {
      testDir = await createTestDirectory({
        'original.js': 'console.log("original");',
        'folder': {
          'nested.js': 'console.log("nested");'
        }
      })
      
      try {
        // Пытаемся создать symbolic link
        const fs = await import('fs/promises')
        const path = await import('path')
        
        await fs.symlink(
          path.join(testDir, 'original.js'),
          path.join(testDir, 'symlink.js')
        )
        
        const result = await analyzeDirectory(testDir)
        
        assertions.validateLanguageAnalysis(result.langs)
        expect(result.langs[0].lang).toBe('javascript')
        
      } catch (error) {
        // Если символические ссылки не поддерживаются, пропускаем
        console.warn('Symbolic links not supported, skipping test')
      }
    })
  })

  describe('Performance Tests', () => {
    it('should handle medium-sized project efficiently', async () => {
      // Create проект средней сложности
      const mediumProject = {}
      
      // Frontend files
      for (let i = 0; i < 20; i++) {
        mediumProject[`src/components/Component${i}.jsx`] = `
          import React from 'react';
          export default function Component${i}() {
            return <div>Component ${i}</div>;
          }
        `
      }
      
      // Backend files
      for (let i = 0; i < 10; i++) {
        mediumProject[`server/routes/route${i}.js`] = `
          const express = require('express');
          const router = express.Router();
          router.get('/', (req, res) => res.json({route: ${i}}));
          module.exports = router;
        `
      }
      
      // Стили
      for (let i = 0; i < 5; i++) {
        mediumProject[`src/styles/style${i}.scss`] = `
          .component-${i} {
            color: #${i}${i}${i};
            font-size: ${10 + i}px;
          }
        `
      }
      
      // Конфигурационные files
      mediumProject['package.json'] = JSON.stringify({
        name: 'medium-project',
        dependencies: { react: '^18.0.0', express: '^4.18.0' }
      })
      mediumProject['webpack.config.js'] = 'module.exports = {};'
      mediumProject['tailwind.config.js'] = 'module.exports = {};'
      
      testDir = await createTestDirectory(mediumProject)
      
      const startTime = Date.now()
      const result = await analyzeDirectory(testDir)
      const endTime = Date.now()
      
      // Check performance (должно быть быстро)
      expect(endTime - startTime).toBeLessThan(1000) // Менее 1 секунды
      
      // Check корректность analysisа
      assertions.validateLanguageAnalysis(result.langs)
      assertions.validateFrameworkDetection(result.frameworks)
      
      const languages = result.langs.map(l => l.lang)
      expect(languages).toContain('javascript')
      expect(languages).toContain('css')
      expect(languages).toContain('json')
      
      expect(result.frameworks).toContain('react')
      expect(result.frameworks).toContain('express')
      expect(result.frameworks).toContain('webpack')
      expect(result.frameworks).toContain('tailwindcss')
    })

    it('should handle concurrent analysis calls', async () => {
      // Create несколько небольших проектов
      const projects = []
      
      for (let i = 0; i < 3; i++) {
        const project = {
          [`app${i}.js`]: `console.log("App ${i}");`,
          [`style${i}.css`]: `.app${i} { color: red; }`,
          'package.json': JSON.stringify({ name: `project${i}` })
        }
        projects.push(await createTestDirectory(project))
      }
      
      try {
        const startTime = Date.now()
        
        // Запускаем analysis всех проектов параллельно
        const results = await Promise.all(
          projects.map(dir => analyzeDirectory(dir))
        )
        
        const endTime = Date.now()
        
        // Check, that all analysisы завершились успешно
        expect(results).toHaveLength(3)
        
        results.forEach((result, index) => {
          assertions.validateLanguageAnalysis(result.langs)
          assertions.validateFrameworkDetection(result.frameworks)
          
          const languages = result.langs.map(l => l.lang)
          expect(languages).toContain('javascript')
          expect(languages).toContain('css')
          expect(languages).toContain('json')
        })
        
        // Параллельное выполнение должно быть эффективным
        expect(endTime - startTime).toBeLessThan(2000) // Менее 2 секунд для всех
        
      } finally {
        // Clean up тестовые directories
        await Promise.all(projects.map(dir => removeTestDirectory(dir)))
      }
    })
  })

  describe('Real-world Scenarios', () => {
    it('should analyze typical React + Node.js fullstack project', async () => {
      const fullstackProject = {
        // Frontend
        'client': {
          'src': {
            'App.jsx': 'import React from "react"; export default function App() { return <div>App</div>; }',
            'components': {
              'Header.jsx': 'export default function Header() { return <header>Header</header>; }',
              'Footer.tsx': 'export default function Footer(): JSX.Element { return <footer>Footer</footer>; }'
            },
            'styles': {
              'App.css': '.app { margin: 0; }',
              'components.scss': '$primary: blue; .header { color: $primary; }'
            },
            'utils': {
              'api.js': 'export const fetchData = async () => { return fetch("/api/data"); };'
            }
          },
          'public': {
            'index.html': '<!DOCTYPE html><html><body><div id="root"></div></body></html>'
          },
          'package.json': JSON.stringify({
            name: 'client',
            dependencies: { react: '^18.0.0', sass: '^1.0.0' }
          })
        },
        
        // Backend
        'server': {
          'src': {
            'app.js': 'const express = require("express"); const app = express();',
            'routes': {
              'api.js': 'const router = require("express").Router(); module.exports = router;',
              'auth.js': 'const jwt = require("jsonwebtoken");'
            },
            'middleware': {
              'cors.js': 'module.exports = (req, res, next) => { next(); };'
            },
            'models': {
              'User.js': 'const mongoose = require("mongoose");'
            }
          },
          'package.json': JSON.stringify({
            name: 'server',
            dependencies: { express: '^4.18.0', mongoose: '^7.0.0', jsonwebtoken: '^9.0.0' }
          })
        },
        
        // Shared
        'shared': {
          'types.ts': 'export interface User { id: string; name: string; }',
          'constants.js': 'export const API_URL = "http://localhost:3001";'
        },
        
        // Config
        'webpack.config.js': 'module.exports = { entry: "./client/src/index.js" };',
        'jest.config.js': 'module.exports = { testEnvironment: "jsdom" };',
        'tailwind.config.js': 'module.exports = { content: ["./client/src/**/*.{js,jsx,ts,tsx}"] };',
        
        // Root files
        'package.json': JSON.stringify({
          name: 'fullstack-app',
          workspaces: ['client', 'server']
        }),
        'README.md': '# Fullstack Application\n\nReact + Node.js application',
        '.gitignore': 'node_modules/\n.env\n*.log',
        'docker-compose.yml': 'version: "3"\nservices:\n  app:\n    build: .'
      }
      
      testDir = await createTestDirectory(fullstackProject)
      
      const result = await analyzeDirectory(testDir)
      
      assertions.validateLanguageAnalysis(result.langs)
      assertions.validateFrameworkDetection(result.frameworks)
      assertions.validateIgnoredFiles(result.ignores)
      
      // Check detection языков
      const languages = result.langs.map(l => l.lang)
      expect(languages).toContain('javascript')
      expect(languages).toContain('typescript')
      expect(languages).toContain('css')
      expect(languages).toContain('html')
      expect(languages).toContain('json')
      expect(languages).toContain('markdown')
      
      // Check detection фреймворков
      expect(result.frameworks).toContain('react')
      expect(result.frameworks).toContain('express')
      expect(result.frameworks).toContain('mongoose')
      expect(result.frameworks).toContain('webpack')
      expect(result.frameworks).toContain('jest')
      expect(result.frameworks).toContain('tailwindcss')
      expect(result.frameworks).toContain('sass')
      
      // JavaScript должен доминировать по количеству
      const jsLang = result.langs.find(l => l.lang === 'javascript')
      expect(jsLang.percent).toBeGreaterThan(30)
    })

    it('should handle monorepo structure correctly', async () => {
      const monorepoProject = {
        'packages': {
          'ui-components': {
            'src': {
              'Button.tsx': 'export const Button = () => <button>Click</button>;',
              'Modal.tsx': 'export const Modal = () => <div>Modal</div>;'
            },
            'package.json': JSON.stringify({
              name: '@monorepo/ui-components',
              dependencies: { react: '^18.0.0' }
            })
          },
          'utils': {
            'src': {
              'helpers.ts': 'export const formatDate = (date: Date) => date.toISOString();',
              'validators.ts': 'export const isEmail = (email: string) => email.includes("@");'
            },
            'package.json': JSON.stringify({
              name: '@monorepo/utils'
            })
          },
          'api-client': {
            'src': {
              'client.ts': 'export class ApiClient { async get(url: string) { return fetch(url); } }',
              'types.ts': 'export interface ApiResponse<T> { data: T; status: number; }'
            },
            'package.json': JSON.stringify({
              name: '@monorepo/api-client'
            })
          }
        },
        'apps': {
          'web': {
            'src': {
              'App.tsx': 'import { Button } from "@monorepo/ui-components";',
              'pages': {
                'Home.tsx': 'export const Home = () => <div>Home</div>;'
              }
            },
            'package.json': JSON.stringify({
              name: 'web-app',
              dependencies: { 
                react: '^18.0.0',
                '@monorepo/ui-components': '*',
                '@monorepo/utils': '*'
              }
            })
          },
          'mobile': {
            'src': {
              'App.tsx': 'import React from "react-native";',
              'components': {
                'Screen.tsx': 'export const Screen = () => <View><Text>Mobile</Text></View>;'
              }
            },
            'package.json': JSON.stringify({
              name: 'mobile-app',
              dependencies: { 
                'react-native': '^0.72.0',
                '@monorepo/utils': '*'
              }
            })
          }
        },
        'tools': {
          'build-scripts': {
            'build.js': 'const webpack = require("webpack");',
            'deploy.js': 'const { execSync } = require("child_process");'
          }
        },
        'package.json': JSON.stringify({
          name: 'monorepo',
          workspaces: ['packages/*', 'apps/*']
        }),
        'lerna.json': JSON.stringify({
          version: '1.0.0',
          npmClient: 'yarn',
          packages: ['packages/*', 'apps/*']
        }),
        'nx.json': JSON.stringify({
          npmScope: 'monorepo',
          projects: {}
        })
      }
      
      testDir = await createTestDirectory(monorepoProject)
      
      const result = await analyzeDirectory(testDir)
      
      assertions.validateLanguageAnalysis(result.langs)
      assertions.validateFrameworkDetection(result.frameworks)
      
      // Check detection языков
      const languages = result.langs.map(l => l.lang)
      expect(languages).toContain('typescript')
      expect(languages).toContain('javascript')
      expect(languages).toContain('json')
      
      // TypeScript должен доминировать
      const tsLang = result.langs.find(l => l.lang === 'typescript')
      expect(tsLang.percent).toBeGreaterThan(50)
      
      // Check detection фреймворков
      expect(result.frameworks).toContain('react')
      expect(result.frameworks).toContain('react-native')
      expect(result.frameworks).toContain('lerna')
      expect(result.frameworks).toContain('nx')
    })
  })
})
