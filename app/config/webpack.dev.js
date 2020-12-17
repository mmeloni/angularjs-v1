var webpack = require('webpack');
var webpackMerge = require('webpack-merge');
var commonConfig = require('./webpack.common.js');
var helpers = require('./helpers');

module.exports = webpackMerge(commonConfig, {
    output: {
        path: helpers.root('dist'),
        publicPath: '/',
        filename: '[name].js',
        chunkFilename: '[id].chunk.js'
    },

    devServer: {
        historyApiFallback: true,
        stats: 'minimal',
        contentBase: helpers.root(),
        hot: true,
        // host: '0.0.0.0',
        port: '30300',
        publicPath: '/',
        proxy: {
            '/api': {
                target: 'http://wayonara-api.local.nextop.co:8080',
                // logLevel: 'debug',
                changeOrigin: true,
                secure: false
            },
            '/user': {
                target: 'http://wayonara-api.local.nextop.co:8080',
                // logLevel: 'debug',
                changeOrigin: true,
                secure: false
            }
        }
    },

    plugins: [
        new webpack.HotModuleReplacementPlugin()
    ],

    watchOptions: {
        aggregateTimeout: 300,
        // poll: 1000, // enableing this may solve issues with Vagrant
        ignored: /(node_modules|bower_components)/
    },
});
