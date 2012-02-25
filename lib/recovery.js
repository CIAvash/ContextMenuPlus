'use strict';

const { Loader } = require('@loader');
const options = require('@packaging');

let recovery = {};
// Deep copy all the options.
recovery.options = JSON.parse(JSON.stringify(options));
// Make `jetpackID` as it was in 1.4 - 1.4.2
recovery.options.jetpackID = options.jetpackID.split('@').shift();

// Create a new loader with a recovery options.
recovery.loader = Loader.new(recovery.options);
recovery.require = Loader.require.bind(recovery.loader, module.path);

// Exports storage and pref as they would have been in 1.4 - 1.4.2
exports.storage = recovery.require('addon-kit/simple-storage').storage;
exports.prefs = recovery.require('addon-kit/simple-prefs').prefs;
exports.passwords = recovery.require('addon-kit/passwords');