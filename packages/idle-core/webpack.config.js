const path = require('path')
const createVariants = require('parallel-webpack').createVariants

const production = process.env.NODE_ENV === 'production'

function createConfig(options) {
  const umd = options.target === 'umd' || options.target === 'umd-min'
  const minify = options.target === 'umd-min'
  let filenameSuffix = !umd ? `.${options.target}` : ''
  if (minify) {
    filenameSuffix += '.min'
  }
  return {
    mode: minify ? 'production' : 'development',
    entry: './src/index.ts',
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/
        }
      ]
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js']
    },
    devtool: 'none',
    output: {
      filename: `idle-core${filenameSuffix}.js`,
      library: 'AppIdle',
      libraryExport: umd ? 'default' : undefined,
      libraryTarget: umd ? 'umd' : options.target,
      path: path.resolve(__dirname, 'dist')
    }
  }
}

let config = createConfig({ target: 'umd' })
if (production) {
  config = createVariants(
    {
      target: ['var', 'commonjs2', 'amd', 'umd', 'umd-min']
    },
    createConfig
  )
}

module.exports = config
