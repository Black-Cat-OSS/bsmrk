# 🚀 Quick Start Guide

Get up and running with BismarkJS in minutes!

## 📦 Installation

Choose your preferred package manager:

```bash
# npm
npm install bismark-js

# yarn
yarn add bismark-js

# pnpm
pnpm add bismark-js
```

## 🏃‍♂️ 30-Second Example

Create a new file and try this:

```javascript
import { analyzeDirectory } from 'bismark-js';

// Analyze your current project
const result = await analyzeDirectory('./');

console.log('🔤 Languages:', result.langs);
console.log('🚀 Frameworks:', result.frameworks);
console.log('🚫 Ignored files:', result.ignores.length);
```

## 📋 Common Use Cases

### 1. Project Overview Dashboard

```javascript
import { analyzeDirectory } from 'bismark-js';

async function projectOverview() {
  const result = await analyzeDirectory('./');
  
  console.log('📊 PROJECT OVERVIEW');
  console.log('==================');
  console.log(`Primary Language: ${result.langs[0]?.lang || 'Unknown'}`);
  console.log(`Tech Stack: ${result.frameworks.join(', ') || 'None detected'}`);
  console.log(`Code Distribution:`);
  
  result.langs.forEach(lang => {
    console.log(`  • ${lang.lang}: ${lang.percent}%`);
  });
}

projectOverview();
```

### 2. Build Tool Detection

```javascript
import { detectFrameworks } from 'bismark-js';

async function checkBuildTools() {
  const files = await scanDirectory('./');
  const frameworks = await detectFrameworks(files);
  
  const buildTools = frameworks.filter(f => 
    ['webpack', 'vite', 'rollup', 'parcel', 'gulp'].includes(f)
  );
  
  console.log('🔧 Build tools found:', buildTools);
}
```

### 3. Language Statistics

```javascript
import { analyzeLanguages } from 'bismark-js';

async function languageStats() {
  const files = await scanDirectory('./src');
  const languages = await analyzeLanguages(files);
  
  console.log('📈 Language Statistics:');
  languages.forEach(({ lang, percent }) => {
    const bar = '█'.repeat(Math.floor(percent / 2));
    console.log(`${lang.padEnd(12)} ${bar} ${percent}%`);
  });
}
```

## 🔧 Configuration Options

### Different Module Systems

**ES Modules (Recommended)**
```javascript
import { analyzeDirectory } from 'bismark-js';
```

**CommonJS**
```javascript
const { analyzeDirectory } = require('bismark-js');
```

**Browser (UMD)**
```html
<script src="node_modules/bismark-js/dist/index.umd.js"></script>
<script>
  const result = await BismarkJS.analyzeDirectory('./');
</script>
```

## ⚡ Performance Tips

1. **Analyze specific directories** instead of entire projects:
   ```javascript
   // Instead of analyzing everything
   await analyzeDirectory('./');
   
   // Focus on source code
   await analyzeDirectory('./src');
   ```

2. **Use modular functions** for better control:
   ```javascript
   import { scanDirectory, analyzeLanguages } from 'bismark-js';
   
   const files = await scanDirectory('./src');
   const languages = await analyzeLanguages(files);
   ```

3. **Handle large projects gracefully**:
   ```javascript
   try {
     const result = await analyzeDirectory('./huge-project');
   } catch (error) {
     console.log('Project too large, analyzing src/ only');
     const result = await analyzeDirectory('./huge-project/src');
   }
   ```

## 🚨 Error Handling

Always wrap your analysis in try-catch blocks:

```javascript
async function safeAnalysis(path) {
  try {
    const result = await analyzeDirectory(path);
    return result;
  } catch (error) {
    console.error(`Failed to analyze ${path}:`, error.message);
    return { langs: [], frameworks: [], ignores: [] };
  }
}
```

## 🎯 Next Steps

- 📖 Check out [detailed examples](./EXAMPLES.md)
- 🔍 Read the [full API documentation](../README.md#api-reference)
- 🧪 Look at [test examples](../tests/examples.md)
- ⚙️ Explore [advanced configuration](../README.md#configuration)

## 💡 Need Help?

- 📝 Check the [README](../README.md) for comprehensive documentation
- 🐛 Report issues on GitHub
- 💬 Ask questions in discussions

---

**Happy analyzing! 🎉**

