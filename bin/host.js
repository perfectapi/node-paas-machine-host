#!/usr/bin/env node

var perfectapi = require('perfectapi');  
//var perfectapi = require('../../perfectapi/api.js')
var path = require('path');
var main = require('../lib/main.js');

var configPath = path.resolve(__dirname, '..', 'perfectapi.json');
var parser = new perfectapi.Parser();
var pollInterval = 60 * 1000;

//handle the commands
parser.on("publishApp", function(config, callback) {
  main.publishApp(config, function(err, result) {
    callback(err, result);
  });
});

parser.on("publishApp", function(config, callback) {
  main.publishApp(config, function(err, result) {
    callback(err, result);
  });
});

parser.on("server", function(config) {

})

module.exports = parser.parse(configPath);