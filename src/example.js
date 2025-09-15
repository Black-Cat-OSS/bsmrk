import { analyzeDirectory } from './index.js'

// Example usage
async function example() {
	try {
		const result = await analyzeDirectory('./src')
		
		console.log('📊 Analysis Results:')
		console.log('===================')
		
		console.log('\n🔤 Languages:')
		result.langs.forEach(({ lang, percent }) => {
			console.log(`  ${lang}: ${percent}%`)
		})
		
		console.log('\n🚀 Frameworks:')
		result.frameworks.forEach(framework => {
			console.log(`  - ${framework}`)
		})
		
		console.log('\n🚫 Ignored Files:')
		result.ignores.slice(0, 10).forEach(file => {
			console.log(`  - ${file}`)
		})
		
		if (result.ignores.length > 10) {
			console.log(`  ... and ${result.ignores.length - 10} more`)
		}
		
	} catch (error) {
		console.error('❌ Error:', error.message)
	}
}

// Run example
example()
