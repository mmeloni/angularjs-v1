Error.stackTraceLimit = Infinity;

import 'core-js/es6';
import 'core-js/es7/reflect';

import 'zone.js/dist/zone';

import 'zone.js/dist/long-stack-trace-zone';
import 'zone.js/dist/proxy';
import 'zone.js/dist/sync-test';

import 'zone.js/dist/async-test';
import 'zone.js/dist/fake-async-test';
import 'zone.js/dist/jasmine-patch';

let testContext = (require as { context?: Function }).context('../', true, /\.spec\.ts$/);
testContext.keys().forEach(testContext);

let coverageContext = (require as { context?: Function }).context('../', true, /!(karma-test-shim)\.ts$/);
coverageContext.keys().forEach(coverageContext);

let testing = require('@angular/core/testing');
let browser = require('@angular/platform-browser-dynamic/testing');

testing.TestBed.initTestEnvironment(browser.BrowserDynamicTestingModule, browser.platformBrowserDynamicTesting());
