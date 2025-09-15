export const LANGUAGE_EXTENSIONS = [
	// Top 20 Most Popular Languages
	['javascript', 'js', 'jsx', 'mjs', 'cjs', 'es6', 'es'],
	['python', 'py', 'pyx', 'pyi', 'pyw', 'pyc', 'pyo', 'pyd'],
	['java', 'java', 'jar', 'class', 'jsp', 'jspx'],
	['typescript', 'ts', 'tsx', 'mts', 'cts', 'd.ts'],
	['c', 'c', 'h', 'i'],
	['cpp', 'cpp', 'cxx', 'cc', 'c++', 'hpp', 'hxx', 'h++', 'hh', 'tpp'],
	['csharp', 'cs', 'csx', 'cshtml', 'razor'],
	['php', 'php', 'phtml', 'php3', 'php4', 'php5', 'php7', 'php8', 'phps', 'phar'],
	['go', 'go', 'mod', 'sum'],
	['rust', 'rs', 'rlib'],
	
	// Mobile & Modern Languages
	['swift', 'swift', 'swiftdoc', 'swiftmodule'],
	['kotlin', 'kt', 'kts', 'ktm'],
	['dart', 'dart'],
	['objective-c', 'm', 'mm', 'h'],
	['scala', 'scala', 'sc', 'sbt'],
	['ruby', 'rb', 'rbw', 'rake', 'gemspec', 'ru', 'erb'],
	
	// Scripting & Shell Languages
	['shell', 'sh', 'bash', 'zsh', 'fish', 'ksh', 'csh', 'tcsh'],
	['powershell', 'ps1', 'psm1', 'psd1', 'ps1xml', 'psc1', 'pssc'],
	['batch', 'bat', 'cmd'],
	['perl', 'pl', 'pm', 'pod', 'perl', 't', 'psgi'],
	['lua', 'lua', 'luac'],
	['r', 'r', 'rdata', 'rds', 'rda', 'rmd', 'rnw'],
	
	// Statistical & Scientific Languages
	['matlab', 'm', 'mat', 'fig', 'mlx', 'mex'],
	['julia', 'jl'],
	['sas', 'sas', 'sas7bdat'],
	['spss', 'sps', 'spv', 'sav'],
	['stata', 'do', 'ado', 'dta'],
	['mathematica', 'nb', 'ma', 'mt', 'wl', 'wls', 'wlt'],
	
	// Functional Languages
	['haskell', 'hs', 'lhs', 'hsc'],
	['clojure', 'clj', 'cljs', 'cljc', 'edn', 'boot'],
	['fsharp', 'fs', 'fsx', 'fsi', 'fsscript'],
	['erlang', 'erl', 'hrl', 'escript'],
	['elixir', 'ex', 'exs', 'eex', 'leex'],
	['ocaml', 'ml', 'mli', 'mll', 'mly'],
	['scheme', 'scm', 'ss', 'rkt'],
	['lisp', 'lisp', 'lsp', 'l', 'cl', 'el'],
	['racket', 'rkt', 'rktl', 'rktd'],
	
	// System Languages
	['assembly', 'asm', 's', 'nasm', 'a51', 'inc'],
	['fortran', 'f', 'f90', 'f95', 'f03', 'f08', 'for', 'ftn', 'fpp'],
	['cobol', 'cob', 'cbl', 'cpy', 'copy'],
	['ada', 'ada', 'adb', 'ads'],
	['d', 'd', 'di'],
	['nim', 'nim', 'nims', 'nimble'],
	['zig', 'zig'],
	['crystal', 'cr'],
	['v', 'v', 'vh'],
	
	// Legacy & Specialized Languages
	['pascal', 'pas', 'pp', 'inc', 'dpr', 'lpr'],
	['delphi', 'dfm', 'dpr', 'dpk', 'dcp'],
	['vb', 'vb', 'vbs', 'vba', 'bas'],
	['vbnet', 'vb', 'vbhtml'],
	['foxpro', 'prg', 'fxp', 'scx', 'vcx'],
	['clipper', 'prg', 'ch'],
	['smalltalk', 'st', 'cs'],
	['forth', 'fth', 'f', '4th'],
	['tcl', 'tcl', 'tk', 'itcl'],
	['rexx', 'rex', 'rexx'],
	
	// JVM Languages
	['groovy', 'groovy', 'gvy', 'gy', 'gsh'],
	['jython', 'py', 'jy'],
	['jruby', 'rb'],
	['clojure', 'clj', 'cljs', 'cljc'],
	
	// .NET Languages
	['nemerle', 'n'],
	['boo', 'boo'],
	['ironpython', 'py'],
	['ironruby', 'rb'],
	
	// Web Assembly & Low Level
	['webassembly', 'wasm', 'wat', 'wast'],
	['llvm', 'll', 'bc'],
	
	// Database Languages
	['sql', 'sql', 'ddl', 'dml', 'pls', 'pck', 'pkb'],
	['plsql', 'sql', 'pls', 'plb', 'pck', 'pkb'],
	['tsql', 'sql'],
	['mysql', 'sql'],
	['postgresql', 'sql', 'pgsql'],
	['sqlite', 'sql', 'sqlite', 'sqlite3', 'db'],
	
	// Query Languages
	['sparql', 'rq', 'sparql'],
	['cypher', 'cyp', 'cypher'],
	['gremlin', 'groovy'],
	
	// Markup & Styling
	['html', 'html', 'htm', 'xhtml', 'shtml'],
	['css', 'css', 'scss', 'sass', 'less', 'styl', 'stylus'],
	['xml', 'xml', 'xsl', 'xslt', 'xsd', 'dtd', 'rng'],
	['xquery', 'xq', 'xql', 'xqm', 'xquery'],
	['xslt', 'xsl', 'xslt'],
	
	// Configuration & Data Formats
	['json', 'json', 'jsonl', 'ndjson', 'json5'],
	['yaml', 'yaml', 'yml'],
	['toml', 'toml'],
	['ini', 'ini', 'cfg', 'conf', 'config'],
	['properties', 'properties'],
	['hocon', 'conf'],
	
	// Documentation
	['markdown', 'md', 'markdown', 'mdown', 'mkd', 'mdx'],
	['asciidoc', 'adoc', 'asc', 'asciidoc'],
	['restructuredtext', 'rst', 'rest'],
	['latex', 'tex', 'sty', 'cls', 'bib', 'dtx'],
	['troff', 'man', '1', '2', '3', '4', '5', '6', '7', '8'],
	
	// Template Languages
	['jinja', 'j2', 'jinja', 'jinja2'],
	['mustache', 'mustache', 'hbs'],
	['handlebars', 'hbs', 'handlebars'],
	['twig', 'twig'],
	['smarty', 'tpl'],
	['velocity', 'vm', 'vsl'],
	['freemarker', 'ftl', 'ftlh'],
	
	// Modern & Emerging Languages
	['solidity', 'sol'],
	['vyper', 'vy'],
	['move', 'move'],
	['cairo', 'cairo'],
	['lean', 'lean', 'hlean'],
	['agda', 'agda', 'lagda'],
	['coq', 'v'],
	['idris', 'idr', 'lidr'],
	['purescript', 'purs'],
	['elm', 'elm'],
	['reasonml', 're', 'rei'],
	['rescript', 'res', 'resi'],
	['grain', 'gr'],
	['gleam', 'gleam'],
	
	// Build & Config Tools
	['dockerfile', 'dockerfile', 'containerfile'],
	['makefile', 'makefile', 'mk', 'mak'],
	['cmake', 'cmake', 'cmakelists.txt'],
	['gradle', 'gradle', 'gradlew'],
	['maven', 'pom.xml'],
	['ant', 'build.xml'],
	['bazel', 'build', 'workspace', 'bzl'],
	['ninja', 'ninja'],
	
	// Graphics & Shaders
	['glsl', 'glsl', 'vert', 'frag', 'geom', 'comp', 'tesc', 'tese'],
	['hlsl', 'hlsl', 'fx', 'fxh', 'vsh', 'psh'],
	['cg', 'cg', 'cgfx'],
	['metal', 'metal'],
	['opencl', 'cl'],
	['cuda', 'cu', 'cuh'],
	
	// Protocol & Interface Languages
	['graphql', 'graphql', 'gql'],
	['protobuf', 'proto'],
	['thrift', 'thrift'],
	['avro', 'avsc', 'avdl'],
	['capnproto', 'capnp'],
	['flatbuffers', 'fbs'],
	
	// Editor Configs
	['vim', 'vim', 'vimrc'],
	['emacs', 'el', 'elc'],
	['git', 'gitignore', 'gitattributes', 'gitmodules'],
	['editorconfig', 'editorconfig'],
	
	// Other Formats
	['svg', 'svg'],
	['regex', 'regex', 'regexp'],
	['awk', 'awk'],
	['sed', 'sed'],
	['postscript', 'ps', 'eps'],
	['pdf', 'pdf']
]
