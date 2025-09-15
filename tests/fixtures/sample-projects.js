/**
 * Predefined project structures for testing
 */

export const REACT_PROJECT = {
  'package.json': JSON.stringify({
    "name": "react-test-app",
    "version": "0.1.0",
    "dependencies": {
      "react": "^18.2.0",
      "react-dom": "^18.2.0",
      "react-scripts": "5.0.1"
    },
    "scripts": {
      "start": "react-scripts start",
      "build": "react-scripts build"
    }
  }, null, 2),
  
  'src': {
    'App.js': `import React from 'react';
import './App.css';
import Header from './components/Header';

function App() {
  return (
    <div className="App">
      <Header />
      <main>
        <h1>Welcome to React</h1>
      </main>
    </div>
  );
}

export default App;`,

    'App.css': `.App {
  text-align: center;
}

.App-header {
  background-color: #282c34;
  padding: 20px;
  color: white;
}`,

    'index.js': `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);`,

    'components': {
      'Header.jsx': `import React from 'react';

const Header = () => {
  return (
    <header className="App-header">
      <h2>My React App</h2>
    </header>
  );
};

export default Header;`,

      'Button.tsx': `import React from 'react';

interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
}

const Button: React.FC<ButtonProps> = ({ 
  onClick, 
  children, 
  variant = 'primary' 
}) => {
  return (
    <button 
      className={\`btn btn-\${variant}\`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;`
    }
  },
  
  'public': {
    'index.html': `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>React App</title>
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
  </body>
</html>`
  },
  
  '.gitignore': `node_modules
/build
.env.local
.env.development.local
.env.test.local
.env.production.local`,

  'README.md': `# React Test App

This is a test React application.

## Available Scripts

- \`npm start\` - Runs the app in development mode
- \`npm run build\` - Builds the app for production`
}

export const VUE_PROJECT = {
  'package.json': JSON.stringify({
    "name": "vue-test-app",
    "version": "0.1.0",
    "dependencies": {
      "vue": "^3.3.0",
      "@vitejs/plugin-vue": "^4.0.0"
    },
    "scripts": {
      "dev": "vite",
      "build": "vite build"
    }
  }, null, 2),
  
  'vite.config.js': `import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()]
})`,

  'src': {
    'App.vue': `<template>
  <div id="app">
    <Header />
    <main>
      <HelloWorld msg="Welcome to Vue.js" />
    </main>
  </div>
</template>

<script>
import Header from './components/Header.vue'
import HelloWorld from './components/HelloWorld.vue'

export default {
  name: 'App',
  components: {
    Header,
    HelloWorld
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
  color: #2c3e50;
}
</style>`,

    'main.js': `import { createApp } from 'vue'
import App from './App.vue'

createApp(App).mount('#app')`,

    'components': {
      'Header.vue': `<template>
  <header class="header">
    <h1>Vue Test App</h1>
  </header>
</template>

<script>
export default {
  name: 'Header'
}
</script>

<style scoped>
.header {
  background-color: #42b883;
  color: white;
  padding: 1rem;
}
</style>`,

      'HelloWorld.vue': `<template>
  <div class="hello">
    <h2>{{ msg }}</h2>
    <p>Vue.js component example</p>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  props: {
    msg: String
  }
}
</script>

<style scoped>
.hello {
  margin: 2rem 0;
}
</style>`
    }
  },
  
  'index.html': `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Vue App</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.js"></script>
  </body>
</html>`
}

export const NODE_EXPRESS_PROJECT = {
  'package.json': JSON.stringify({
    "name": "express-test-app",
    "version": "1.0.0",
    "main": "server.js",
    "dependencies": {
      "express": "^4.18.2",
      "cors": "^2.8.5",
      "dotenv": "^16.0.3"
    },
    "scripts": {
      "start": "node server.js",
      "dev": "nodemon server.js"
    }
  }, null, 2),
  
  'server.js': `const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/users', require('./routes/users'));
app.use('/api/auth', require('./routes/auth'));

app.get('/', (req, res) => {
  res.json({ message: 'Express server is running!' });
});

app.listen(PORT, () => {
  console.log(\`Server is running on port \${PORT}\`);
});`,
  
  'routes': {
    'users.js': `const express = require('express');
const router = express.Router();

// GET /api/users
router.get('/', (req, res) => {
  res.json([
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
  ]);
});

// POST /api/users
router.post('/', (req, res) => {
  const { name, email } = req.body;
  res.json({ id: Date.now(), name, email });
});

module.exports = router;`,

    'auth.js': `const express = require('express');
const router = express.Router();

// POST /api/auth/login
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  
  // Simple validation
  if (email === 'admin@example.com' && password === 'password') {
    res.json({ 
      token: 'fake-jwt-token',
      user: { id: 1, email, role: 'admin' }
    });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

module.exports = router;`
  },
  
  'middleware': {
    'auth.js': `const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.sendStatus(401);
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

module.exports = authenticateToken;`
  },
  
  '.env': `PORT=3000
JWT_SECRET=your-secret-key
NODE_ENV=development`,
  
  '.gitignore': `node_modules/
.env
*.log`
}

export const PYTHON_FLASK_PROJECT = {
  'app.py': `from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/')
def hello():
    return jsonify({"message": "Flask server is running!"})

@app.route('/api/users', methods=['GET', 'POST'])
def users():
    if request.method == 'GET':
        return jsonify([
            {"id": 1, "name": "John Doe", "email": "john@example.com"},
            {"id": 2, "name": "Jane Smith", "email": "jane@example.com"}
        ])
    
    elif request.method == 'POST':
        data = request.get_json()
        return jsonify({
            "id": 1,
            "name": data.get("name"),
            "email": data.get("email")
        })

if __name__ == '__main__':
    app.run(debug=True)`,
    
  'requirements.txt': `Flask==2.3.3
Flask-CORS==4.0.0
python-dotenv==1.0.0`,

  'models': {
    '__init__.py': '',
    'user.py': `class User:
    def __init__(self, id, name, email):
        self.id = id
        self.name = name
        self.email = email
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email
        }
    
    @staticmethod
    def from_dict(data):
        return User(
            data.get('id'),
            data.get('name'),
            data.get('email')
        )`
  },
  
  'utils': {
    '__init__.py': '',
    'helpers.py': `import json
from datetime import datetime

def format_response(data, status='success'):
    """Format API response"""
    return {
        'status': status,
        'data': data,
        'timestamp': datetime.utcnow().isoformat()
    }

def validate_email(email):
    """Simple email validation"""
    return '@' in email and '.' in email.split('@')[1]`
  },
  
  'tests': {
    '__init__.py': '',
    'test_app.py': `import unittest
from app import app

class TestApp(unittest.TestCase):
    def setUp(self):
        self.app = app.test_client()
        self.app.testing = True
    
    def test_hello_route(self):
        response = self.app.get('/')
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertIn('message', data)
    
    def test_users_get(self):
        response = self.app.get('/api/users')
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertIsInstance(data, list)

if __name__ == '__main__':
    unittest.main()`
  }
}

export const MIXED_LANGUAGE_PROJECT = {
  'package.json': JSON.stringify({
    "name": "mixed-project",
    "version": "1.0.0",
    "scripts": {
      "build": "webpack --mode production",
      "test": "jest"
    }
  }, null, 2),
  
  'frontend': {
    'src': {
      'index.js': `import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

const root = createRoot(document.getElementById('root'));
root.render(<App />);`,
      
      'App.tsx': `import React from 'react';
import { useState } from 'react';

interface AppProps {
  title?: string;
}

const App: React.FC<AppProps> = ({ title = 'Mixed Project' }) => {
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <h1>{title}</h1>
      <button onClick={() => setCount(count + 1)}>
        Count: {count}
      </button>
    </div>
  );
};

export default App;`,
      
      'styles': {
        'main.scss': `$primary-color: #007bff;
$secondary-color: #6c757d;

.app {
  font-family: Arial, sans-serif;
  
  h1 {
    color: $primary-color;
    font-size: 2rem;
  }
  
  button {
    background-color: $primary-color;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    
    &:hover {
      background-color: darken($primary-color, 10%);
    }
  }
}`,
        
        'components.css': `.button {
  display: inline-block;
  padding: 8px 16px;
  margin: 4px;
  border-radius: 4px;
  text-decoration: none;
  transition: all 0.3s ease;
}

.button-primary {
  background-color: #007bff;
  color: white;
}

.button-secondary {
  background-color: #6c757d;
  color: white;
}`
      }
    }
  },
  
  'backend': {
    'server.py': `#!/usr/bin/env python3
"""
Flask backend server
"""
from flask import Flask, jsonify, request
from flask_cors import CORS
import json
import os

app = Flask(__name__)
CORS(app)

@app.route('/api/data')
def get_data():
    return jsonify({
        'message': 'Data from Python backend',
        'items': ['item1', 'item2', 'item3']
    })

@app.route('/api/process', methods=['POST'])
def process_data():
    data = request.get_json()
    result = {
        'processed': True,
        'input': data,
        'output': len(data.get('text', '')) if 'text' in data else 0
    }
    return jsonify(result)

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)`,
    
    'models.py': `"""
Database models
"""
from dataclasses import dataclass
from typing import List, Optional
from datetime import datetime

@dataclass
class User:
    id: int
    username: str
    email: str
    created_at: datetime
    
    def to_dict(self) -> dict:
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'created_at': self.created_at.isoformat()
        }

@dataclass
class Project:
    id: int
    name: str
    description: str
    owner_id: int
    tags: List[str]
    
    def to_dict(self) -> dict:
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'owner_id': self.owner_id,
            'tags': self.tags
        }`
  },
  
  'shared': {
    'utils.js': `/**
 * Shared utilities for frontend and backend
 */

export function formatDate(date) {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(new Date(date));
}

export function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export const API_ENDPOINTS = {
  USERS: '/api/users',
  PROJECTS: '/api/projects',
  AUTH: '/api/auth'
};`,
    
    'constants.py': `"""
Shared constants
"""

API_VERSION = "1.0.0"
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB
ALLOWED_EXTENSIONS = {'.txt', '.pdf', '.png', '.jpg', '.jpeg', '.gif'}

DEFAULT_PAGINATION = {
    'page': 1,
    'per_page': 20,
    'max_per_page': 100
}

STATUS_CODES = {
    'SUCCESS': 200,
    'CREATED': 201,
    'BAD_REQUEST': 400,
    'UNAUTHORIZED': 401,
    'FORBIDDEN': 403,
    'NOT_FOUND': 404,
    'INTERNAL_ERROR': 500
}`
  },
  
  'config': {
    'webpack.config.js': `const path = require('path');

module.exports = {
  entry: './frontend/src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-react', '@babel/preset-typescript']
          }
        }
      },
      {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader']
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx']
  }
};`,
    
    'database.json': `{
  "development": {
    "host": "localhost",
    "port": 5432,
    "database": "mixed_project_dev",
    "username": "dev_user",
    "password": "dev_password"
  },
  "production": {
    "host": "prod-db.example.com",
    "port": 5432,
    "database": "mixed_project_prod",
    "username": "prod_user",
    "password": "prod_password"
  }
}`,

    'babel.config.js': `module.exports = {
  presets: [
    '@babel/preset-env',
    '@babel/preset-react',
    '@babel/preset-typescript'
  ],
  plugins: [
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-transform-runtime'
  ]
};`
  },
  
  'docs': {
    'API.md': `# API Documentation

## Endpoints

### GET /api/data
Returns application data.

**Response:**
\`\`\`json
{
  "message": "Data from Python backend",
  "items": ["item1", "item2", "item3"]
}
\`\`\`

### POST /api/process
Processes input data.

**Request Body:**
\`\`\`json
{
  "text": "Sample text to process"
}
\`\`\`

**Response:**
\`\`\`json
{
  "processed": true,
  "input": {"text": "Sample text to process"},
  "output": 23
}
\`\`\``,

    'README.md': `# Mixed Language Project

This project demonstrates a full-stack application with:

- **Frontend**: React + TypeScript
- **Backend**: Python Flask
- **Styling**: SCSS
- **Build**: Webpack
- **Testing**: Jest

## Getting Started

1. Install dependencies: \`npm install\`
2. Install Python dependencies: \`pip install -r requirements.txt\`
3. Start development server: \`npm run dev\`

## Project Structure

- \`frontend/\` - React application
- \`backend/\` - Flask API server
- \`shared/\` - Shared utilities
- \`config/\` - Configuration files
- \`docs/\` - Documentation`
  },
  
  'requirements.txt': `Flask==2.3.3
Flask-CORS==4.0.0
python-dotenv==1.0.0
requests==2.31.0`,

  '.gitignore': `node_modules/
__pycache__/
*.pyc
.env
dist/
build/
.DS_Store
*.log`,

  'Dockerfile': `FROM node:18-alpine AS frontend
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY frontend/ ./frontend/
RUN npm run build

FROM python:3.9-slim AS backend
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY backend/ ./
COPY --from=frontend /app/dist ./static

EXPOSE 5000
CMD ["python", "server.py"]`,

  'docker-compose.yml': `version: '3.8'
services:
  app:
    build: .
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - FLASK_ENV=production
    volumes:
      - ./data:/app/data`
}

// Projects with various framework combinations
export const FRAMEWORK_COMBINATIONS = {
  'react-tailwind': {
    'package.json': JSON.stringify({
      dependencies: { "react": "^18.0.0", "tailwindcss": "^3.0.0" }
    }, null, 2),
    'tailwind.config.js': 'module.exports = { content: ["./src/**/*.{js,jsx,ts,tsx}"] }',
    'src': {
      'App.jsx': 'import React from "react"; export default function App() { return <div className="bg-blue-500">Hello</div>; }'
    }
  },
  
  'vue-vuetify': {
    'package.json': JSON.stringify({
      dependencies: { "vue": "^3.0.0", "vuetify": "^3.0.0" }
    }, null, 2),
    'src': {
      'App.vue': '<template><v-app><v-main>Hello Vuetify</v-main></v-app></template>'
    }
  },
  
  'express-mongodb': {
    'package.json': JSON.stringify({
      dependencies: { "express": "^4.18.0", "mongoose": "^7.0.0" }
    }, null, 2),
    'server.js': 'const express = require("express"); const mongoose = require("mongoose");',
    'models': {
      'User.js': 'const mongoose = require("mongoose"); const userSchema = new mongoose.Schema({});'
    }
  }
}

export const EDGE_CASE_PROJECTS = {
  'empty-project': {},
  
  'single-file': {
    'index.js': 'console.log("Hello World");'
  },
  
  'deep-nesting': {
    'level1': {
      'level2': {
        'level3': {
          'level4': {
            'level5': {
              'deep.js': 'console.log("Deep nesting");'
            }
          }
        }
      }
    }
  },
  
  'special-characters': {
    'файл-с-русскими-символами.js': 'console.log("Русский файл");',
    'file with spaces.py': 'print("File with spaces")',
    'file@with#symbols$.java': 'public class Test {}'
  },
  
  'large-project': (() => {
    const project = {}
    // Create проект с множеством файлов
    for (let i = 0; i < 50; i++) {
      project[`file${i}.js`] = `console.log("File ${i}");`
    }
    return project
  })(),
  
  'mixed-extensions': {
    'app.js': 'console.log("JavaScript");',
    'app.ts': 'console.log("TypeScript");',
    'app.jsx': 'export default function App() { return <div>React</div>; }',
    'app.tsx': 'export default function App(): JSX.Element { return <div>React TS</div>; }',
    'app.vue': '<template><div>Vue</div></template>',
    'app.py': 'print("Python")',
    'app.java': 'public class App { public static void main(String[] args) {} }',
    'app.go': 'package main\nfunc main() {}',
    'app.rs': 'fn main() { println!("Rust"); }',
    'app.php': '<?php echo "PHP"; ?>',
    'app.rb': 'puts "Ruby"',
    'app.cs': 'using System; class Program { static void Main() {} }',
    'app.cpp': '#include <iostream>\nint main() { return 0; }',
    'app.c': '#include <stdio.h>\nint main() { return 0; }',
    'style.css': '.app { color: red; }',
    'style.scss': '$color: red; .app { color: $color; }',
    'config.json': '{"name": "test"}',
    'config.yaml': 'name: test',
    'README.md': '# Test Project',
    'Dockerfile': 'FROM node:16'
  }
}
