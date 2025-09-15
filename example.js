import { analyzeDirectory } from './index.js'

// Example usage
async function example() {
	try {
		const result = await analyzeDirectory('./src')
		
		console.log('📊 Directory Analysis Results:')
		console.log('==============================')
		
		console.log('\n🔤 Programming Languages:')
		if (result.langs.length === 0) {
			console.log('  No programming languages detected')
		} else {
			result.langs.forEach(({ lang, percent }) => {
				const bar = '█'.repeat(Math.round(percent / 5))
				console.log(`  ${lang.padEnd(15)} ${percent.toFixed(1)}% ${bar}`)
			})
		}
		
		console.log('\n🚀 Detected Frameworks:')
		if (result.frameworks.length === 0) {
			console.log('  No frameworks detected')
		} else {
			result.frameworks.forEach(framework => {
				console.log(`  ✓ ${framework}`)
			})
		}
		
		console.log('\n🚫 Ignored Files:')
		if (result.ignores.length === 0) {
			console.log('  No ignored files found')
		} else {
			const displayCount = Math.min(10, result.ignores.length)
			result.ignores.slice(0, displayCount).forEach(file => {
				console.log(`  - ${file}`)
			})
			
			if (result.ignores.length > displayCount) {
				console.log(`  ... and ${result.ignores.length - displayCount} more ignored files`)
			}
		}
		
		console.log('\n📈 Summary:')
		console.log(`  Total languages: ${result.langs.length}`)
		console.log(`  Total frameworks: ${result.frameworks.length}`)
		console.log(`  Total ignored files: ${result.ignores.length}`)
		
	} catch (error) {
		console.error('❌ Error analyzing directory:', error.message)
		process.exit(1)
	}
}

// Run example if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
	example()
}
