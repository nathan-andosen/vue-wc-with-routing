import vue from 'rollup-plugin-vue';
import typescript from 'rollup-plugin-typescript2';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import buble from 'rollup-plugin-buble';
import replace from 'rollup-plugin-replace';
import { uglify } from 'rollup-plugin-uglify';
// import cssnano from 'cssnano';
import rollupPostcss from 'rollup-plugin-postcss';
import postcssUrl from 'postcss-url';
import ignoreImport from 'rollup-plugin-ignore-import';
const encodeUrlHandler = require('./encode-url-handler');
const isProd = (process.env.NODE_ENV === 'prod') ? true : false;

const COMPONENT_NAME = 'vue-wc-seed';

const postCssPlugins = [
  postcssUrl({
    basePath: [
      './src',
      
      // if you have any node_modules that have css that include font or
      // image urls, add the node_module directory here
      // './node_modules/aaa'
    ],
    url: function(asset, dir, options, decl, warn, result) {
      return encodeUrlHandler.encodeUrl(asset, dir, options, decl, warn, result);
    }
  }),
  // cssnano()
];
const outputGlobals = {
  'vue': 'Vue',
  'vue-custom-element': 'VueCustomElement',
  'jquery/dist/jquery.slim.js': 'jQuery',
  'popper.js': 'Popper',
  'bootstrap': 'bootstrap'
};
const externals = [
  'vue',
  'vue-custom-element',
  'jquery/dist/jquery.slim.js',
  'popper.js',
  'bootstrap',
  'bootstrap/scss/bootstrap.scss'
];

const vuePluginOptions = {
  css: true,
  compileTemplate: true,
  style: {
    preprocessOptions: {
      scss: {
        includePaths: ['node_modules']
      }
    },
    // handle scss & css inside of .vue file
    postcssPlugins: postCssPlugins
  }
};


// DEV BUILD
let devBuild = {
  input: 'src/index.ts',
  output: {
    file: 'dist/' + COMPONENT_NAME + '.bundle.umd.js',
    format: 'umd',
    // sourcemap: true // does not seem to work well with .vue files
  },
  plugins: [
    typescript({
      typescript: require('typescript'),
    }),
    vue(vuePluginOptions),
    // handle scss & css outside of .vue file
    rollupPostcss({
      plugins: postCssPlugins
    }),
    resolve(),
    commonjs(),
    replace({
      'process.env.NODE_ENV': JSON.stringify( 'production' )
    })
  ]
};

// PROD UMD BUILD INCLUDE ALL DEPENDENCIES
let prodBuildAll = {
  input: 'src/index.ts',
  output: {
    file: 'dist/' + COMPONENT_NAME + '.bundle.umd.min.js',
    format: 'umd'
  },
  plugins: [
    typescript({
      typescript: require('typescript'),
    }),
    vue(vuePluginOptions),
    // handle scss & css outside of .vue file
    rollupPostcss({
      plugins: postCssPlugins
    }),
    resolve(),
    commonjs(),
    replace({
      'process.env.NODE_ENV': JSON.stringify( 'production' )
    }),
    buble(),
    uglify()
  ]
};

// PROD UMD BUILD NO DEPENDENCIES
let prodBuildNoDeps = {
  input: 'src/index.ts',
  output: {
    file: 'dist/' + COMPONENT_NAME + '.umd.min.js',
    format: 'umd',
    globals: outputGlobals
  },
  external: externals,
  plugins: [
    ignoreImport({
      extensions: ['.scss', '.css']
    }),
    typescript({
      typescript: require('typescript'),
    }),
    vue(vuePluginOptions),
    resolve(),
    commonjs(),
    replace({
      'process.env.NODE_ENV': JSON.stringify( 'production' )
    }),
    buble(),
    uglify()
  ]
};

// PROD BUILD ESM
let prodBuildEsm = {
  input: 'src/index.ts',
  output: {
    file: 'dist/' + COMPONENT_NAME + '.esm.js',
    format: 'esm',
    globals: outputGlobals
  },
  external: externals,
  plugins: [
    ignoreImport({
      extensions: ['.scss', '.css']
    }),
    typescript({
      typescript: require('typescript'),
    }),
    vue(vuePluginOptions),
    resolve(),
    commonjs(),
    replace({
      'process.env.NODE_ENV': JSON.stringify( 'production' )
    })
  ]
};

let exportBuilds = [];
if(isProd) {
  exportBuilds = [
    prodBuildAll,
    devBuild,
    prodBuildNoDeps,
    prodBuildEsm
  ];
} else {
  // dev build
  exportBuilds = [
    devBuild 
  ];
}

// export the configs for rollup
export default exportBuilds;