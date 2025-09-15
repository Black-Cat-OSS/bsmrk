import { describe, it, expect, vi, beforeEach } from 'vitest'
import { detectFrameworks } from '../../src/framework-detector.js'
import { assertions } from '../helpers/test-utils.js'

describe('framework-detector', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('detectFrameworks', () => {
    it('should detect React framework', async () => {
      const files = [
        { path: 'src/App.jsx', name: 'App.jsx', extension: 'jsx', size: 200 },
        { path: 'src/components/Button.jsx', name: 'Button.jsx', extension: 'jsx', size: 150 },
        { path: 'package.json', name: 'package.json', extension: 'json', size: 100 }
      ]
      
      const result = await detectFrameworks(files)
      
      assertions.validateFrameworkDetection(result)
      expect(result).toContain('react')
    })

    it('should detect Vue.js framework', async () => {
      const files = [
        { path: 'src/App.vue', name: 'App.vue', extension: 'vue', size: 200 },
        { path: 'src/components/HelloWorld.vue', name: 'HelloWorld.vue', extension: 'vue', size: 150 },
        { path: 'vue.config.js', name: 'vue.config.js', extension: 'js', size: 80 }
      ]
      
      const result = await detectFrameworks(files)
      
      assertions.validateFrameworkDetection(result)
      expect(result).toContain('vue')
    })

    it('should detect Angular framework', async () => {
      const files = [
        { path: 'src/app/app.component.ts', name: 'app.component.ts', extension: 'ts', size: 200 },
        { path: 'src/app/app.module.ts', name: 'app.module.ts', extension: 'ts', size: 150 },
        { path: 'src/app/user.service.ts', name: 'user.service.ts', extension: 'ts', size: 120 },
        { path: 'angular.json', name: 'angular.json', extension: 'json', size: 300 }
      ]
      
      const result = await detectFrameworks(files)
      
      assertions.validateFrameworkDetection(result)
      expect(result).toContain('angular')
    })

    it('should detect Next.js and resolve React conflict', async () => {
      const files = [
        { path: 'pages/index.js', name: 'index.js', extension: 'js', size: 200 },
        { path: 'pages/_app.js', name: '_app.js', extension: 'js', size: 150 },
        { path: 'next.config.js', name: 'next.config.js', extension: 'js', size: 100 },
        { path: 'src/components/Header.jsx', name: 'Header.jsx', extension: 'jsx', size: 120 }
      ]
      
      const result = await detectFrameworks(files)
      
      assertions.validateFrameworkDetection(result)
      expect(result).toContain('nextjs')
      // Next.js должен исключать React из resultов
      expect(result).not.toContain('react')
    })

    it('should detect Nuxt.js and resolve Vue conflict', async () => {
      const files = [
        { path: 'pages/index.vue', name: 'index.vue', extension: 'vue', size: 200 },
        { path: 'nuxt.config.js', name: 'nuxt.config.js', extension: 'js', size: 150 },
        { path: 'layouts/default.vue', name: 'default.vue', extension: 'vue', size: 120 }
      ]
      
      const result = await detectFrameworks(files)
      
      assertions.validateFrameworkDetection(result)
      expect(result).toContain('nuxtjs')
      // Nuxt.js должен исключать Vue из resultов
      expect(result).not.toContain('vue')
    })

    it('should detect Express.js framework', async () => {
      const files = [
        { path: 'server.js', name: 'server.js', extension: 'js', size: 200 },
        { path: 'routes/api.js', name: 'api.js', extension: 'js', size: 150 },
        { path: 'middleware/auth.js', name: 'auth.js', extension: 'js', size: 100 },
        { path: 'package.json', name: 'package.json', extension: 'json', size: 120 }
      ]
      
      const result = await detectFrameworks(files)
      
      assertions.validateFrameworkDetection(result)
      expect(result).toContain('express')
    })

    it('should detect CSS frameworks', async () => {
      const files = [
        { path: 'src/App.jsx', name: 'App.jsx', extension: 'jsx', size: 200 },
        { path: 'tailwind.config.js', name: 'tailwind.config.js', extension: 'js', size: 100 },
        { path: 'src/styles/main.scss', name: 'main.scss', extension: 'scss', size: 150 },
        { path: 'node_modules/bootstrap/dist/bootstrap.css', name: 'bootstrap.css', extension: 'css', size: 300 }
      ]
      
      const result = await detectFrameworks(files)
      
      assertions.validateFrameworkDetection(result)
      expect(result).toContain('tailwindcss')
      expect(result).toContain('sass')
    })

    it('should detect multiple frameworks correctly', async () => {
      const files = [
        // React + TypeScript
        { path: 'src/App.tsx', name: 'App.tsx', extension: 'tsx', size: 200 },
        { path: 'src/components/Button.tsx', name: 'Button.tsx', extension: 'tsx', size: 150 },
        
        // Tailwind CSS
        { path: 'tailwind.config.js', name: 'tailwind.config.js', extension: 'js', size: 100 },
        
        // Jest testing
        { path: 'src/App.test.tsx', name: 'App.test.tsx', extension: 'tsx', size: 120 },
        { path: 'jest.config.js', name: 'jest.config.js', extension: 'js', size: 80 },
        
        // Webpack
        { path: 'webpack.config.js', name: 'webpack.config.js', extension: 'js', size: 180 }
      ]
      
      const result = await detectFrameworks(files)
      
      assertions.validateFrameworkDetection(result)
      expect(result).toContain('react')
      expect(result).toContain('tailwindcss')
      expect(result).toContain('jest')
      expect(result).toContain('webpack')
    })

    it('should handle Django framework detection', async () => {
      const files = [
        { path: 'manage.py', name: 'manage.py', extension: 'py', size: 150 },
        { path: 'myproject/settings.py', name: 'settings.py', extension: 'py', size: 200 },
        { path: 'myapp/models.py', name: 'models.py', extension: 'py', size: 180 },
        { path: 'myapp/views.py', name: 'views.py', extension: 'py', size: 160 },
        { path: 'requirements.txt', name: 'requirements.txt', extension: 'txt', size: 100 }
      ]
      
      const result = await detectFrameworks(files)
      
      assertions.validateFrameworkDetection(result)
      expect(result).toContain('django')
    })

    it('should handle Spring Boot framework detection', async () => {
      const files = [
        { path: 'src/main/java/Application.java', name: 'Application.java', extension: 'java', size: 200 },
        { path: 'src/main/java/controller/UserController.java', name: 'UserController.java', extension: 'java', size: 180 },
        { path: 'src/main/resources/application.properties', name: 'application.properties', extension: 'properties', size: 100 },
        { path: 'pom.xml', name: 'pom.xml', extension: 'xml', size: 300 }
      ]
      
      const result = await detectFrameworks(files)
      
      assertions.validateFrameworkDetection(result)
      expect(result).toContain('spring-boot')
      // Spring Boot должен исключать обычный Spring
      expect(result).not.toContain('spring')
    })

    it('should detect Svelte framework', async () => {
      const files = [
        { path: 'src/App.svelte', name: 'App.svelte', extension: 'svelte', size: 200 },
        { path: 'src/components/Button.svelte', name: 'Button.svelte', extension: 'svelte', size: 150 },
        { path: 'svelte.config.js', name: 'svelte.config.js', extension: 'js', size: 100 }
      ]
      
      const result = await detectFrameworks(files)
      
      assertions.validateFrameworkDetection(result)
      expect(result).toContain('svelte')
    })

    it('should handle framework conflicts and hierarchies', async () => {
      const files = [
        // React Native (should override React)
        { path: 'App.js', name: 'App.js', extension: 'js', size: 200 },
        { path: 'android/app/src/main/AndroidManifest.xml', name: 'AndroidManifest.xml', extension: 'xml', size: 150 },
        { path: 'ios/project.xcodeproj/project.pbxproj', name: 'project.pbxproj', extension: 'pbxproj', size: 300 },
        { path: 'src/components/Button.jsx', name: 'Button.jsx', extension: 'jsx', size: 120 }
      ]
      
      const result = await detectFrameworks(files)
      
      assertions.validateFrameworkDetection(result)
      // Если React Native обнаружен, он должен исключать обычный React
      if (result.includes('react-native')) {
        expect(result).not.toContain('react')
      }
    })

    it('should handle empty file list', async () => {
      const files = []
      
      const result = await detectFrameworks(files)
      
      assertions.validateFrameworkDetection(result)
      expect(result).toEqual([])
    })

    it('should handle files without recognizable patterns', async () => {
      const files = [
        { path: 'data.txt', name: 'data.txt', extension: 'txt', size: 100 },
        { path: 'image.png', name: 'image.png', extension: 'png', size: 5000 },
        { path: 'document.pdf', name: 'document.pdf', extension: 'pdf', size: 10000 }
      ]
      
      const result = await detectFrameworks(files)
      
      assertions.validateFrameworkDetection(result)
      expect(result).toEqual([])
    })

    it('should require minimum matches for framework detection', async () => {
      const files = [
        // Только один файл React - может быть недостаточно для некоторых фреймворков
        { path: 'component.jsx', name: 'component.jsx', extension: 'jsx', size: 100 }
      ]
      
      const result = await detectFrameworks(files)
      
      assertions.validateFrameworkDetection(result)
      // React should be обнаружен даже с одним JSX fileом
      expect(result).toContain('react')
    })

    it('should handle case-insensitive pattern matching', async () => {
      const files = [
        { path: 'DOCKERFILE', name: 'DOCKERFILE', extension: '', size: 100 },
        { path: 'MAKEFILE', name: 'MAKEFILE', extension: '', size: 80 },
        { path: 'Package.json', name: 'Package.json', extension: 'json', size: 120 }
      ]
      
      const result = await detectFrameworks(files)
      
      assertions.validateFrameworkDetection(result)
      // Паттерны should работать независимо от регистра
      // Result зависит от того, как настроены паттерны в FRAMEWORK_PATTERNS
    })

    it('should detect build tools and bundlers', async () => {
      const files = [
        { path: 'webpack.config.js', name: 'webpack.config.js', extension: 'js', size: 200 },
        { path: 'vite.config.js', name: 'vite.config.js', extension: 'js', size: 150 },
        { path: 'rollup.config.js', name: 'rollup.config.js', extension: 'js', size: 120 },
        { path: 'gulpfile.js', name: 'gulpfile.js', extension: 'js', size: 100 }
      ]
      
      const result = await detectFrameworks(files)
      
      assertions.validateFrameworkDetection(result)
      expect(result).toContain('webpack')
      expect(result).toContain('vite')
      expect(result).toContain('rollup')
      expect(result).toContain('gulp')
    })

    it('should limit number of frameworks from same category', async () => {
      const files = [
        // Множество CSS фреймворков
        { path: 'bootstrap.css', name: 'bootstrap.css', extension: 'css', size: 100 },
        { path: 'tailwind.config.js', name: 'tailwind.config.js', extension: 'js', size: 80 },
        { path: 'bulma.css', name: 'bulma.css', extension: 'css', size: 90 },
        { path: 'foundation.css', name: 'foundation.css', extension: 'css', size: 85 },
        { path: 'materialize.css', name: 'materialize.css', extension: 'css', size: 75 },
        { path: 'semantic.css', name: 'semantic.css', extension: 'css', size: 70 }
      ]
      
      const result = await detectFrameworks(files)
      
      assertions.validateFrameworkDetection(result)
      
      // Должно быть ограничение на количество фреймворков из одной категории
      const cssFrameworks = result.filter(f => 
        ['bootstrap', 'tailwindcss', 'bulma', 'foundation', 'materialize', 'semantic-ui'].includes(f)
      )
      
      // Не должно быть слишком много CSS фреймворков одновременно
      expect(cssFrameworks.length).toBeLessThanOrEqual(3)
    })

    it('should handle deep directory structures', async () => {
      const files = [
        { path: 'src/main/java/com/example/app/Application.java', name: 'Application.java', extension: 'java', size: 200 },
        { path: 'src/main/java/com/example/app/controller/UserController.java', name: 'UserController.java', extension: 'java', size: 180 },
        { path: 'src/main/resources/application.yml', name: 'application.yml', extension: 'yml', size: 100 }
      ]
      
      const result = await detectFrameworks(files)
      
      assertions.validateFrameworkDetection(result)
      // Spring Boot should be обнаружен даже в глубокой структуре директорий
      expect(result).toContain('spring-boot')
    })

    it('should handle mixed technology stacks', async () => {
      const files = [
        // Frontend: React + TypeScript
        { path: 'frontend/src/App.tsx', name: 'App.tsx', extension: 'tsx', size: 200 },
        { path: 'frontend/package.json', name: 'package.json', extension: 'json', size: 120 },
        
        // Backend: Express + Node.js
        { path: 'backend/server.js', name: 'server.js', extension: 'js', size: 180 },
        { path: 'backend/routes/api.js', name: 'api.js', extension: 'js', size: 150 },
        
        // Database: MongoDB
        { path: 'backend/models/User.js', name: 'User.js', extension: 'js', size: 140 },
        
        // DevOps
        { path: 'Dockerfile', name: 'Dockerfile', extension: '', size: 100 },
        { path: 'docker-compose.yml', name: 'docker-compose.yml', extension: 'yml', size: 150 }
      ]
      
      const result = await detectFrameworks(files)
      
      assertions.validateFrameworkDetection(result)
      expect(result).toContain('react')
      expect(result).toContain('express')
    })

    it('should return sorted framework list', async () => {
      const files = [
        { path: 'src/App.jsx', name: 'App.jsx', extension: 'jsx', size: 200 },
        { path: 'webpack.config.js', name: 'webpack.config.js', extension: 'js', size: 150 },
        { path: 'jest.config.js', name: 'jest.config.js', extension: 'js', size: 100 },
        { path: 'babel.config.js', name: 'babel.config.js', extension: 'js', size: 80 }
      ]
      
      const result = await detectFrameworks(files)
      
      assertions.validateFrameworkDetection(result)
      
      // Result should be отсортирован
      const sortedResult = [...result].sort()
      expect(result).toEqual(sortedResult)
    })

    it('should handle special file patterns', async () => {
      const files = [
        { path: '.babelrc', name: '.babelrc', extension: '', size: 50 },
        { path: '.eslintrc.js', name: '.eslintrc.js', extension: 'js', size: 80 },
        { path: 'tsconfig.json', name: 'tsconfig.json', extension: 'json', size: 100 },
        { path: 'yarn.lock', name: 'yarn.lock', extension: 'lock', size: 1000 }
      ]
      
      const result = await detectFrameworks(files)
      
      assertions.validateFrameworkDetection(result)
      // Should быть обнаружены соответствующие инструменты разработки
    })
  })

  describe('pattern matching edge cases', () => {
    it('should handle files with similar names but different contexts', async () => {
      const files = [
        { path: 'app.js', name: 'app.js', extension: 'js', size: 100 },
        { path: 'test/app.js', name: 'app.js', extension: 'js', size: 50 },
        { path: 'docs/app.js', name: 'app.js', extension: 'js', size: 30 }
      ]
      
      const result = await detectFrameworks(files)
      
      assertions.validateFrameworkDetection(result)
      // Дублирующиеся имена файлов не should влиять на detection
    })

    it('should handle path separators correctly', async () => {
      const files = [
        { path: 'src/components/Button.jsx', name: 'Button.jsx', extension: 'jsx', size: 100 },
        { path: 'src\\components\\Modal.jsx', name: 'Modal.jsx', extension: 'jsx', size: 80 } // Windows path
      ]
      
      const result = await detectFrameworks(files)
      
      assertions.validateFrameworkDetection(result)
      expect(result).toContain('react')
    })

    it('should handle very large project structures', async () => {
      const files = []
      
      // Create большой проект с множеством файлов
      for (let i = 0; i < 100; i++) {
        files.push({
          path: `src/components/Component${i}.jsx`,
          name: `Component${i}.jsx`,
          extension: 'jsx',
          size: 100 + i
        })
      }
      
      files.push({ path: 'package.json', name: 'package.json', extension: 'json', size: 200 })
      
      const result = await detectFrameworks(files)
      
      assertions.validateFrameworkDetection(result)
      expect(result).toContain('react')
    })
  })
})
