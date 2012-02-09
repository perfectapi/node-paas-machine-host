#!/usr/bin/env node

//var perfectapi = require('perfectapi');  
var perfectapi = require('../../perfectapi/api.js')
var path = require('path');
var main = require('../lib/main.js');
var claimer = require('../lib/claim.js');

var configPath = path.resolve(__dirname, '..', 'perfectapi.json');
var parser = new perfectapi.Parser();
var pollInterval = 60 * 1000;

//handle the commands
parser.on("publishApp", function(config, callback) {
  var registryEndpoint = config.environment.SERVICE_REGISTRY_URL;
  if (!registryEndpoint || registryEndpoint === '') return callback('SERVICE_REGISTRY_URL not specified');
  
  perfectapi.proxy(registryEndpoint, function(err, registry) {
    if (err) return callback(err);
    
    main.publishApp(registry, config, function(err, result) {
      callback(err, result);
    });    
  });

});



parser.on("server", function(config) {

  var registryEndpoint = config.environment.SERVICE_REGISTRY_URL;
  if (!registryEndpoint || registryEndpoint === '') return console.error('SERVICE_REGISTRY_URL not specified');
  
  perfectapi.proxy(registryEndpoint, function(err, registry) {
    if (err) return console.error(err);
    
    setInterval(function() {
      //TODO: check first if our load is low enough.
      claimer.claim(config, registry);
    }, pollInterval);
    
  });
  
})

module.exports = parser.parse(configPath);