import { CUSTOM_IGNORE } from '../ignore.js'
import path from 'path'

/**
 * Identifies files that match ignore patterns
 * @param {Array<{path: string, name: string, extension: string, size: number}>} files - Files to check
 * @returns {Array<string>} - Files that would be ignored
 */
export async function getIgnoredFiles(files) {
	const ignorePatterns = createIgnorePatterns(CUSTOM_IGNORE)
	const ignoredFiles = []
	
	for (const file of files) {
		if (shouldIgnoreFile(file, ignorePatterns)) {
			ignoredFiles.push(file.path)
		}
	}
	
	return ignoredFiles.sort()
}

/**
 * Creates compiled ignore patterns for matching
 * @param {Array<string>} patterns - Raw ignore patterns
 * @returns {Array<{pattern: string, regex: RegExp, isDirectory: boolean, isNegation: boolean}>}
 */
function createIgnorePatterns(patterns) {
	return patterns.map(pattern => {
		const isNegation = pattern.startsWith('!')
		const cleanPattern = isNegation ? pattern.slice(1) : pattern
		const isDirectory = cleanPattern.endsWith('/')
		const finalPattern = isDirectory ? cleanPattern.slice(0, -1) : cleanPattern
		
		// Convert glob pattern to regex
		const regexPattern = finalPattern
			.replace(/\./g, '\\.')
			.replace(/\*\*/g, '__DOUBLE_STAR__')
			.replace(/\*/g, '[^/\\\\]*')
			.replace(/__DOUBLE_STAR__/g, '.*')
			.replace(/\?/g, '[^/\\\\]')
		
		return {
			pattern: finalPattern,
			regex: new RegExp(`^${regexPattern}$`, 'i'),
			isDirectory,
			isNegation
		}
	})
}

/**
 * Checks if a file should be ignored based on patterns
 * @param {{path: string, name: string, extension: string, size: number}} file - File to check
 * @param {Array} ignorePatterns - Compiled ignore patterns
 * @returns {boolean}
 */
function shouldIgnoreFile(file, ignorePatterns) {
	let shouldIgnore = false
	
	for (const { regex, isDirectory, isNegation } of ignorePatterns) {
		const matches = (
			regex.test(file.path) ||
			regex.test(file.name) ||
			regex.test(file.path.replace(/\\/g, '/')) ||
			(isDirectory && pathContainsDirectory(file.path, regex))
		)
		
		if (matches) {
			if (isNegation) {
				shouldIgnore = false
			} else {
				shouldIgnore = true
			}
		}
	}
	
	return shouldIgnore
}

/**
 * Checks if a file path contains a directory that matches the pattern
 * @param {string} filePath - File path to check
 * @param {RegExp} regex - Pattern to match against
 * @returns {boolean}
 */
function pathContainsDirectory(filePath, regex) {
	const segments = filePath.split(path.sep)
	return segments.some(segment => regex.test(segment))
}

/**
 * Gets statistics about ignored files
 * @param {Array<{path: string, name: string, extension: string, size: number}>} files - All files
 * @returns {Promise<{totalFiles: number, ignoredFiles: number, ignoredSize: number, patterns: Array<{pattern: string, count: number}>}>}
 */
export async function getIgnoreStatistics(files) {
	const ignorePatterns = createIgnorePatterns(CUSTOM_IGNORE)
	const patternStats = new Map()
	let ignoredCount = 0
	let ignoredSize = 0
	
	for (const file of files) {
		if (shouldIgnoreFile(file, ignorePatterns)) {
			ignoredCount++
			ignoredSize += file.size
			
			// Track which patterns matched
			for (const { pattern, regex, isDirectory, isNegation } of ignorePatterns) {
				if (!isNegation) {
					const matches = (
						regex.test(file.path) ||
						regex.test(file.name) ||
						(isDirectory && pathContainsDirectory(file.path, regex))
					)
					
					if (matches) {
						const current = patternStats.get(pattern) || 0
						patternStats.set(pattern, current + 1)
					}
				}
			}
		}
	}
	
	const patterns = Array.from(patternStats.entries())
		.map(([pattern, count]) => ({ pattern, count }))
		.sort((a, b) => b.count - a.count)
	
	return {
		totalFiles: files.length,
		ignoredFiles: ignoredCount,
		ignoredSize,
		patterns
	}
}

/**
 * Validates ignore patterns for syntax errors
 * @param {Array<string>} patterns - Patterns to validate
 * @returns {Array<{pattern: string, error: string}>} - Invalid patterns with errors
 */
export function validateIgnorePatterns(patterns) {
	const errors = []
	
	for (const pattern of patterns) {
		try {
			createIgnorePatterns([pattern])
		} catch (error) {
			errors.push({
				pattern,
				error: error.message
			})
		}
	}
	
	return errors
}
