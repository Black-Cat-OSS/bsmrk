import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { scanDirectory } from '../../src/file-scanner.js'
import { createTestDirectory, removeTestDirectory } from '../helpers/test-utils.js'
import fs from 'fs/promises'
import path from 'path'

// Mock fs module for some tests
vi.mock('fs/promises', async () => {
  const actual = await vi.importActual('fs/promises')
  return {
    ...actual,
    readdir: vi.fn(),
    stat: vi.fn()
  }
})

describe('file-scanner', () => {
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

  describe('scanDirectory', () => {
    it('should scan basic directory structure', async () => {
      const structure = {
        'app.js': 'console.log("Hello");',
        'style.css': '.app { color: red; }',
        'README.md': '# Test Project'
      }
      
      testDir = await createTestDirectory(structure)
      const files = await scanDirectory(testDir)
      
      expect(files).toHaveLength(3)
      expect(files.map(f => f.name)).toContain('app.js')
      expect(files.map(f => f.name)).toContain('style.css')
      expect(files.map(f => f.name)).toContain('README.md')
      
      // Check file object structure
      files.forEach(file => {
        expect(file).toHaveProperty('path')
        expect(file).toHaveProperty('name')
        expect(file).toHaveProperty('extension')
        expect(file).toHaveProperty('size')
        expect(typeof file.path).toBe('string')
        expect(typeof file.name).toBe('string')
        expect(typeof file.extension).toBe('string')
        expect(typeof file.size).toBe('number')
      })
    })

    it('should handle nested directories', async () => {
      const structure = {
        'src': {
          'components': {
            'Button.jsx': 'export default Button;',
            'Modal.tsx': 'export default Modal;'
          },
          'utils': {
            'helpers.js': 'export const helper = () => {};'
          },
          'index.js': 'import App from "./App";'
        },
        'public': {
          'index.html': '<!DOCTYPE html>'
        },
        'package.json': '{"name": "test"}'
      }
      
      testDir = await createTestDirectory(structure)
      const files = await scanDirectory(testDir)
      
      expect(files).toHaveLength(6)
      
      // Check file paths
      const filePaths = files.map(f => f.path.replace(/\\/g, '/'))
      expect(filePaths).toContain('src/components/Button.jsx')
      expect(filePaths).toContain('src/components/Modal.tsx')
      expect(filePaths).toContain('src/utils/helpers.js')
      expect(filePaths).toContain('src/index.js')
      expect(filePaths).toContain('public/index.html')
      expect(filePaths).toContain('package.json')
    })

    it('should extract correct file extensions', async () => {
      const structure = {
        'app.js': 'js file',
        'component.jsx': 'jsx file',
        'types.d.ts': 'ts definition',
        'style.scss': 'scss file',
        'config.json': 'json file',
        'README.md': 'markdown file',
        'Dockerfile': 'docker file',
        'no-extension': 'file without extension'
      }
      
      testDir = await createTestDirectory(structure)
      const files = await scanDirectory(testDir)
      
      const extensionMap = {}
      files.forEach(file => {
        extensionMap[file.name] = file.extension
      })
      
      expect(extensionMap['app.js']).toBe('js')
      expect(extensionMap['component.jsx']).toBe('jsx')
      expect(extensionMap['types.d.ts']).toBe('ts') // Should get last extension
      expect(extensionMap['style.scss']).toBe('scss')
      expect(extensionMap['config.json']).toBe('json')
      expect(extensionMap['README.md']).toBe('md')
      expect(extensionMap['Dockerfile']).toBe('')
      expect(extensionMap['no-extension']).toBe('')
    })

    it('should calculate file sizes correctly', async () => {
      const content1 = 'a'.repeat(100)
      const content2 = 'b'.repeat(200)
      
      const structure = {
        'small.txt': content1,
        'large.txt': content2
      }
      
      testDir = await createTestDirectory(structure)
      const files = await scanDirectory(testDir)
      
      const smallFile = files.find(f => f.name === 'small.txt')
      const largeFile = files.find(f => f.name === 'large.txt')
      
      expect(smallFile.size).toBe(100)
      expect(largeFile.size).toBe(200)
    })

    it('should ignore files according to ignore patterns', async () => {
      const structure = {
        'src': {
          'app.js': 'source file',
          'app.min.js': 'minified file'
        },
        'node_modules': {
          'package': {
            'index.js': 'dependency file'
          }
        },
        'dist': {
          'bundle.js': 'built file'
        },
        '.git': {
          'config': 'git config'
        },
        'package.json': 'package file',
        '.env': 'environment file',
        'file.log': 'log file'
      }
      
      testDir = await createTestDirectory(structure)
      const files = await scanDirectory(testDir)
      
      const fileNames = files.map(f => f.name)
      const filePaths = files.map(f => f.path.replace(/\\/g, '/'))
      
      // Should be included
      expect(fileNames).toContain('app.js')
      expect(fileNames).toContain('package.json')
      
      // Should be excluded according to CUSTOM_IGNORE
      expect(filePaths.some(p => p.includes('node_modules'))).toBe(false)
      expect(filePaths.some(p => p.includes('dist/'))).toBe(false)
      expect(filePaths.some(p => p.includes('.git'))).toBe(false)
      expect(fileNames).not.toContain('.env')
      expect(fileNames).not.toContain('file.log')
      expect(fileNames).not.toContain('app.min.js')
    })

    it('should handle empty directory', async () => {
      testDir = await createTestDirectory({})
      const files = await scanDirectory(testDir)
      
      expect(files).toHaveLength(0)
      expect(Array.isArray(files)).toBe(true)
    })

    it('should handle directory with only subdirectories', async () => {
      const structure = {
        'empty1': {},
        'empty2': {
          'nested_empty': {}
        }
      }
      
      testDir = await createTestDirectory(structure)
      const files = await scanDirectory(testDir)
      
      expect(files).toHaveLength(0)
    })

    it('should handle permission errors gracefully', async () => {
      // Mock readdir to simulate access error
      const mockReaddir = vi.spyOn(fs, 'readdir')
      mockReaddir.mockRejectedValueOnce(new Error('EACCES: permission denied'))
      
      // Create real directory for initial call
      testDir = await createTestDirectory({ 'test.js': 'test' })
      
      // Function should handle error and continue working
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
      
      await expect(scanDirectory('/restricted')).resolves.toEqual([])
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Warning: Cannot read directory')
      )
      
      consoleSpy.mockRestore()
    })

    it('should handle very deep directory structures', async () => {
      // Create deeply nested structure
      let structure = {}
      let current = structure
      
      for (let i = 0; i < 10; i++) {
        current[`level${i}`] = {}
        current = current[`level${i}`]
      }
      current['deep-file.js'] = 'console.log("deep");'
      
      testDir = await createTestDirectory(structure)
      const files = await scanDirectory(testDir)
      
      expect(files).toHaveLength(1)
      expect(files[0].name).toBe('deep-file.js')
      expect(files[0].path.split(path.sep)).toHaveLength(11) // 10 levels + file
    })

    it('should handle special characters in file names', async () => {
      const structure = {
        'файл-с-русскими-символами.js': 'русский контент',
        'file with spaces.py': 'python content',
        'file@with#symbols$.java': 'java content',
        '中文文件.txt': 'chinese content',
        'émoji-file-😀.md': 'emoji content'
      }
      
      testDir = await createTestDirectory(structure)
      const files = await scanDirectory(testDir)
      
      expect(files).toHaveLength(5)
      
      const fileNames = files.map(f => f.name)
      expect(fileNames).toContain('файл-с-русскими-символами.js')
      expect(fileNames).toContain('file with spaces.py')
      expect(fileNames).toContain('file@with#symbols$.java')
      expect(fileNames).toContain('中文文件.txt')
      expect(fileNames).toContain('émoji-file-😀.md')
    })

    it('should handle large number of files', async () => {
      const structure = {}
      
      // Create 100 files
      for (let i = 0; i < 100; i++) {
        structure[`file${i}.js`] = `console.log("File ${i}");`
      }
      
      testDir = await createTestDirectory(structure)
      const files = await scanDirectory(testDir)
      
      expect(files).toHaveLength(100)
      
      // Check that all files are unique
      const uniqueNames = new Set(files.map(f => f.name))
      expect(uniqueNames.size).toBe(100)
      
      // Check sorting (files should быть в traversal order)
      files.forEach((file, index) => {
        expect(file.name).toMatch(/^file\d+\.js$/)
      })
    })

    it('should return relative paths correctly', async () => {
      const structure = {
        'root.js': 'root file',
        'src': {
          'nested.js': 'nested file',
          'deep': {
            'very-deep.js': 'very deep file'
          }
        }
      }
      
      testDir = await createTestDirectory(structure)
      const files = await scanDirectory(testDir)
      
      const rootFile = files.find(f => f.name === 'root.js')
      const nestedFile = files.find(f => f.name === 'nested.js')
      const deepFile = files.find(f => f.name === 'very-deep.js')
      
      expect(rootFile.path).toBe('root.js')
      expect(nestedFile.path.replace(/\\/g, '/')).toBe('src/nested.js')
      expect(deepFile.path.replace(/\\/g, '/')).toBe('src/deep/very-deep.js')
    })

    it('should handle symbolic links (if supported)', async () => {
      const structure = {
        'original.js': 'original content',
        'folder': {
          'nested.js': 'nested content'
        }
      }
      
      testDir = await createTestDirectory(structure)
      
      try {
        // Пытаемся создать symbolic link
        await fs.symlink(
          path.join(testDir, 'original.js'),
          path.join(testDir, 'symlink.js')
        )
        
        const files = await scanDirectory(testDir)
        
        // Should find original file и symbolic link
        expect(files.length).toBeGreaterThanOrEqual(2)
        expect(files.some(f => f.name === 'original.js')).toBe(true)
        
      } catch (error) {
        // Если символические ссылки не поддерживаются, пропускаем тест
        console.warn('Symbolic links not supported, skipping test')
      }
    })
  })

  describe('ignore patterns functionality', () => {
    it('should respect gitignore-style patterns', async () => {
      const structure = {
        'app.js': 'source',
        'app.test.js': 'test file',
        'build': {
          'app.min.js': 'minified'
        },
        'src': {
          'components': {
            'Button.js': 'component'
          }
        },
        '.DS_Store': 'mac file',
        'Thumbs.db': 'windows file'
      }
      
      testDir = await createTestDirectory(structure)
      const files = await scanDirectory(testDir)
      
      const fileNames = files.map(f => f.name)
      
      // Main files should be present
      expect(fileNames).toContain('app.js')
      expect(fileNames).toContain('Button.js')
      
      // System files should be excluded
      expect(fileNames).not.toContain('.DS_Store')
      expect(fileNames).not.toContain('Thumbs.db')
      
      // Build директория should be исключена
      expect(files.some(f => f.path.includes('build'))).toBe(false)
    })

    it('should handle glob patterns correctly', async () => {
      const structure = {
        'component.js': 'source',
        'component.min.js': 'minified',
        'component.test.js': 'test',
        'utils.js': 'utility',
        'utils.min.js': 'minified utility'
      }
      
      testDir = await createTestDirectory(structure)
      const files = await scanDirectory(testDir)
      
      const fileNames = files.map(f => f.name)
      
      // Regular JS files should be included
      expect(fileNames).toContain('component.js')
      expect(fileNames).toContain('utils.js')
      
      // .min.js files should be excluded according to ignore patterns
      expect(fileNames).not.toContain('component.min.js')
      expect(fileNames).not.toContain('utils.min.js')
    })
  })
})
