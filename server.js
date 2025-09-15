import express from 'express'
import fs from 'fs'
import ignore from 'ignore'
import path from 'path'
import { fileURLToPath } from 'url'
import { CUSTOM_IGNORE } from './ignore.js'
import mime from 'mime-types'
import { fileTypeFromFile } from 'file-type'

const app = express()
app.use(express.json())

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const ROOT = path.join(__dirname, 'data', 'projects')

async function loadGitignore(projectPath) {
	const ig = ignore()
	ig.add(CUSTOM_IGNORE)

	const gitignorePath = path.join(projectPath, '.gitignore')
	try {
		const content = await fs.promises.readFile(gitignorePath, 'utf8')
		ig.add(content)
	} catch {}
	return ig
}

async function* walk(dir, base, ig) {
	const dirents = await fs.promises.readdir(dir, { withFileTypes: true })
	for (const d of dirents) {
		const rel = path.relative(base, path.join(dir, d.name))
		if (ig.ignores(rel)) continue
		const full = path.join(dir, d.name)

		if (d.isDirectory()) {
			yield* walk(full, base, ig)
		} else {
			yield full
		}
	}
}

// Новая функция для безопасной потоковой передачи
async function streamFileSafely(filePath, res) {
	return new Promise((resolve, reject) => {
		const stream = fs.createReadStream(filePath, {
			encoding: 'utf8',
			highWaterMark: 64 * 1024,
		})

		stream.on('data', chunk => {
			if (!res.write(chunk)) {
				stream.pause()
				res.once('drain', () => stream.resume())
			}
		})

		stream.on('end', resolve)
		stream.on('error', reject)
	})
}

// Функция для определения типов файла с использованием готовых библиотек
async function getFileMetaTags(filePath) {
	const fileName = path.basename(filePath).toLowerCase()
	const ext = path.extname(filePath).toLowerCase()
	const metaTags = []
	
	// Специальные случаи для конфигурационных файлов
	const specialFiles = {
		'dockerfile': ['dockerfile'],
		'.gitignore': ['gitignore'],
		'package.json': ['json', 'package'],
		'yarn.lock': ['lock', 'yarn'],
		'pnpm-lock.yaml': ['yaml', 'lock', 'pnpm'],
		'docker-compose.yml': ['yaml', 'docker'],
		'docker-compose.yaml': ['yaml', 'docker'],
		'nginx.conf': ['conf', 'nginx'],
		'tsconfig.json': ['json', 'typescript'],
		'vite.config.ts': ['ts', 'vite'],
		'webpack.config.js': ['js', 'webpack'],
		'next.config.js': ['js', 'next'],
		'tailwind.config.js': ['js', 'tailwind'],
		'postcss.config.js': ['js', 'postcss'],
		'babel.config.js': ['js', 'babel'],
		'.eslintrc.js': ['js', 'eslint'],
		'.prettierrc': ['prettier'],
		'.env': ['env'],
		'.env.local': ['env'],
		'.env.development': ['env'],
		'.env.production': ['env'],
		'README.md': ['markdown', 'readme'],
		'CHANGELOG.md': ['markdown', 'changelog'],
		'LICENSE': ['license'],
		'Makefile': ['makefile'],
		'Procfile': ['procfile'],
		'Dockerfile.prod': ['dockerfile'],
		'Dockerfile.dev': ['dockerfile']
	}
	
	if (specialFiles[fileName]) {
		return specialFiles[fileName]
	}
	
	// Получаем MIME-тип по расширению
	const mimeType = mime.lookup(filePath)
	if (mimeType) {
		// Извлекаем основную категорию из MIME-типа
		const [category, subtype] = mimeType.split('/')
		metaTags.push(category)
		metaTags.push(subtype)
		
		// Добавляем расширение без точки
		if (ext) {
			metaTags.push(ext.substring(1))
		}
		
		// Специальные случаи для популярных типов
		if (subtype.includes('javascript')) {
			metaTags.push('js')
		}
		if (subtype.includes('typescript')) {
			metaTags.push('ts')
		}
		if (subtype.includes('css')) {
			metaTags.push('css')
		}
		if (subtype.includes('html')) {
			metaTags.push('html')
		}
		if (subtype.includes('json')) {
			metaTags.push('json')
		}
		if (subtype.includes('yaml')) {
			metaTags.push('yaml')
		}
		if (subtype.includes('xml')) {
			metaTags.push('xml')
		}
		if (subtype.includes('markdown')) {
			metaTags.push('markdown')
		}
	} else {
		// Если MIME-тип не найден, пробуем определить по содержимому файла
		try {
			const fileType = await fileTypeFromFile(filePath)
			if (fileType) {
				metaTags.push(fileType.ext)
				metaTags.push(fileType.mime.split('/')[0])
				metaTags.push(fileType.mime.split('/')[1])
			} else if (ext) {
				// Fallback на расширение
				metaTags.push(ext.substring(1))
			} else {
				metaTags.push('unknown')
			}
		} catch (error) {
			// Если не удалось прочитать файл, используем расширение
			if (ext) {
				metaTags.push(ext.substring(1))
			} else {
				metaTags.push('unknown')
			}
		}
	}
	
	// Убираем дубликаты и возвращаем уникальные теги
	return [...new Set(metaTags)]
}

// Функция для генерации хэша
function generateHash(str) {
	let hash = 0
	for (let i = 0; i < str.length; i++) {
		const char = str.charCodeAt(i)
		hash = ((hash << 5) - hash) + char
		hash = hash & hash // Convert to 32bit integer
	}
	return Math.abs(hash).toString(36)
}

// Функция для получения массива объектов с файлами проекта
async function getProjectFilePaths(project) {
	const base = path.join(ROOT, project)
	const ig = await loadGitignore(base)
	const files = []
	
	for await (const file of walk(base, base, ig)) {
		const relativePath = path.relative(base, file)
		const hash = generateHash(relativePath)
		const metaTags = await getFileMetaTags(file)
		
		files.push({
			hash,
			file: relativePath,
			metaTags
		})
	}
	
	return files
}

app.get('/tree/:project', async (req, res) => {
	const project = req.params.project
	const base = path.join(ROOT, project)
	const ig = await loadGitignore(base)

	res.setHeader('Content-Type', 'application/json; charset=utf-8')
	res.write('{"files":[')
	let first = true

	for await (const file of walk(base, base, ig)) {
		if (!first) res.write(',')
		first = false
		res.write(JSON.stringify(path.relative(base, file)))
	}
	res.write(']}')
	res.end()
})

app.get('/tree/:project', async (req, res) => {
	const project = req.params.project
	const base = path.join(ROOT, project)
	const ig = await loadGitignore(base)

	res.setHeader('Content-Type', 'text/plain; charset=utf-8')

	for await (const file of walk(base, base, ig)) {
		res.write(`\n\n=== ${path.relative(base, file)} ===\n`)
		await streamFileSafely(file, res)
	}
	res.end()
})

app.get('/:project/meta-table', async (req, res) => {
	const project = req.params.project
	const files = await getProjectFilePaths(project)

	res.setHeader('Content-Type', 'application/json; charset=utf-8')
	res.json(files)
})

app.get('/both/:project', async (req, res) => {
	const boundary = 'BOUNDARY-' + Date.now()
	const project = req.params.project
	const base = path.join(ROOT, project)
	const ig = await loadGitignore(base)

	res.setHeader('Content-Type', `multipart/mixed; boundary=${boundary}`)

	// Часть 1 — дерево
	res.write(`--${boundary}\r\n`)
	res.write('Content-Type: application/json; charset=utf-8\r\n\r\n')
	res.write('{"files":[')
	let first = true
	for await (const file of walk(base, base, ig)) {
		if (!first) res.write(',')
		first = false
		res.write(JSON.stringify(path.relative(base, file)))
	}
	res.write(']}\r\n')

	// Часть 2 — текст
	res.write(`--${boundary}\r\n`)
	res.write('Content-Type: text/plain; charset=utf-8\r\n\r\n')
	for await (const file of walk(base, base, ig)) {
		res.write(`\n\n=== ${path.relative(base, file)} ===\n`)
		await streamFileSafely(file, res)
	}

	res.write(`\r\n--${boundary}--`)
	res.end()
})

app.listen(3000, () => console.log('Server running on http://localhost:3000'))
