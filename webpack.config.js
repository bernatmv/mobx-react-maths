const path = require('path');
const webpack = require('webpack');

// variables
var isProduction = process.argv.indexOf('-p') >= 0;
var sourcePath = path.join(__dirname, './src');
var outPath = path.join(__dirname, './dist');

// plugins
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

// webpack configuration
module.exports = {
    context: sourcePath,
    entry: {
        app: './app.js'
    },
    output: {
        path: outPath,
        filename: '[name].bundle.js',
        publicPath: '/assets'
    },
    target: 'web',
    module: {
        loaders: [
            // js
            {
                test: /\.(js|jsx)$/,
                exclude: [/node_modules/],
                use: 'babel-loader'
            },
            // css
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: { modules: true },
                    }
                ]
            },
            // static assets
            { test: /\.json$/, use: 'json-loader' },
            { test: /\.html$/, use: 'html-loader' },
            { test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/, use: 'url-loader?limit=20480' }
        ],
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin({
            name: 'commons',
            filename: 'commons.js',
            minChunks: 2,
        }),
        new webpack.optimize.AggressiveMergingPlugin(),
//        new ExtractTextPlugin({
//            filename: '[name].bundle.css',
//            disable: !isProduction
//        }),
        new HtmlWebpackPlugin({
            template: 'index.html'
        })
    ],
    devServer: {
        contentBase: sourcePath,
        hot: true,
        stats: {
            warnings: false
        }
    },
    node: {
        // workaround for webpack-dev-server issue
        // https://github.com/webpack/webpack-dev-server/issues/60#issuecomment-103411179
        fs: 'empty',
        net: 'empty'
    },
    resolve: {
        modules: [sourcePath, 'node_modules'],
        extensions: ['.js', '.jsx']
    }
};