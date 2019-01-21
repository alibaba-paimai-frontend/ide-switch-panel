const path = require('path');
const { getExternal } = require('./webpack-helper');
const createStyledComponentsTransformer = require('typescript-plugin-styled-components')
  .default;
const styledComponentsTransformer = createStyledComponentsTransformer();

const commontConfig = {
  entry: {
    index: './src/index.tsx',
    demo: './demo/demo.tsx'
  },
  node: {
    fs: 'empty'
  },
  externals: getExternal(['ide-code-editor']),
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'awesome-typescript-loader',
        options: {
          getCustomTransformers: () => ({
            before: [styledComponentsTransformer]
          })
        },
        exclude: /node_modules/
      },
      // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
      { enforce: 'pre', test: /\.js$/, loader: 'source-map-loader' },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          { loader: 'css-loader', options: { importLoaders: 1 } }
        ]
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  }
};

const normalConfig = Object.assign({}, commontConfig, {
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist')
  }
});

module.exports = [normalConfig];
