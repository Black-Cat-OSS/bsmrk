import { LANGUAGE_EXTENSIONS } from '../languages.js'

/**
 * Analyzes files and returns language statistics with percentages
 * @param {Array<{path: string, name: string, extension: string, size: number}>} files - Files to analyze
 * @returns {Array<{lang: string, percent: number}>}
 */
export async function analyzeLanguages(files) {
	const languageMap = createLanguageMap()
	const languageStats = new Map()
	let totalSize = 0
	
	// Count files and sizes by language
	for (const file of files) {
		const language = detectLanguage(file, languageMap)
		
		if (language) {
			const current = languageStats.get(language) || { files: 0, size: 0 }
			languageStats.set(language, {
				files: current.files + 1,
				size: current.size + file.size
			})
			totalSize += file.size
		}
	}
	
	// Convert to percentage-based results
	const results = []
	for (const [lang, stats] of languageStats.entries()) {
		const percent = totalSize > 0 ? Math.round((stats.size / totalSize) * 10000) / 100 : 0
		
		if (percent > 0) {
			results.push({ lang, percent })
		}
	}
	
	// Sort by percentage descending
	return results.sort((a, b) => b.percent - a.percent)
}

/**
 * Creates a reverse mapping from extension to language
 * @returns {Map<string, string>}
 */
function createLanguageMap() {
	const map = new Map()
	
	for (const [language, ...extensions] of LANGUAGE_EXTENSIONS) {
		for (const ext of extensions) {
			// Handle special cases where extension might conflict
			if (!map.has(ext) || shouldPreferLanguage(language, map.get(ext))) {
				map.set(ext, language)
			}
		}
	}
	
	return map
}

/**
 * Detects the programming language of a file
 * @param {{path: string, name: string, extension: string, size: number}} file - File to analyze
 * @param {Map<string, string>} languageMap - Extension to language mapping
 * @returns {string|null}
 */
function detectLanguage(file, languageMap) {
	// First try by extension
	if (file.extension && languageMap.has(file.extension)) {
		return languageMap.get(file.extension)
	}
	
	// Special cases for files without extensions
	const fileName = file.name.toLowerCase()
	
	// Check for special filenames
	const specialFiles = {
		'dockerfile': 'dockerfile',
		'makefile': 'makefile',
		'rakefile': 'ruby',
		'gemfile': 'ruby',
		'podfile': 'ruby',
		'vagrantfile': 'ruby',
		'gruntfile.js': 'javascript',
		'gulpfile.js': 'javascript',
		'webpack.config.js': 'javascript',
		'rollup.config.js': 'javascript',
		'vite.config.js': 'javascript',
		'next.config.js': 'javascript',
		'nuxt.config.js': 'javascript',
		'vue.config.js': 'javascript',
		'babel.config.js': 'javascript',
		'jest.config.js': 'javascript',
		'tailwind.config.js': 'javascript',
		'postcss.config.js': 'javascript'
	}
	
	if (specialFiles[fileName]) {
		return specialFiles[fileName]
	}
	
	// Check for config files with common patterns
	if (fileName.endsWith('.config.js') || fileName.endsWith('.config.ts')) {
		return fileName.endsWith('.ts') ? 'typescript' : 'javascript'
	}
	
	if (fileName.endsWith('.config.json')) {
		return 'json'
	}
	
	if (fileName.endsWith('.config.yml') || fileName.endsWith('.config.yaml')) {
		return 'yaml'
	}
	
	return null
}

/**
 * Determines if one language should be preferred over another for the same extension
 * @param {string} newLang - New language to consider
 * @param {string} existingLang - Currently mapped language
 * @returns {boolean}
 */
function shouldPreferLanguage(newLang, existingLang) {
	// Preference order for common conflicts
	const preferences = {
		// TypeScript over JavaScript for .ts files
		'typescript': ['javascript'],
		// C++ over C for common extensions
		'cpp': ['c'],
		// Python over other languages for .py
		'python': ['jython', 'ironpython'],
		// Ruby over other Ruby implementations
		'ruby': ['jruby', 'ironruby'],
		// Main language over framework-specific variants
		'javascript': ['react', 'vue', 'angular'],
		'java': ['spring', 'spring-boot']
	}
	
	return preferences[newLang]?.includes(existingLang) || false
}
