const path = require('path');
const src = path.resolve(__dirname, 'web/src');

module.exports = {
  mode: 'development',
  target: 'web',
  entry: './web/src/index.ts',
  output: {
    path: path.resolve(__dirname, 'web/dist'),
    filename: 'bundle.js'
  },
  resolve: {
    extensions: ['.ts', '.js', '.css', '.scss']
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              configFile: 'tsconfig-web.json'
            }
          }
        ],
        include: [src]
      },
      {
        test: /\.scss$/,
        use: [
          'style-loader', // inject style into output js
          'css-loader', // convert css to js
          'sass-loader' // convert sass to css
        ],
        include: [src]
      },
      {
        test: /\.css$/,
        use: [
          'style-loader', // inject style into output js
          'css-loader' // convert css to js
        ]
      },
      {
        test: /\.(woff|woff2|eot|ttf)$/,
        loader: 'file-loader',
        options: { name: '[name].[ext]', outputPath: 'fonts/' }
      },
    ]
  }
}
