const path = require('path');
const ts = path.resolve(__dirname, 'web/ts');

module.exports = {
  mode: 'development',
  target: 'web',
  entry: './web/ts/index.web.ts',
  output: {
    path: path.resolve(__dirname, 'web/static'),
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
        include: [ts]
      },
      /*
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
      */
      {
        test: /\.scss$/,
        use: [
          {
            loader: 'file-loader',
            options: { name: '[name].css', outputPath: '/' }
          },
          'sass-loader' // convert sass to css
        ],
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: 'file-loader',
            options: { name: '[name].css', outputPath: '/' }
          }
        ],
      },
      {
        test: /\.(woff|woff2|eot|ttf)$/,
        loader: 'file-loader',
        options: { name: '[name].[ext]', outputPath: 'fonts/' }
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        loader: 'file-loader',
        options: { name: '[name].[ext]',outputPath: 'images/' }
      }
    ]
  }
}
