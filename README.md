# 🔍 BismarkJS - Directory Analyzer

[![npm version](https://badge.fury.io/js/bismark-js.svg)](https://badge.fury.io/js/bismark-js)
[![CI/CD Pipeline](https://github.com/your-username/bismark-js/workflows/CI/CD%20Pipeline/badge.svg)](https://github.com/your-username/bismark-js/actions)
[![License](https://img.shields.io/badge/license-ISC-blue.svg)](LICENSE.md)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org/)

BismarkJS is a powerful, lightweight directory analyzer that can detect programming languages, frameworks, and ignored files in any project directory. Perfect for project analysis, documentation generation, and development tools.

## 📦 Installation

```bash
# npm
npm install bismark-js

# yarn
yarn add bismark-js

# pnpm
pnpm add bismark-js
```

## 🚀 Quick Start

### ES Modules
```javascript
import { analyzeDirectory } from 'bismark-js';

const result = await analyzeDirectory('./my-project');
console.log(result);
```

### CommonJS
```javascript
const { analyzeDirectory } = require('bismark-js');

async function analyze() {
  const result = await analyzeDirectory('./my-project');
  console.log(result);
}
```

### Example Output
```json
{
  "langs": [
    { "lang": "javascript", "percent": 65.5 },
    { "lang": "typescript", "percent": 30.2 },
    { "lang": "css", "percent": 4.3 }
  ],
  "frameworks": ["react", "nextjs", "tailwind"],
  "ignores": ["node_modules/", ".git/", "dist/"]
}
```

## 🔧 API Reference

### `analyzeDirectory(path)`
Analyzes a directory and returns comprehensive information about its contents.

**Parameters:**
- `path` (string): Path to the directory to analyze

**Returns:**
- `Promise<{langs, frameworks, ignores}>`: Analysis results
  - `langs`: Array of detected languages with percentages
  - `frameworks`: Array of detected frameworks
  - `ignores`: Array of ignored files and directories

### Individual Functions
```javascript
import { 
  scanDirectory,
  analyzeLanguages, 
  detectFrameworks,
  getIgnoredFiles 
} from 'bismark-js';

// Scan directory for all files
const files = await scanDirectory('./project');

// Analyze language distribution
const languages = await analyzeLanguages(files);

// Detect frameworks
const frameworks = await detectFrameworks(files);

// Get ignored files
const ignored = await getIgnoredFiles(files);
```

## 📚 Documentation

- 🚀 **[Quick Start Guide](docs/QUICK_START.md)** - Get up and running in minutes
- 📖 **[Examples](docs/EXAMPLES.md)** - Comprehensive usage examples
- 🧪 **[Testing Guide](docs/TEST_GUIDE.md)** - Comprehensive testing documentation
- 🔄 **[CI/CD Guide](docs/CI_CD_GUIDE.md)** - Continuous Integration and Deployment
- 🧪 **[Test Examples](tests/examples.md)** - Real-world test cases

## 🚀 CI/CD Pipeline

This project features a fully automated CI/CD pipeline that ensures code quality and seamless releases:

### 🔄 **Automated Workflow**
- **✅ Continuous Testing**: All tests run automatically on push and pull requests
- **📊 Multi-Version Testing**: Tests run on Node.js 18, 20, and 22
- **🏗️ Automatic Building**: Package builds and artifacts validation
- **🏷️ Smart Versioning**: Automatic version bumping with semantic strategy
- **📦 Auto-Publishing**: Seamless NPM package publishing
- **📋 Release Notes**: Auto-generated GitHub releases with changelogs

### 📈 **Version Strategy**
- **Minor versions** increment automatically (1.0.0 → 1.1.0 → 1.2.0...)
- **Major version** bumps when minor reaches 10 (1.9.0 → 2.0.0)
- **Patch versions** reset to 0 on each minor/major bump
- **Tags created** automatically for each release

### 🎯 **Quality Gates**
- All tests must pass before versioning
- Build artifacts must be valid
- Multi-platform compatibility verified
- No deployment on test failures

## 🚀 Supported Languages

Bismark supports **100+ programming languages** with over **500 file extensions**. The language detection system is organized into comprehensive categories:

### 🔥 **Top 20 Most Popular Languages**
- **JavaScript** - js, jsx, mjs, cjs, es6, es
- **Python** - py, pyx, pyi, pyw, pyc, pyo, pyd
- **Java** - java, jar, class, jsp, jspx
- **TypeScript** - ts, tsx, mts, cts, d.ts
- **C** - c, h, i
- **C++** - cpp, cxx, cc, c++, hpp, hxx, h++, hh, tpp
- **C#** - cs, csx, cshtml, razor
- **PHP** - php, phtml, php3-8, phps, phar
- **Go** - go, mod, sum
- **Rust** - rs, rlib

### 📱 **Mobile & Modern Languages**
- **Swift** - swift, swiftdoc, swiftmodule
- **Kotlin** - kt, kts, ktm
- **Dart** - dart
- **Objective-C** - m, mm, h
- **Scala** - scala, sc, sbt
- **Ruby** - rb, rbw, rake, gemspec, ru, erb

### 🔧 **Scripting & Shell Languages**
- **Shell** - sh, bash, zsh, fish, ksh, csh, tcsh
- **PowerShell** - ps1, psm1, psd1, ps1xml, psc1, pssc
- **Batch** - bat, cmd
- **Perl** - pl, pm, pod, perl, t, psgi
- **Lua** - lua, luac
- **R** - r, rdata, rds, rda, rmd, rnw

### 📊 **Statistical & Scientific Languages**
- **MATLAB** - m, mat, fig, mlx, mex
- **Julia** - jl
- **SAS** - sas, sas7bdat
- **SPSS** - sps, spv, sav
- **Stata** - do, ado, dta
- **Mathematica** - nb, ma, mt, wl, wls, wlt

### 🔄 **Functional Languages**
- **Haskell** - hs, lhs, hsc
- **Clojure** - clj, cljs, cljc, edn, boot
- **F#** - fs, fsx, fsi, fsscript
- **Erlang** - erl, hrl, escript
- **Elixir** - ex, exs, eex, leex
- **OCaml** - ml, mli, mll, mly
- **Scheme** - scm, ss, rkt
- **Lisp** - lisp, lsp, l, cl, el
- **Racket** - rkt, rktl, rktd

### ⚡ **System Languages**
- **Assembly** - asm, s, nasm, a51, inc
- **Fortran** - f, f90, f95, f03, f08, for, ftn, fpp
- **COBOL** - cob, cbl, cpy, copy
- **Ada** - ada, adb, ads
- **D** - d, di
- **Nim** - nim, nims, nimble
- **Zig** - zig
- **Crystal** - cr
- **V** - v, vh

### 🏛️ **Legacy & Specialized Languages**
- **Pascal** - pas, pp, inc, dpr, lpr
- **Delphi** - dfm, dpr, dpk, dcp
- **Visual Basic** - vb, vbs, vba, bas
- **VB.NET** - vb, vbhtml
- **FoxPro** - prg, fxp, scx, vcx
- **Clipper** - prg, ch
- **Smalltalk** - st, cs
- **Forth** - fth, f, 4th
- **TCL** - tcl, tk, itcl
- **REXX** - rex, rexx

### ☕ **JVM Languages**
- **Groovy** - groovy, gvy, gy, gsh
- **Jython** - py, jy
- **JRuby** - rb

### 🔷 **.NET Languages**
- **Nemerle** - n
- **Boo** - boo
- **IronPython** - py
- **IronRuby** - rb

### 🌐 **Web Assembly & Low Level**
- **WebAssembly** - wasm, wat, wast
- **LLVM** - ll, bc

### 🗄️ **Database Languages**
- **SQL** - sql, ddl, dml, pls, pck, pkb
- **PL/SQL** - sql, pls, plb, pck, pkb
- **T-SQL** - sql
- **MySQL** - sql
- **PostgreSQL** - sql, pgsql
- **SQLite** - sql, sqlite, sqlite3, db

### 🔍 **Query Languages**
- **SPARQL** - rq, sparql
- **Cypher** - cyp, cypher
- **Gremlin** - groovy

### 🌐 **Markup & Styling**
- **HTML** - html, htm, xhtml, shtml
- **CSS** - css, scss, sass, less, styl, stylus
- **XML** - xml, xsl, xslt, xsd, dtd, rng
- **XQuery** - xq, xql, xqm, xquery
- **XSLT** - xsl, xslt

### 📄 **Configuration & Data Formats**
- **JSON** - json, jsonl, ndjson, json5
- **YAML** - yaml, yml
- **TOML** - toml
- **INI** - ini, cfg, conf, config
- **Properties** - properties
- **HOCON** - conf

### 📝 **Documentation**
- **Markdown** - md, markdown, mdown, mkd, mdx
- **AsciiDoc** - adoc, asc, asciidoc
- **reStructuredText** - rst, rest
- **LaTeX** - tex, sty, cls, bib, dtx
- **Troff** - man, 1, 2, 3, 4, 5, 6, 7, 8

### 🎨 **Template Languages**
- **Jinja** - j2, jinja, jinja2
- **Mustache** - mustache, hbs
- **Handlebars** - hbs, handlebars
- **Twig** - twig
- **Smarty** - tpl
- **Velocity** - vm, vsl
- **FreeMarker** - ftl, ftlh

### 🚀 **Modern & Emerging Languages**
- **Solidity** - sol
- **Vyper** - vy
- **Move** - move
- **Cairo** - cairo
- **Lean** - lean, hlean
- **Agda** - agda, lagda
- **Coq** - v
- **Idris** - idr, lidr
- **PureScript** - purs
- **Elm** - elm
- **ReasonML** - re, rei
- **ReScript** - res, resi
- **Grain** - gr
- **Gleam** - gleam

### 🔧 **Build & Config Tools**
- **Dockerfile** - dockerfile, containerfile
- **Makefile** - makefile, mk, mak
- **CMake** - cmake, cmakelists.txt
- **Gradle** - gradle, gradlew
- **Maven** - pom.xml
- **Ant** - build.xml
- **Bazel** - build, workspace, bzl
- **Ninja** - ninja

### 🎨 **Graphics & Shaders**
- **GLSL** - glsl, vert, frag, geom, comp, tesc, tese
- **HLSL** - hlsl, fx, fxh, vsh, psh
- **CG** - cg, cgfx
- **Metal** - metal
- **OpenCL** - cl
- **CUDA** - cu, cuh

### 🔌 **Protocol & Interface Languages**
- **GraphQL** - graphql, gql
- **Protocol Buffers** - proto
- **Thrift** - thrift
- **Avro** - avsc, avdl
- **Cap'n Proto** - capnp
- **FlatBuffers** - fbs

### ⚙️ **Editor Configs**
- **Vim** - vim, vimrc
- **Emacs** - el, elc
- **Git** - gitignore, gitattributes, gitmodules
- **EditorConfig** - editorconfig

### 📋 **Other Formats**
- **SVG** - svg
- **Regex** - regex, regexp
- **AWK** - awk
- **SED** - sed
- **PostScript** - ps, eps
- **PDF** - pdf

## 🔧 Features

- **Zero Dependencies**: Lightweight solution for project analysis
- **Comprehensive Language Support**: 100+ programming languages
- **Smart File Detection**: MIME-type based detection with fallback to extensions
- **Extensible**: Easy to add new languages and file types
- **Fast Processing**: Efficient file traversal and analysis
- **Multiple Output Formats**: JSON, plain text, and multipart responses
- **🚀 Automated CI/CD**: Continuous integration with automatic versioning and releases
- **📊 Quality Assurance**: Automated testing on multiple Node.js versions (16, 18, 20)
- **🔄 Smart Versioning**: Automatic version bumping with semantic release strategy

## 📦 API Endpoints

- `GET /tree/:project` - Get project file tree
- `GET /:project/meta-table` - Get file metadata with language tags
- `GET /both/:project` - Get combined tree and content data

---

Developed by letnull19a and Black Cat OSS