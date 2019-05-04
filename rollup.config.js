import resolve from 'rollup-plugin-node-resolve'
import babel from 'rollup-plugin-babel'
import pkg from './package.json'

export default [
	// browser-friendly UMD build
	{
		input: 'src/index.js',
		output: {
			name: 'VirtualDOM',
			file: pkg.main,
			format: 'umd'
		},
		plugins: [
      resolve(),
      babel({
        exclude: 'node_modules/**',
        runtimeHelpers: true
      })
		]
	}
]
