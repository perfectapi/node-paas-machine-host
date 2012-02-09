var async = require('async');

exports.publishApp = function(registry, config, callback) {
  console.log(config)
  appConfig = {
    name: config.name,
    options: {path: config.options.path, git: config.options.git}
  }
  appConfig.options.file = config.options.git;   //backward compatible for old registry
  
  console.log(appConfig)
  registry.registerInstance(appConfig, function(err, result) {
    callback(err, result);
  })
  
}