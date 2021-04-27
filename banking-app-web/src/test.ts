// This file is required by karma.conf.js and loads recursively all the .spec and framework files

import 'zone.js/dist/long-stack-trace-zone';
import 'zone.js/dist/proxy.js';
import 'zone.js/dist/sync-test';
import 'zone.js/dist/jasmine-patch';
import 'zone.js/dist/async-test';
import 'zone.js/dist/fake-async-test';
import { getTestBed } from '@angular/core/testing';
import {
   BrowserDynamicTestingModule,
   platformBrowserDynamicTesting
} from '@angular/platform-browser-dynamic/testing';

// Unfortunately there's no typing for the `__karma__` variable. Just declare it as any.
declare const __karma__: any;
declare const require: any;

const index = +__karma__.config.args[0];
const splits = +__karma__.config.args[2];

// Prevent Karma from running prematurely.
__karma__.loaded = function () { };

// First, initialize the Angular testing environment.
getTestBed().initTestEnvironment(
   BrowserDynamicTestingModule,
   platformBrowserDynamicTesting()
);

// Then we find all the tests.
const context = require.context('./', true, /\.spec\.ts$/),
   allFiles = context.keys();
let bucketSize, specFiles;
// and load the specific modules.
if (index && splits) {
   bucketSize = allFiles.length / splits,
      specFiles = allFiles.slice((index - 1) * bucketSize, index * bucketSize);
   specFiles.map(context);
} else {
   allFiles.map(context);
}

// finally, start Karma to run the tests.
__karma__.start();
