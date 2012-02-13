var async = require('async');

exports.publishApp = function(registry, config, callback) {
  console.log(config)
  appConfig = {
    name: config.name,
    options: config.options   //1 to 1 mapping of options to service registry
  }
  
  registry.registerInstance(appConfig, function(err, result) {
    callback(err, result);
  })
  
}