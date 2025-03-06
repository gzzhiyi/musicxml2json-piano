import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import eslint from '@rollup/plugin-eslint'
import replace from '@rollup/plugin-replace'
import json from '@rollup/plugin-json'
import typescript from 'rollup-plugin-typescript2'
import del from 'rollup-plugin-delete'
import path from 'path'

const getPath = _path => path.resolve(__dirname, _path)
const extensions = [
  '.js',
  '.ts',
  '.tsx'
]

export default {
  input: getPath('../src/index.ts'),
  external: [
    'react',
    'react-dom'
  ],
  output: [
    {
      name: 'musicxml2json-piano',
      file: 'demos/dist/index.js', // 通用模块
      format: 'umd',
    },
    {
      name: 'musicxml2json-piano',
      file: 'demos/dist/index.esm.js', // es6模块
      format: 'esm',
    }
  ],
  plugins: [
    del({ targets: 'demos/dist/*' }),
    replace({
      preventAssignment: true,
      babelHelpers: 'runtime',
      values: {
        'process.env.NODE_ENV': JSON.stringify('development')
      }
    }),
    json(),
    nodeResolve(extensions),
    commonjs(),
    eslint({
      throwOnError: true,
      include: ['src/**/*.ts'],
      exclude: ['node_modules/**', 'dist/**', 'demos/**', 'build/**']
    }),
    typescript({
      extensions
    })
  ]
}
