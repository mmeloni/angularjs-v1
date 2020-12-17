var webpack = require('webpack');
var webpackMerge = require('webpack-merge');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
var commonConfig = require('./webpack.common.js');
var helpers = require('./helpers');

module.exports = webpackMerge(commonConfig, {
    devtool: 'source-map',

    output: {
        path: helpers.root('dist'),
        publicPath: '/',
        filename: '[name].[hash].js',
        chunkFilename: '[id].[hash].chunk.js'
    },

    plugins: [

        new ExtractTextPlugin({
            filename: '[name].[hash].css'
        }),

        new CopyWebpackPlugin([
            {
                context: helpers.root(),
                from: 'assets/img',
                to: helpers.root('dist', 'assets', 'img')
            },
            {
                context: helpers.root(),
                from: 'assets/fonts',
                to: helpers.root('dist', 'assets', 'fonts')
            },
            {
                context: helpers.root('build'),
                from: 'appspec.yml',
                to: helpers.root('dist')
            },
            {
                context: helpers.root('build'),
                from: 'codeDeploy.sh',
                to: helpers.root('dist')
            }
        ]),

        new webpack.optimize.UglifyJsPlugin({
            beautify: false,
            mangle: false,
            compress: {
                screw_ie8: true,
                warnings: false
            },
            comments: false,
            sourceMap: true
        }),

        new webpack.LoaderOptionsPlugin({
            minimize: true,
            debug: false
        }),

        new BundleAnalyzerPlugin({
            analyzerMode: 'static',
            reportFilename: helpers.root('doc', 'bundle-analyzer', 'index.html'),
            openAnalyzer: false,
            generateStatsFile: true,
            statsFilename: helpers.root('doc', 'bundle-analyzer', 'stats.json')
        })

    ]
});
