import fs from 'fs/promises'
import path from 'path'
import { CUSTOM_IGNORE } from './config/ignore.js'

/**
 * Scans directory recursively and returns all files with their metadata
 * @param {string} directoryPath - Path to scan
 * @returns {Promise<Array<{path: string, name: string, extension: string, size: number}>>}
 */
export async function scanDirectory(directoryPath) {
	const files = []
	const ignorePatterns = createIgnorePatterns(CUSTOM_IGNORE)
	
	async function walkDirectory(currentPath) {
		try {
			const entries = await fs.readdir(currentPath, { withFileTypes: true })
			
			for (const entry of entries) {
				const fullPath = path.join(currentPath, entry.name)
				const relativePath = path.relative(directoryPath, fullPath)
				
				// Skip if matches ignore patterns
				if (shouldIgnore(relativePath, entry.name, ignorePatterns)) {
					continue
				}
				
				if (entry.isDirectory()) {
					await walkDirectory(fullPath)
				} else if (entry.isFile()) {
					const stats = await fs.stat(fullPath)
					const extension = path.extname(entry.name).toLowerCase().slice(1)
					
					files.push({
						path: relativePath,
						name: entry.name,
						extension,
						size: stats.size
					})
				}
			}
		} catch (error) {
			// Skip directories that can't be read (permissions, etc.)
			console.warn(`Warning: Cannot read directory ${currentPath}: ${error.message}`)
		}
	}
	
	await walkDirectory(directoryPath)
	return files
}

/**
 * Creates compiled ignore patterns for better performance
 * @param {Array<string>} patterns - Ignore patterns
 * @returns {Array<{pattern: string, isDirectory: boolean, regex: RegExp}>}
 */
function createIgnorePatterns(patterns) {
	return patterns.map(pattern => {
		const isDirectory = pattern.endsWith('/')
		const cleanPattern = isDirectory ? pattern.slice(0, -1) : pattern
		
		// Convert glob pattern to regex
		const regexPattern = cleanPattern
			.replace(/\./g, '\\.')
			.replace(/\*/g, '.*')
			.replace(/\?/g, '.')
		
		return {
			pattern: cleanPattern,
			isDirectory,
			regex: new RegExp(`^${regexPattern}$`, 'i')
		}
	})
}

/**
 * Checks if a file/directory should be ignored
 * @param {string} relativePath - Relative path from root
 * @param {string} name - File/directory name
 * @param {Array} ignorePatterns - Compiled ignore patterns
 * @returns {boolean}
 */
function shouldIgnore(relativePath, name, ignorePatterns) {
	for (const { regex, isDirectory } of ignorePatterns) {
		// Check against full relative path
		if (regex.test(relativePath)) {
			return true
		}
		
		// Check against just the name
		if (regex.test(name)) {
			return true
		}
		
		// Check path segments for directory patterns
		if (isDirectory) {
			const segments = relativePath.split(path.sep)
			if (segments.some(segment => regex.test(segment))) {
				return true
			}
		}
	}
	
	return false
}
