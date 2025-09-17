import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';

export default [
  // ES Module build
  {
    input: 'src/index.js',
    output: {
      file: 'dist/index.esm.js',
      format: 'es',
      sourcemap: true
    },
    plugins: [
      nodeResolve({
        preferBuiltins: true
      }),
      commonjs(),
      json()
    ],
    external: ['fs', 'path', 'fs/promises']
  },
  // CommonJS build
  {
    input: 'src/index.js',
    output: {
      file: 'dist/index.cjs',
      format: 'cjs',
      sourcemap: true,
      exports: 'named'
    },
    plugins: [
      nodeResolve({
        preferBuiltins: true
      }),
      commonjs(),
      json()
    ],
    external: ['fs', 'path', 'fs/promises']
  },
  // UMD build (for browser usage)
  {
    input: 'src/index.js',
    output: {
      file: 'dist/index.umd.js',
      format: 'umd',
      name: 'BismarkJS',
      sourcemap: true
    },
    plugins: [
      nodeResolve({
        preferBuiltins: false,
        browser: true
      }),
      commonjs(),
      json()
    ]
  }
];
