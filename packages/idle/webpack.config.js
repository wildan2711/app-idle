const path = require('path')

module.exports = (env, argv) => {
  console.log(argv)
  return {
    mode: process.env.NODE_ENV || 'development',
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
    output: {
      filename:
        process.env.NODE_ENV === 'production'
          ? 'app-idle.min.js'
          : 'app-idle.js',
      library: 'AppIdle',
      libraryExport: 'default',
      libraryTarget: 'umd',
      path: path.resolve(__dirname, 'dist')
    }
  }
}
