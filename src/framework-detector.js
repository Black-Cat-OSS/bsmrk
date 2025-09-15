import { FRAMEWORK_PATTERNS } from '../frameworks.js'
import path from 'path'

/**
 * Detects frameworks based on file patterns and project structure
 * @param {Array<{path: string, name: string, extension: string, size: number}>} files - Files to analyze
 * @returns {Array<string>} - Detected frameworks
 */
export async function detectFrameworks(files) {
	const detectedFrameworks = new Set()
	const fileNames = new Set(files.map(f => f.name.toLowerCase()))
	const filePaths = new Set(files.map(f => f.path.toLowerCase()))
	const directories = new Set()
	
	// Extract directory names
	files.forEach(file => {
		const dir = path.dirname(file.path)
		if (dir !== '.') {
			directories.add(dir.toLowerCase())
		}
	})
	
	// Check each framework pattern
	for (const [framework, ...patterns] of FRAMEWORK_PATTERNS) {
		if (matchesFrameworkPattern(framework, patterns, fileNames, filePaths, directories, files)) {
			detectedFrameworks.add(framework)
		}
	}
	
	// Apply framework hierarchy and conflicts resolution
	const resolvedFrameworks = resolveFrameworkConflicts(Array.from(detectedFrameworks))
	
	return resolvedFrameworks.sort()
}

/**
 * Checks if files match a framework pattern
 * @param {string} framework - Framework name
 * @param {Array<string>} patterns - Patterns to match
 * @param {Set<string>} fileNames - Set of file names
 * @param {Set<string>} filePaths - Set of file paths
 * @param {Set<string>} directories - Set of directory names
 * @param {Array} files - Original files array
 * @returns {boolean}
 */
function matchesFrameworkPattern(framework, patterns, fileNames, filePaths, directories, files) {
	let matchCount = 0
	const requiredMatches = getRequiredMatches(framework, patterns.length)
	
	for (const pattern of patterns) {
		if (matchesPattern(pattern, fileNames, filePaths, directories, files)) {
			matchCount++
			if (matchCount >= requiredMatches) {
				return true
			}
		}
	}
	
	return false
}

/**
 * Checks if a pattern matches against the file system
 * @param {string} pattern - Pattern to match
 * @param {Set<string>} fileNames - Set of file names
 * @param {Set<string>} filePaths - Set of file paths
 * @param {Set<string>} directories - Set of directory names
 * @param {Array} files - Original files array
 * @returns {boolean}
 */
function matchesPattern(pattern, fileNames, filePaths, directories, files) {
	const lowerPattern = pattern.toLowerCase()
	
	// Direct file name match
	if (fileNames.has(lowerPattern)) {
		return true
	}
	
	// Directory match
	if (directories.has(lowerPattern)) {
		return true
	}
	
	// Path contains pattern
	for (const filePath of filePaths) {
		if (filePath.includes(lowerPattern)) {
			return true
		}
	}
	
	// Extension match
	if (lowerPattern.startsWith('.') || lowerPattern.includes('.')) {
		const ext = lowerPattern.startsWith('.') ? lowerPattern.slice(1) : lowerPattern
		if (files.some(file => file.extension === ext)) {
			return true
		}
	}
	
	// Special pattern matching
	if (lowerPattern.includes('/') || lowerPattern.includes('\\')) {
		const normalizedPattern = lowerPattern.replace(/[\/\\]/g, path.sep)
		for (const filePath of filePaths) {
			if (filePath.includes(normalizedPattern)) {
				return true
			}
		}
	}
	
	// Content-based matching (for specific patterns like @decorators)
	if (lowerPattern.startsWith('@')) {
		// This would require file content analysis, simplified for now
		return false
	}
	
	return false
}

/**
 * Determines how many patterns need to match for a framework to be detected
 * @param {string} framework - Framework name
 * @param {number} totalPatterns - Total number of patterns
 * @returns {number}
 */
function getRequiredMatches(framework, totalPatterns) {
	// Frameworks that need only one strong indicator
	const singleMatchFrameworks = [
		'react', 'vue', 'angular', 'svelte', 'nextjs', 'nuxtjs', 'gatsby',
		'django', 'flask', 'fastapi', 'rails', 'laravel', 'symfony',
		'spring', 'spring-boot', 'express', 'fastify', 'nestjs'
	]
	
	if (singleMatchFrameworks.includes(framework)) {
		return 1
	}
	
	// Most frameworks need at least 2 matches to avoid false positives
	return Math.min(2, totalPatterns)
}

/**
 * Resolves conflicts between detected frameworks
 * @param {Array<string>} frameworks - Detected frameworks
 * @returns {Array<string>}
 */
function resolveFrameworkConflicts(frameworks) {
	const frameworkSet = new Set(frameworks)
	
	// Framework hierarchy and conflicts
	const conflicts = {
		// If Next.js is detected, it includes React
		'nextjs': ['react'],
		// If Nuxt.js is detected, it includes Vue
		'nuxtjs': ['vue'],
		// Spring Boot is a superset of Spring
		'spring-boot': ['spring'],
		// Specific implementations override generic ones
		'react-native': ['react'],
		'vue-cli': ['vue'],
		'angular-cli': ['angular']
	}
	
	// Remove redundant frameworks
	for (const [parent, children] of Object.entries(conflicts)) {
		if (frameworkSet.has(parent)) {
			children.forEach(child => frameworkSet.delete(child))
		}
	}
	
	// Group related frameworks
	const groups = {
		'css-frameworks': ['bootstrap', 'tailwindcss', 'bulma', 'foundation', 'materialize', 'semantic-ui'],
		'css-preprocessors': ['sass', 'less', 'stylus'],
		'state-management': ['redux', 'mobx', 'vuex', 'ngrx', 'recoil', 'zustand'],
		'testing': ['jest', 'mocha', 'jasmine', 'cypress', 'selenium', 'puppeteer', 'playwright'],
		'build-tools': ['webpack', 'vite', 'rollup', 'parcel', 'gulp', 'grunt']
	}
	
	// Keep only the most significant frameworks from each group
	for (const [groupName, groupFrameworks] of Object.entries(groups)) {
		const presentFrameworks = groupFrameworks.filter(f => frameworkSet.has(f))
		
		if (presentFrameworks.length > 3) {
			// Keep only top 3 most common ones
			const priorities = {
				// CSS frameworks priority
				'tailwindcss': 10, 'bootstrap': 9, 'sass': 8,
				// State management priority  
				'redux': 10, 'mobx': 8, 'vuex': 9,
				// Testing priority
				'jest': 10, 'cypress': 9, 'mocha': 8,
				// Build tools priority
				'webpack': 10, 'vite': 9, 'rollup': 8
			}
			
			const sorted = presentFrameworks.sort((a, b) => (priorities[b] || 0) - (priorities[a] || 0))
			const toRemove = sorted.slice(3)
			toRemove.forEach(f => frameworkSet.delete(f))
		}
	}
	
	return Array.from(frameworkSet)
}
