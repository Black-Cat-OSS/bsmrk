import { scanDirectory } from './file-scanner.js'
import { analyzeLanguages } from './language-analyzer.js'
import { detectFrameworks } from './framework-detector.js'
import { getIgnoredFiles } from './ignore-checker.js'

/**
 * Analyzes a directory and returns language statistics, frameworks, and ignored files
 * @param {string} directoryPath - Path to the directory to analyze
 * @returns {Promise<{langs: Array<{lang: string, percent: number}>, frameworks: Array<string>, ignores: Array<string>}>}
 */
export async function analyzeDirectory(directoryPath) {
	try {
		// Scan all files in directory
		const files = await scanDirectory(directoryPath)
		
		// Analyze languages and calculate percentages
		const langs = await analyzeLanguages(files)
		
		// Detect frameworks based on file patterns
		const frameworks = await detectFrameworks(files)
		
		// Get list of ignored files
		const ignores = await getIgnoredFiles(files)
		
		return {
			langs,
			frameworks,
			ignores
		}
	} catch (error) {
		throw new Error(`Failed to analyze directory: ${error.message}`)
	}
}

// Export individual functions for flexibility
export { scanDirectory } from './file-scanner.js'
export { analyzeLanguages } from './language-analyzer.js'
export { detectFrameworks } from './framework-detector.js'
export { getIgnoredFiles } from './ignore-checker.js'
