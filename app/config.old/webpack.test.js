var helpers = require('./helpers');
var webpack = require('webpack');

var awsWayonaraBasePath = 'https://s3-eu-west-1.amazonaws.com';

var npmLifecycleEvent = process.env.npm_lifecycle_event;
var ENV = helpers.getENVbyEvent(npmLifecycleEvent);

var envConfigFile = require(`./config-${ENV}.json`);
var notificationServerURLConfig = envConfigFile.notificationServerURL;

// TODO use webpack merge here, too?

module.exports = {
    resolve: {
        extensions: ['.js', '.ts'],
        modules: ['node_modules']
    },

    module: {
        rules: [
            {
                test: /\.ts$/,
                use: [
                    'awesome-typescript-loader',
                    'angular2-template-loader'
                ],
                include: /app/
            },
            {
                test: /\.component\.html$/,
                loader: 'raw-loader',
                include: /app\/web/
            },
            {
                test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)$/,
                loader: 'null-loader'
            },
            {
                test: /\.component\.scss$/,
                use: [
                    'raw-loader',
                    'sass-loader'
                ],
                include: helpers.root('app', 'web'),
            },
            /**
            * Instruments TS source files for subsequent code coverage.
            * See https://github.com/deepsweet/istanbul-instrumenter-loader
            */
            {
                test: /\.ts$/,
                loader: 'istanbul-instrumenter-loader',
                enforce: 'post',
                exclude: [
                    'node_modules',
                    /\.(e2e|spec)\.ts$/
                ]
            }
        ]
    },

    watchOptions: {
        aggregateTimeout: 300,
        // poll: 1000, // enableing this may solve issues with Vagrant
        ignored: /(node_modules|bower_components)/
    },

    plugins: [
        // Avoid warnings about Angular: https://github.com/angular/angular/issues/11580
        new webpack.ContextReplacementPlugin(
            /angular(\\|\/)core(\\|\/)(esm(\\|\/)src|src)(\\|\/)linker/,
            helpers.root('doesnotexist/') // avoid memory leaks and unwanted watcher triggers
        ),

        // TODO - refactor into single globalConfig object
        new webpack.DefinePlugin({
            webpackGlobalVars: {
                awsWayonaraBucket: JSON.stringify(awsWayonaraBasePath + '/' + envConfigFile.awsWayonaraBucket), // TODO - refactor to camelCase
                awsWayonaraCloudfront: JSON.stringify(envConfigFile.awsWayonaraCloudfront),
                env: JSON.stringify(ENV),
                host: JSON.stringify('mockHost'),
                isTest: JSON.stringify(true),
                notificationServerUrl: JSON.stringify(notificationServerURLConfig)
            }
        })
    ]
}
