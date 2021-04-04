const path = require('path');

module.exports = {
  mode: 'production',
  target: 'web',
  entry: './client/src/client.ts',
  output: {
    path: path.resolve(__dirname, 'client/dist/public'),
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
          'ts-loader'
        ],
        include: [path.resolve(__dirname, 'client/src')]
      },
      {
        test: /\.scss$/,
        use: [
          'style-loader', // inject style into output js
          'css-loader', // convert css to js
          'sass-loader' // convert sass to css
        ],
        include: [path.resolve(__dirname, 'client/src')]
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
