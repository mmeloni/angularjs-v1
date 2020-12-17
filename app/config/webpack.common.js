var fs = require('fs');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var helpers = require('./helpers');

var localAPIURL = 'http://wayonara-api.local.nextop.co';
var awsWayonaraBasePath = 'https://s3-eu-west-1.amazonaws.com';
var awsAssetsUrl = awsWayonaraBasePath + '/wayonara-assets';
var wayonaraVersion = require('../../package.json').version;

var npmLifecycleEvent = process.env.npm_lifecycle_event;
var ENV = helpers.getENVbyEvent(npmLifecycleEvent);

var envConfigFile = require(`./config-${ENV}.json`);
var notificationServerURLConfig = envConfigFile.notificationServerURL;
var siteURLConfig = envConfigFile.siteURL;
var facebookAppIdConfig = envConfigFile.facebookAppId;
var hostConfig = (npmLifecycleEvent === 'dist:dev') ? localAPIURL : envConfigFile.apiServerBaseURL;

var stripePublishableKey = (ENV === 'dev') ? envConfigFile.stripePublishableKey : process.env.STRIPE_PUBLISHABLE_KEY;


console.log(envConfigFile);

module.exports = {
    entry: {
        'polyfills': helpers.root('app') + '/requires-polyfills',
        'vendor': helpers.root('app') + '/requires-vendor',
        'app': helpers.root('app') + '/requires-app'
    },

    resolve: {
        extensions: ['.js', '.ts'],
        modules: ['node_modules'],
        alias: {
            TweenMax: 'gsap/src/uncompressed/TweenMax.js',
            TweenLite: 'gsap/src/uncompressed/TweenLite.js',
            // TimelineLite: 'gsap/src/uncompressed/TimelineLite.js',
            // TimelineMax: 'gsap/src/uncompressed/TimelineMax.js',
            // EasePack: 'gsap/src/uncompressed/easing/EasePack.js',
            CSSPlugin: 'gsap/src/uncompressed/plugins/CSSPlugin.js'
        }
    },

    module: {
        rules: [
            // NG1 templates
            {
                test: /\.html$/,
                loader: 'ng-cache-loader?-url&prefix=app:**',
                // include: /app\/web/,
                exclude: /\.component\.html$/
            },
            {
                test: /requires-app.js$/,
                loader: 'required-loader',
                exclude: /(node_modules|bower_components|doc)/
            },
            // END NG1 templates
            {
                test: /\.ts$/,
                use: [
                    'awesome-typescript-loader',
                    'angular2-template-loader'
                ],
                // include: /app/,
                exclude: /\.spec\.ts$/
            },
            {
                test: /\.component\.html$/,
                loader: 'raw-loader',
                // include: /app\/web/
            },
            {
                test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)(\?.*)?$/,
                loader: 'file-loader'
            },
            {
                test: /\.scss$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'sass-loader'
                ],
                // include: /(assets\/scss|node_modules|bower_components)/,
                exclude: /(assets\/scss\/overrides|\.component\.scss$)/
            },
            {
                test: /\.component\.scss$/,
                use: [
                    'raw-loader',
                    'sass-loader'
                ],
                exclude: /(assets\/scss|node_modules|bower_components)/,
            }
        ]
    },

    plugins: [

        new webpack.optimize.CommonsChunkPlugin({
            name: ['app', 'vendor', 'polyfills'],
            minChunks: Infinity
        }),

        new webpack.NoEmitOnErrorsPlugin(),

        new webpack.NamedModulesPlugin(),

        // Avoid warnings about Angular: https://github.com/angular/angular/issues/11580
        new webpack.ContextReplacementPlugin(
            /angular(\\|\/)core(\\|\/)(esm(\\|\/)src|src)(\\|\/)linker/,
            helpers.root('doesnotexist/') // avoid memory leaks and unwanted watcher triggers
        ),

        new webpack.SourceMapDevToolPlugin({
            filename: '[file].map',
            exclude: ['vendor.js', 'polyfills.js'],
            test: [/\.js$/]
        }),

        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            'window.jQuery': 'jquery',
            moment: 'moment',
            numeral: 'numeral',
            arc: 'arc',
            ol: 'openlayers',
            EXIF: 'exif-js'
        }),

        new webpack.DefinePlugin({
            webpackGlobalVars: {
                awsWayonaraBucket: JSON.stringify(awsWayonaraBasePath + '/' + envConfigFile.awsWayonaraBucket), // TODO - refactor to camelCase
                awsWayonaraCloudfront: JSON.stringify(envConfigFile.awsWayonaraCloudfront),
                awsWayonaraCloudFrontDistributionId: JSON.stringify(envConfigFile.awsCloudFrontDistributionId),
                env: JSON.stringify(ENV),
                facebookAppId: JSON.stringify(facebookAppIdConfig),
                facebookCallbackURL: JSON.stringify(siteURLConfig),
                host: JSON.stringify(hostConfig),
                notificationServerUrl: JSON.stringify(notificationServerURLConfig),
                stripePublishableKey: JSON.stringify(stripePublishableKey),
                wayonaraVersion: JSON.stringify(wayonaraVersion),
            }
        }),

        new HtmlWebpackPlugin({
            template: 'app/index.template.ejs',
            chunksSortMode: helpers.packageSort(['polyfills', 'vendor', 'app']),
            inject: 'body',
            data: {
                awsAssetsUrl: awsAssetsUrl,
                facebookAppId: facebookAppIdConfig,
                googleAnalyticsUA: envConfigFile.googleAnalyticsUA,
                host: hostConfig,
                hotjar: envConfigFile.hotjar,
                hotjarId: envConfigFile.hotjarId,
                fbPixel: envConfigFile.fbPixel,
                liveChatLicense: envConfigFile.liveChatLicense,
                notificationServerURL: notificationServerURLConfig,
                siteURL: siteURLConfig,
                svgSprite: fs.readFileSync(helpers.root('assets') + '/icon-sprite.svg', 'utf8')
            }
        })
    ]
};
