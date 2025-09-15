import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/**
 * Creates a temporary directory with test files
 * @param {Object} structure - File and directory structure
 * @param {string} basePath - Base path (optional)
 * @returns {Promise<string>} - Path to created directory
 */
export async function createTestDirectory(structure, basePath = null) {
  const testDir = basePath || path.join(__dirname, '..', 'fixtures', 'temp', `test-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`)
  
  await fs.mkdir(testDir, { recursive: true })
  await createStructure(testDir, structure)
  
  return testDir
}

/**
 * Recursively creates file and folder structure
 * @param {string} basePath - Base path
 * @param {Object} structure - Structure
 */
async function createStructure(basePath, structure) {
  for (const [name, content] of Object.entries(structure)) {
    const fullPath = path.join(basePath, name)
    
    if (typeof content === 'object' && content !== null && !Buffer.isBuffer(content)) {
      // Это директория
      await fs.mkdir(fullPath, { recursive: true })
      await createStructure(fullPath, content)
    } else {
      // Это файл
      const dir = path.dirname(fullPath)
      await fs.mkdir(dir, { recursive: true })
      
      if (typeof content === 'string') {
        await fs.writeFile(fullPath, content, 'utf8')
      } else if (Buffer.isBuffer(content)) {
        await fs.writeFile(fullPath, content)
      } else {
        // Пустой файл
        await fs.writeFile(fullPath, '', 'utf8')
      }
    }
  }
}

/**
 * Удаляет временную директорию
 * @param {string} dirPath - Путь к directories
 */
export async function removeTestDirectory(dirPath) {
  try {
    await fs.rm(dirPath, { recursive: true, force: true })
  } catch (error) {
    // Игнорируем ошибки удаления в тестах
    console.warn(`Warning: Could not remove test directory ${dirPath}: ${error.message}`)
  }
}

/**
 * Создает мок файловой системы для тестирования
 * @param {Object} files - Структура файлов
 * @returns {Object} - Мок объект
 */
export function createFileSystemMock(files) {
  const mockFiles = new Map()
  
  function addFiles(structure, basePath = '') {
    for (const [name, content] of Object.entries(structure)) {
      const fullPath = path.join(basePath, name).replace(/\\/g, '/')
      
      if (typeof content === 'object' && content !== null) {
        mockFiles.set(fullPath, { isDirectory: true, content: null })
        addFiles(content, fullPath)
      } else {
        mockFiles.set(fullPath, { isDirectory: false, content, size: (content || '').length })
      }
    }
  }
  
  addFiles(files)
  
  return {
    readdir: vi.fn().mockImplementation(async (dirPath) => {
      const entries = []
      const normalizedPath = dirPath.replace(/\\/g, '/')
      
      for (const [filePath, fileData] of mockFiles) {
        const relativePath = path.relative(normalizedPath, filePath).replace(/\\/g, '/')
        
        if (relativePath && !relativePath.includes('/') && relativePath !== '..') {
          entries.push({
            name: path.basename(filePath),
            isDirectory: () => fileData.isDirectory,
            isFile: () => !fileData.isDirectory
          })
        }
      }
      
      return entries
    }),
    
    stat: vi.fn().mockImplementation(async (filePath) => {
      const normalizedPath = filePath.replace(/\\/g, '/')
      const fileData = mockFiles.get(normalizedPath)
      
      if (!fileData) {
        throw new Error(`ENOENT: no such file or directory, stat '${filePath}'`)
      }
      
      return {
        size: fileData.size || 0,
        isDirectory: () => fileData.isDirectory,
        isFile: () => !fileData.isDirectory
      }
    }),
    
    access: vi.fn().mockImplementation(async (filePath) => {
      const normalizedPath = filePath.replace(/\\/g, '/')
      if (!mockFiles.has(normalizedPath)) {
        throw new Error(`ENOENT: no such file or directory, access '${filePath}'`)
      }
    })
  }
}

/**
 * Генерирует случайный контент для файла
 * @param {string} extension - Расширение файла
 * @param {number} size - Размер в байтах (приблизительно)
 * @returns {string}
 */
export function generateFileContent(extension, size = 100) {
  const templates = {
    js: `// JavaScript file
function example() {
  console.log('Hello World');
  return true;
}

export default example;`,
    
    ts: `// TypeScript file
interface Example {
  name: string;
  value: number;
}

export function createExample(name: string): Example {
  return { name, value: Math.random() };
}`,
    
    py: `# Python file
def example_function():
    """Example function"""
    print("Hello World")
    return True

if __name__ == "__main__":
    example_function()`,
    
    java: `// Java file
public class Example {
    private String name;
    
    public Example(String name) {
        this.name = name;
    }
    
    public String getName() {
        return name;
    }
}`,
    
    css: `/* CSS file */
.example {
  color: #333;
  font-size: 14px;
  margin: 10px;
}

.example:hover {
  color: #666;
}`,
    
    html: `<!DOCTYPE html>
<html>
<head>
    <title>Example</title>
</head>
<body>
    <h1>Hello World</h1>
    <p>This is an example HTML file.</p>
</body>
</html>`,
    
    json: `{
  "name": "example",
  "version": "1.0.0",
  "description": "Example JSON file",
  "main": "index.js",
  "dependencies": {}
}`,
    
    md: `# Example Markdown

This is an example markdown file.

## Features

- Feature 1
- Feature 2
- Feature 3

## Usage

\`\`\`javascript
const example = require('./example');
example();
\`\`\``
  }
  
  let content = templates[extension] || `// ${extension} file\n// Generated content`
  
  // Если нужен файл больше базового шаблона, дополняем его
  while (content.length < size) {
    content += `\n// Additional line ${Math.random()}`
  }
  
  return content.substring(0, size)
}

/**
 * Создает комплексную structure проекта для тестирования
 * @param {string} type - Тип проекта (react, vue, node, etc.)
 * @returns {Object} - Структура файлов
 */
export function createProjectStructure(type = 'mixed') {
  const structures = {
    react: {
      'package.json': JSON.stringify({
        name: 'react-project',
        dependencies: {
          'react': '^18.0.0',
          'react-dom': '^18.0.0'
        }
      }, null, 2),
      'src': {
        'App.jsx': generateFileContent('js', 200),
        'components': {
          'Button.jsx': generateFileContent('js', 150),
          'Modal.tsx': generateFileContent('ts', 180)
        },
        'styles': {
          'App.css': generateFileContent('css', 120),
          'index.scss': generateFileContent('css', 90)
        }
      },
      'public': {
        'index.html': generateFileContent('html', 300)
      },
      'node_modules': {
        'react': {
          'package.json': '{"name":"react","version":"18.0.0"}'
        }
      }
    },
    
    vue: {
      'package.json': JSON.stringify({
        name: 'vue-project',
        dependencies: {
          'vue': '^3.0.0'
        }
      }, null, 2),
      'src': {
        'App.vue': `<template><div>Vue App</div></template><script>export default {name: 'App'}</script>`,
        'components': {
          'HelloWorld.vue': generateFileContent('js', 180)
        }
      },
      'vue.config.js': 'module.exports = {}'
    },
    
    node: {
      'package.json': JSON.stringify({
        name: 'node-project',
        main: 'server.js',
        dependencies: {
          'express': '^4.18.0'
        }
      }, null, 2),
      'server.js': generateFileContent('js', 250),
      'routes': {
        'api.js': generateFileContent('js', 180),
        'auth.js': generateFileContent('js', 200)
      },
      'config': {
        'database.js': generateFileContent('js', 150)
      }
    },
    
    python: {
      'main.py': generateFileContent('py', 200),
      'requirements.txt': 'flask==2.0.0\nrequests==2.28.0',
      'src': {
        'app.py': generateFileContent('py', 300),
        'models': {
          'user.py': generateFileContent('py', 180),
          '__init__.py': ''
        },
        'utils': {
          'helpers.py': generateFileContent('py', 150)
        }
      },
      'tests': {
        'test_app.py': generateFileContent('py', 220)
      }
    },
    
    mixed: {
      // Смешанный проект с множеством языков
      'package.json': JSON.stringify({ name: 'mixed-project' }, null, 2),
      'src': {
        'index.js': generateFileContent('js', 200),
        'main.ts': generateFileContent('ts', 180),
        'app.py': generateFileContent('py', 150),
        'Server.java': generateFileContent('java', 220),
        'style.css': generateFileContent('css', 100),
        'README.md': generateFileContent('md', 300)
      },
      'config': {
        'webpack.config.js': generateFileContent('js', 180),
        'tsconfig.json': JSON.stringify({ compilerOptions: {} }, null, 2)
      },
      'docs': {
        'api.md': generateFileContent('md', 250)
      },
      'tests': {
        'unit': {
          'test.spec.js': generateFileContent('js', 150)
        }
      },
      '.gitignore': 'node_modules/\n*.log\n.env',
      'Dockerfile': 'FROM node:16\nWORKDIR /app',
      'docker-compose.yml': 'version: "3"\nservices:\n  app:\n    build: .'
    }
  }
  
  return structures[type] || structures.mixed
}

/**
 * Создает ассерты для проверки resultов analysisа
 */
export const assertions = {
  /**
   * Проверяет structure resultа analysisа языков
   */
  validateLanguageAnalysis(result) {
    expect(result).toBeInstanceOf(Array)
    
    for (const lang of result) {
      expect(lang).toHaveProperty('lang')
      expect(lang).toHaveProperty('percent')
      expect(typeof lang.lang).toBe('string')
      expect(typeof lang.percent).toBe('number')
      expect(lang.percent).toBeGreaterThan(0)
      expect(lang.percent).toBeLessThanOrEqual(100)
    }
    
    // Check, что проценты в сумме не превышают 100
    const totalPercent = result.reduce((sum, lang) => sum + lang.percent, 0)
    expect(totalPercent).toBeLessThanOrEqual(100.01) // Небольшая погрешность для округления
  },
  
  /**
   * Проверяет structure resultа обнаружения фреймворков
   */
  validateFrameworkDetection(result) {
    expect(result).toBeInstanceOf(Array)
    
    for (const framework of result) {
      expect(typeof framework).toBe('string')
      expect(framework.length).toBeGreaterThan(0)
    }
    
    // Check, что нет дубликатов
    const unique = [...new Set(result)]
    expect(unique).toHaveLength(result.length)
  },
  
  /**
   * Проверяет structure resultа игнорируемых файлов
   */
  validateIgnoredFiles(result) {
    expect(result).toBeInstanceOf(Array)
    
    for (const filePath of result) {
      expect(typeof filePath).toBe('string')
      expect(filePath.length).toBeGreaterThan(0)
    }
  }
}
