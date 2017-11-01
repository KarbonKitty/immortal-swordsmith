import resolve from 'rollup-plugin-node-resolve';
import replace from 'rollup-plugin-replace';

export default {
  input: 'src/main.js',
  output: {
    file: 'bundle.js',
    format: 'iife'
  },
  plugins: [
    resolve({
      // use "module" field for ES6 module if possible
      module: true, // Default: true

      // use "jsnext:main" if possible
      // – see https://github.com/rollup/rollup/wiki/jsnext:main
      jsnext: true,  // Default: false

      // use "main" field or index.js, even if it's not an ES6 module
      // (needs to be converted from CommonJS to ES6
      // – see https://github.com/rollup/rollup-plugin-commonjs
      main: true,  // Default: true

      // If true, inspect resolved files to check that they are
      // ES2015 modules
      modulesOnly: true, // Default: false
    }),
    replace({
      'process.env.NODE_ENV': JSON.stringify('development'),
      'process.env.VUE_ENV': JSON.stringify('browser')
    })
  ]
};