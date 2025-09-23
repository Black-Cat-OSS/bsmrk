export const FRAMEWORK_PATTERNS = [
	// Frontend JavaScript Frameworks
	['react', 'jsx', 'tsx', 'react', 'package.json', '.babelrc', 'webpack.config.js', 'create-react-app'],
	['vue', 'vue', 'package.json', 'vue.config.js', 'nuxt.config.js', 'vite.config.js'],
	['angular', 'component.ts', 'module.ts', 'service.ts', 'angular.json', 'tsconfig.json', 'ng'],
	['svelte', 'svelte', 'svelte.config.js', 'vite.config.js', 'rollup.config.js'],
	['nextjs', 'pages', 'app', 'next.config.js', '_app.js', '_document.js', 'api'],
	['nuxtjs', 'nuxt.config.js', 'pages', 'components', 'layouts', 'plugins', 'middleware'],
	['gatsby', 'gatsby-config.js', 'gatsby-node.js', 'gatsby-browser.js', 'static'],
	['ember', 'ember-cli-build.js', 'app', 'tests', 'config', 'ember'],
	['backbone', 'backbone.js', 'underscore.js', 'models', 'views', 'collections'],
	['jquery', 'jquery.js', 'jquery.min.js', '$'],
	
	// CSS Frameworks & Preprocessors
	['bootstrap', 'bootstrap.css', 'bootstrap.js', 'bootstrap.min.css', 'bootstrap.scss'],
	['tailwindcss', 'tailwind.config.js', 'tailwind.css', '@tailwind', 'postcss.config.js'],
	['bulma', 'bulma.css', 'bulma.scss', 'bulma.min.css'],
	['foundation', 'foundation.css', 'foundation.js', '_settings.scss'],
	['materialize', 'materialize.css', 'materialize.js', 'material-icons'],
	['semantic-ui', 'semantic.css', 'semantic.js', 'semantic.min.css'],
	['sass', 'scss', 'sass', '_variables.scss', '_mixins.scss'],
	['less', 'less', 'variables.less', 'mixins.less'],
	['stylus', 'styl', 'stylus', 'nib'],
	
	// Backend Node.js Frameworks
	['express', 'express', 'app.js', 'server.js', 'routes', 'middleware'],
	['fastify', 'fastify', 'plugins', 'routes', 'schemas'],
	['koa', 'koa', 'app.js', 'middleware', 'ctx'],
	['nestjs', 'nest', 'main.ts', 'app.module.ts', 'controller.ts', 'service.ts'],
	['hapi', 'hapi', 'server.js', 'routes', 'plugins'],
	['sails', 'sails', 'config', 'api', 'views', 'assets'],
	['meteor', 'meteor', '.meteor', 'client', 'server', 'imports'],
	['strapi', 'strapi', 'config', 'api', 'extensions', 'public'],
	
	// Python Frameworks
	['django', 'django', 'manage.py', 'settings.py', 'urls.py', 'models.py', 'views.py'],
	['flask', 'flask', 'app.py', 'run.py', 'config.py', 'requirements.txt'],
	['fastapi', 'fastapi', 'main.py', 'routers', 'models', 'schemas'],
	['tornado', 'tornado', 'handlers', 'templates', 'static'],
	['pyramid', 'pyramid', 'development.ini', 'production.ini', '__init__.py'],
	['bottle', 'bottle', 'app.py', 'bottle.py'],
	['cherrypy', 'cherrypy', 'server.py', 'config.conf'],
	['web2py', 'web2py', 'applications', 'controllers', 'models', 'views'],
	['turbogears', 'turbogears', 'setup.py', 'development.ini'],
	
	// Java Frameworks
	['spring', 'spring', 'pom.xml', 'application.properties', 'SpringBootApplication', '@Controller'],
	['spring-boot', 'spring-boot', 'application.yml', 'SpringBootApplication', '@RestController'],
	['hibernate', 'hibernate', 'hibernate.cfg.xml', '@Entity', '@Table'],
	['struts', 'struts', 'struts.xml', 'struts-config.xml', 'Action'],
	['jsf', 'jsf', 'faces-config.xml', 'xhtml', 'ManagedBean'],
	['wicket', 'wicket', 'WebPage', 'WebApplication', 'html'],
	['vaadin', 'vaadin', 'UI', 'Component', 'Layout'],
	['play', 'play', 'conf', 'app', 'build.sbt', 'routes'],
	
	// PHP Frameworks
	['laravel', 'laravel', 'artisan', 'composer.json', 'app', 'routes', 'config'],
	['symfony', 'symfony', 'composer.json', 'src', 'config', 'templates', 'bin/console'],
	['codeigniter', 'codeigniter', 'system', 'application', 'index.php'],
	['cakephp', 'cakephp', 'src', 'config', 'webroot', 'composer.json'],
	['zend', 'zend', 'module', 'config', 'public', 'composer.json'],
	['yii', 'yii', 'protected', 'assets', 'index.php', 'yii'],
	['phalcon', 'phalcon', 'app', 'public', 'config'],
	['slim', 'slim', 'composer.json', 'public', 'src'],
	
	// Ruby Frameworks
	['rails', 'rails', 'Gemfile', 'config', 'app', 'db', 'Rakefile', 'application.rb'],
	['sinatra', 'sinatra', 'Gemfile', 'app.rb', 'config.ru'],
	['hanami', 'hanami', 'Gemfile', 'config', 'lib', 'apps'],
	['padrino', 'padrino', 'Gemfile', 'config', 'app', 'models'],
	['cuba', 'cuba', 'Gemfile', 'config.ru', 'app.rb'],
	
	// C# / .NET Frameworks
	['aspnet', 'aspnet', 'Global.asax', 'web.config', 'App_Start', 'Controllers'],
	['aspnet-core', 'aspnet-core', 'Startup.cs', 'Program.cs', 'appsettings.json', 'Controllers'],
	['mvc', 'mvc', 'Controllers', 'Views', 'Models', 'RouteConfig'],
	['webapi', 'webapi', 'ApiController', 'WebApiConfig', 'Controllers'],
	['blazor', 'blazor', 'razor', 'Components', 'Pages', '_Imports.razor'],
	['xamarin', 'xamarin', 'MainActivity.cs', 'AppDelegate.cs', 'packages.config'],
	['unity', 'unity', 'MonoBehaviour', 'GameObject', 'Transform', 'cs'],
	
	// Go Frameworks
	['gin', 'gin', 'main.go', 'go.mod', 'router', 'handlers'],
	['echo', 'echo', 'main.go', 'go.mod', 'handlers', 'middleware'],
	['fiber', 'fiber', 'main.go', 'go.mod', 'routes', 'handlers'],
	['beego', 'beego', 'main.go', 'conf', 'controllers', 'models'],
	['revel', 'revel', 'app', 'conf', 'public', 'tests'],
	
	// Rust Frameworks
	['actix-web', 'actix-web', 'Cargo.toml', 'main.rs', 'handlers', 'routes'],
	['rocket', 'rocket', 'Cargo.toml', 'main.rs', 'routes', 'guards'],
	['warp', 'warp', 'Cargo.toml', 'main.rs', 'filters', 'handlers'],
	['tide', 'tide', 'Cargo.toml', 'main.rs', 'routes', 'middleware'],
	
	// Swift Frameworks
	['vapor', 'vapor', 'Package.swift', 'main.swift', 'Sources', 'Routes'],
	['perfect', 'perfect', 'Package.swift', 'Sources', 'webroot'],
	['kitura', 'kitura', 'Package.swift', 'Sources', 'public'],
	
	// Kotlin Frameworks
	['ktor', 'ktor', 'Application.kt', 'routing', 'plugins', 'resources'],
	['spring-kotlin', 'spring', 'Application.kt', 'Controller.kt', 'Service.kt'],
	
	// Scala Frameworks
	['akka', 'akka', 'build.sbt', 'Actor', 'ActorSystem', 'Props'],
	['play-scala', 'play', 'build.sbt', 'conf', 'app', 'routes'],
	
	// Mobile Frameworks
	['react-native', 'react-native', 'package.json', 'App.js', 'android', 'ios'],
	['flutter', 'flutter', 'pubspec.yaml', 'lib', 'android', 'ios', 'dart'],
	['ionic', 'ionic', 'ionic.config.json', 'src', 'www', 'config.xml'],
	['cordova', 'cordova', 'config.xml', 'www', 'platforms', 'plugins'],
	['xamarin-forms', 'xamarin', 'App.xaml', 'MainPage.xaml', 'packages.config'],
	
	// Desktop Frameworks
	['electron', 'electron', 'package.json', 'main.js', 'renderer.js', 'preload.js'],
	['tauri', 'tauri', 'tauri.conf.json', 'Cargo.toml', 'src-tauri', 'dist'],
	['nwjs', 'nwjs', 'package.json', 'index.html', 'nw'],
	['qt', 'qt', 'CMakeLists.txt', 'main.cpp', 'ui', 'qrc'],
	['gtk', 'gtk', 'Makefile', 'main.c', 'glade', 'ui'],
	['tkinter', 'tkinter', 'main.py', 'gui.py', 'tk'],
	['wxpython', 'wxpython', 'main.py', 'frame.py', 'panel.py'],
	
	// Game Development Frameworks
	['unity3d', 'unity', 'Assets', 'ProjectSettings', 'Library', 'scene'],
	['unreal', 'unreal', 'Source', 'Content', 'Config', 'uproject'],
	['godot', 'godot', 'project.godot', 'scenes', 'scripts', 'gd'],
	['pygame', 'pygame', 'main.py', 'sprites', 'sounds', 'images'],
	['phaser', 'phaser', 'game.js', 'scenes', 'assets', 'sprites'],
	['love2d', 'love2d', 'main.lua', 'conf.lua', 'assets'],
	['cocos2d', 'cocos2d', 'Classes', 'Resources', 'proj.android'],
	
	// Testing Frameworks
	['jest', 'jest', 'jest.config.js', '__tests__', 'test.js', 'spec.js'],
	['mocha', 'mocha', 'mocha.opts', 'test', 'spec', 'describe'],
	['jasmine', 'jasmine', 'jasmine.json', 'spec', 'describe', 'it'],
	['cypress', 'cypress', 'cypress.json', 'cypress', 'integration', 'fixtures'],
	['selenium', 'selenium', 'webdriver', 'test', 'driver'],
	['puppeteer', 'puppeteer', 'puppeteer', 'browser', 'page'],
	['playwright', 'playwright', 'playwright.config.js', 'tests', 'browser'],
	['junit', 'junit', 'Test.java', '@Test', 'Assert'],
	['pytest', 'pytest', 'test_', 'conftest.py', 'pytest.ini'],
	['rspec', 'rspec', 'spec', '_spec.rb', 'describe', 'it'],
	
	// Build Tools & Task Runners
	['webpack', 'webpack', 'webpack.config.js', 'webpack.dev.js', 'webpack.prod.js'],
	['vite', 'vite', 'vite.config.js', 'vite.config.ts', 'index.html'],
	['rollup', 'rollup', 'rollup.config.js', 'rollup.config.mjs'],
	['parcel', 'parcel', 'package.json', '.parcelrc', 'dist'],
	['gulp', 'gulp', 'gulpfile.js', 'gulpfile.babel.js', 'tasks'],
	['grunt', 'grunt', 'Gruntfile.js', 'Gruntfile.coffee', 'tasks'],
	['browserify', 'browserify', 'package.json', 'bundle.js'],
	
	// CSS-in-JS & Styling
	['styled-components', 'styled-components', 'styled', 'ThemeProvider'],
	['emotion', 'emotion', '@emotion', 'css', 'styled'],
	['jss', 'jss', 'makeStyles', 'withStyles', 'createUseStyles'],
	['stitches', 'stitches', 'styled', 'css', 'theme'],
	
	// State Management
	['redux', 'redux', 'store', 'reducers', 'actions', 'middleware'],
	['mobx', 'mobx', 'observable', 'action', 'computed'],
	['vuex', 'vuex', 'store', 'mutations', 'actions', 'getters'],
	['ngrx', 'ngrx', 'store', 'effects', 'reducers', 'actions'],
	['recoil', 'recoil', 'atom', 'selector', 'RecoilRoot'],
	['zustand', 'zustand', 'create', 'store', 'set', 'get'],
	
	// Database ORMs & ODMs
	['mongoose', 'mongoose', 'Schema', 'model', 'connect'],
	['sequelize', 'sequelize', 'models', 'migrations', 'seeders'],
	['typeorm', 'typeorm', '@Entity', '@Column', 'Repository'],
	['prisma', 'prisma', 'schema.prisma', 'client', 'migrate'],
	['knex', 'knex', 'knexfile.js', 'migrations', 'seeds'],
	['bookshelf', 'bookshelf', 'models', 'collections'],
	['objection', 'objection', 'Model', 'knex', 'relations'],
	['eloquent', 'eloquent', 'Model', 'migrations', 'factories'],
	['doctrine', 'doctrine', '@Entity', '@Column', '@Table'],
	['activerecord', 'activerecord', 'models', 'migrations', 'db'],
	
	// API & GraphQL
	['apollo', 'apollo', 'apollo.config.js', 'schema', 'resolvers'],
	['graphql', 'graphql', 'schema.graphql', 'resolvers', 'typeDefs'],
	['relay', 'relay', 'relay.config.js', 'queries', 'mutations'],
	['swagger', 'swagger', 'swagger.json', 'swagger.yaml', 'openapi'],
	['postman', 'postman', 'collection.json', 'environment.json'],
	
	// DevOps & Deployment
	['docker', 'docker', 'Dockerfile', 'docker-compose.yml', '.dockerignore'],
	['kubernetes', 'kubernetes', 'deployment.yaml', 'service.yaml', 'configmap.yaml'],
	['terraform', 'terraform', 'main.tf', 'variables.tf', 'outputs.tf'],
	['ansible', 'ansible', 'playbook.yml', 'inventory', 'roles'],
	['vagrant', 'vagrant', 'Vagrantfile', 'provision.sh'],
	['jenkins', 'jenkins', 'Jenkinsfile', 'pipeline', 'stages'],
	['github-actions', 'github-actions', '.github/workflows', 'workflow.yml'],
	['gitlab-ci', 'gitlab-ci', '.gitlab-ci.yml', 'stages', 'jobs'],
	
	// CMS & E-commerce
	['wordpress', 'wordpress', 'wp-config.php', 'wp-content', 'themes', 'plugins'],
	['drupal', 'drupal', 'index.php', 'sites', 'modules', 'themes'],
	['joomla', 'joomla', 'configuration.php', 'components', 'modules'],
	['magento', 'magento', 'app', 'skin', 'var', 'media'],
	['shopify', 'shopify', 'liquid', 'templates', 'assets', 'config'],
	['woocommerce', 'woocommerce', 'wp-content', 'plugins', 'woocommerce'],
	
	// Microservices & Cloud
	['serverless', 'serverless', 'serverless.yml', 'handler.js', 'functions'],
	['aws-lambda', 'aws-lambda', 'lambda_function.py', 'handler.js', 'index.js'],
	['azure-functions', 'azure-functions', 'function.json', 'host.json', '__init__.py'],
	['google-cloud-functions', 'google-cloud-functions', 'main.py', 'main.js', 'requirements.txt'],
	
	// Analytics & Monitoring
	['google-analytics', 'google-analytics', 'gtag', 'analytics.js', 'ga'],
	['sentry', 'sentry', 'sentry.properties', '@sentry', 'dsn'],
	['newrelic', 'newrelic', 'newrelic.ini', 'newrelic.js', 'agent'],
	['datadog', 'datadog', 'datadog.yaml', 'dd-trace', 'statsd']
]
