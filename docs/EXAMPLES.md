# 📖 BismarkJS - Examples

This document contains practical examples of using BismarkJS in different scenarios.

## 🚀 Basic Usage

### ES Modules Example

```javascript
// Basic analysis example
import { analyzeDirectory } from 'bismark-js';

async function main() {
  try {
    // Analyze current directory
    const result = await analyzeDirectory('./');
    
    console.log('📊 Directory Analysis Results:');
    console.log('===============================');
    
    console.log('\n🔤 Languages:');
    result.langs.forEach(lang => {
      console.log(`  ${lang.lang}: ${lang.percent}%`);
    });
    
    console.log('\n🚀 Frameworks detected:');
    result.frameworks.forEach(framework => {
      console.log(`  - ${framework}`);
    });
    
    console.log('\n🚫 Ignored files:');
    if (result.ignores.length > 0) {
      result.ignores.slice(0, 5).forEach(file => {
        console.log(`  - ${file}`);
      });
      if (result.ignores.length > 5) {
        console.log(`  ... and ${result.ignores.length - 5} more files`);
      }
    } else {
      console.log('  No ignored files found');
    }
    
  } catch (error) {
    console.error('❌ Error analyzing directory:', error.message);
  }
}

main();
```

### CommonJS Example

```javascript
// CommonJS usage
const { analyzeDirectory } = require('bismark-js');

async function analyze() {
  const result = await analyzeDirectory('./my-project');
  console.log('Analysis complete:', result);
}

analyze().catch(console.error);
```

## 🎨 Advanced Usage with Formatting

### Detailed Analysis with Visual Progress Bars

```javascript
import { analyzeDirectory } from 'bismark-js';

async function detailedAnalysis() {
  try {
    const result = await analyzeDirectory('./src');
    
    console.log('📊 Directory Analysis Results:');
    console.log('==============================');
    
    console.log('\n🔤 Programming Languages:');
    if (result.langs.length === 0) {
      console.log('  No programming languages detected');
    } else {
      result.langs.forEach(({ lang, percent }) => {
        const bar = '█'.repeat(Math.round(percent / 5));
        console.log(`  ${lang.padEnd(15)} ${percent.toFixed(1)}% ${bar}`);
      });
    }
    
    console.log('\n🚀 Detected Frameworks:');
    if (result.frameworks.length === 0) {
      console.log('  No frameworks detected');
    } else {
      result.frameworks.forEach(framework => {
        console.log(`  ✓ ${framework}`);
      });
    }
    
    console.log('\n🚫 Ignored Files:');
    if (result.ignores.length === 0) {
      console.log('  No ignored files found');
    } else {
      const displayCount = Math.min(10, result.ignores.length);
      result.ignores.slice(0, displayCount).forEach(file => {
        console.log(`  - ${file}`);
      });
      
      if (result.ignores.length > displayCount) {
        console.log(`  ... and ${result.ignores.length - displayCount} more ignored files`);
      }
    }
    
    console.log('\n📈 Summary:');
    console.log(`  Total languages: ${result.langs.length}`);
    console.log(`  Total frameworks: ${result.frameworks.length}`);
    console.log(`  Total ignored files: ${result.ignores.length}`);
    
  } catch (error) {
    console.error('❌ Error analyzing directory:', error.message);
    process.exit(1);
  }
}

detailedAnalysis();
```

## 🔧 Using Individual Functions

### Modular Approach

```javascript
import { 
  scanDirectory,
  analyzeLanguages, 
  detectFrameworks,
  getIgnoredFiles 
} from 'bismark-js';

async function modularAnalysis(projectPath) {
  try {
    // Step 1: Scan directory for all files
    console.log('🔍 Scanning directory...');
    const files = await scanDirectory(projectPath);
    console.log(`Found ${files.length} files`);
    
    // Step 2: Analyze language distribution
    console.log('🔤 Analyzing languages...');
    const languages = await analyzeLanguages(files);
    
    // Step 3: Detect frameworks
    console.log('🚀 Detecting frameworks...');
    const frameworks = await detectFrameworks(files);
    
    // Step 4: Get ignored files
    console.log('🚫 Checking ignored files...');
    const ignored = await getIgnoredFiles(files);
    
    return {
      totalFiles: files.length,
      languages,
      frameworks,
      ignored: ignored.length
    };
    
  } catch (error) {
    console.error('Analysis failed:', error.message);
    throw error;
  }
}

// Usage
modularAnalysis('./my-project')
  .then(result => {
    console.log('📊 Analysis Results:', result);
  })
  .catch(console.error);
```

## 🌐 Web Application Integration

### Express.js API Endpoint

```javascript
import express from 'express';
import { analyzeDirectory } from 'bismark-js';

const app = express();

app.get('/api/analyze/:projectPath(*)', async (req, res) => {
  try {
    const projectPath = req.params.projectPath || './';
    const result = await analyzeDirectory(projectPath);
    
    res.json({
      success: true,
      data: result,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

app.listen(3000, () => {
  console.log('🚀 Analysis API running on http://localhost:3000');
});
```

### React Component

```jsx
import React, { useState, useEffect } from 'react';
import { analyzeDirectory } from 'bismark-js';

function ProjectAnalyzer({ projectPath }) {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function analyze() {
      if (!projectPath) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const result = await analyzeDirectory(projectPath);
        setAnalysis(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    
    analyze();
  }, [projectPath]);

  if (loading) return <div>🔍 Analyzing project...</div>;
  if (error) return <div>❌ Error: {error}</div>;
  if (!analysis) return <div>📁 Select a project to analyze</div>;

  return (
    <div className="project-analysis">
      <h2>📊 Project Analysis</h2>
      
      <section>
        <h3>🔤 Languages</h3>
        {analysis.langs.map(lang => (
          <div key={lang.lang} className="language-bar">
            <span>{lang.lang}</span>
            <span>{lang.percent}%</span>
          </div>
        ))}
      </section>
      
      <section>
        <h3>🚀 Frameworks</h3>
        <ul>
          {analysis.frameworks.map(framework => (
            <li key={framework}>{framework}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}

export default ProjectAnalyzer;
```

## 🔄 Batch Processing

### Analyze Multiple Projects

```javascript
import { analyzeDirectory } from 'bismark-js';
import { promises as fs } from 'fs';
import path from 'path';

async function batchAnalysis(rootDirectory) {
  try {
    // Get all subdirectories
    const entries = await fs.readdir(rootDirectory, { withFileTypes: true });
    const projects = entries
      .filter(entry => entry.isDirectory())
      .map(entry => entry.name);
    
    console.log(`🔍 Found ${projects.length} projects to analyze`);
    
    const results = {};
    
    for (const project of projects) {
      const projectPath = path.join(rootDirectory, project);
      
      try {
        console.log(`📊 Analyzing ${project}...`);
        const analysis = await analyzeDirectory(projectPath);
        
        results[project] = {
          success: true,
          ...analysis
        };
      } catch (error) {
        results[project] = {
          success: false,
          error: error.message
        };
      }
    }
    
    return results;
  } catch (error) {
    console.error('Batch analysis failed:', error.message);
    throw error;
  }
}

// Usage
batchAnalysis('./projects')
  .then(results => {
    console.log('📈 Batch Analysis Complete:');
    
    Object.entries(results).forEach(([project, result]) => {
      if (result.success) {
        console.log(`✅ ${project}: ${result.langs.length} languages, ${result.frameworks.length} frameworks`);
      } else {
        console.log(`❌ ${project}: ${result.error}`);
      }
    });
  })
  .catch(console.error);
```

## 📊 Generate Reports

### JSON Report Generation

```javascript
import { analyzeDirectory } from 'bismark-js';
import { promises as fs } from 'fs';

async function generateReport(projectPath, outputFile) {
  try {
    const analysis = await analyzeDirectory(projectPath);
    
    const report = {
      project: projectPath,
      timestamp: new Date().toISOString(),
      summary: {
        totalLanguages: analysis.langs.length,
        totalFrameworks: analysis.frameworks.length,
        totalIgnoredFiles: analysis.ignores.length,
        primaryLanguage: analysis.langs[0]?.lang || 'unknown'
      },
      details: analysis
    };
    
    await fs.writeFile(outputFile, JSON.stringify(report, null, 2));
    console.log(`📄 Report saved to ${outputFile}`);
    
    return report;
  } catch (error) {
    console.error('Report generation failed:', error.message);
    throw error;
  }
}

// Usage
generateReport('./my-project', 'analysis-report.json')
  .then(report => {
    console.log('📊 Report generated successfully');
    console.log(`Primary language: ${report.summary.primaryLanguage}`);
  })
  .catch(console.error);
```

## 🔍 Error Handling Best Practices

### Robust Error Handling

```javascript
import { analyzeDirectory } from 'bismark-js';

async function robustAnalysis(projectPath) {
  try {
    // Validate input
    if (!projectPath || typeof projectPath !== 'string') {
      throw new Error('Project path must be a valid string');
    }
    
    // Perform analysis
    const result = await analyzeDirectory(projectPath);
    
    // Validate results
    if (!result.langs || !Array.isArray(result.langs)) {
      console.warn('⚠️  Languages data is invalid, using empty array');
      result.langs = [];
    }
    
    if (!result.frameworks || !Array.isArray(result.frameworks)) {
      console.warn('⚠️  Frameworks data is invalid, using empty array');
      result.frameworks = [];
    }
    
    if (!result.ignores || !Array.isArray(result.ignores)) {
      console.warn('⚠️  Ignores data is invalid, using empty array');
      result.ignores = [];
    }
    
    return result;
    
  } catch (error) {
    // Handle specific error types
    if (error.code === 'ENOENT') {
      console.error('❌ Directory not found:', projectPath);
    } else if (error.code === 'EACCES') {
      console.error('❌ Permission denied:', projectPath);
    } else if (error.code === 'ENOTDIR') {
      console.error('❌ Path is not a directory:', projectPath);
    } else {
      console.error('❌ Analysis failed:', error.message);
    }
    
    // Return safe fallback
    return {
      langs: [],
      frameworks: [],
      ignores: [],
      error: error.message
    };
  }
}

// Usage with fallback
robustAnalysis('./unknown-project')
  .then(result => {
    if (result.error) {
      console.log('⚠️  Analysis completed with errors');
    } else {
      console.log('✅ Analysis completed successfully');
    }
    
    console.log(`Languages: ${result.langs.length}`);
    console.log(`Frameworks: ${result.frameworks.length}`);
  });
```

## 💡 Tips and Best Practices

1. **Performance**: For large projects, consider using the modular approach to show progress
2. **Error Handling**: Always wrap analysis calls in try-catch blocks
3. **Validation**: Validate directory paths before analysis
4. **Caching**: Cache results for frequently analyzed projects
5. **Filtering**: Filter results based on your specific needs

## 🔗 Next Steps

- Check out the [API Reference](../README.md#api-reference) for detailed function documentation
- See [Test Examples](../tests/examples.md) for more usage patterns
- Explore the [source code](../src/) for advanced customization options

