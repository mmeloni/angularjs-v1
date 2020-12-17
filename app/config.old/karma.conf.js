var webpackConfig = require('./webpack.test');
var helpers = require('./helpers');

module.exports = function (config) {
    var _config = {
        frameworks: ['jasmine', 'source-map-support'],

        files: [
            { pattern: './karma-test-shim.ts', watched: false },
            { pattern: helpers.root('assets', 'img', '**'), watched: false, included: false, served: true }
        ],

        proxies: {
            '/assets': helpers.root('assets')
        },

        exclude: [
            'docs/*',
            'node_modules/*',
            'bower_components/*'
        ],

        preprocessors: {
            './karma-test-shim.ts': ['webpack']
        },

        webpack: webpackConfig,

        webpackMiddleware: {
            stats: 'errors-only'
        },

        webpackServer: {
            noInfo: true
        },

        reporters: ['dots', 'notify', 'coverage'],

        /**
        * This JSON file is "intermediate", in post-test script we use remap-istanbul to map back to TypeScript
        * and then generate coverage report.
        */
        coverageReporter: {
            dir: helpers.root('doc', 'coverage'),
            reporters: [
                {
                    type: 'json',
                    subdir: '.',
                    file: 'coverage.json'
                }
            ]
        },

        port: 9876,

        // on disconnect, makes karma to launch another phantonJs window to restart the testcases
        browserDisconnectTolerance: 5,

        // these settings help reduce the timeouts to begin with.
        browserNoActivityTimeout: 60000,
        browserDisconnectTimeout: 30000,
        captureTimeout: 60000,

        colors: true,
        logLevel: config.LOG_INFO,
        browserConsoleLogOptions: {
          level: 'log',
          format: '%b %T: %m',
          terminal: true
        },

        browsers: ['PhantomJS']
    };

    config.set(_config);
};
