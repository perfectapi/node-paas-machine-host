var gits = require('gits');
var exec = require('child_process').exec;
var async = require('async');
var fs = require('fs');
var path = require('path');

exports.claim = function(serverConfig, registry) {

  var config = {};
  registry.listUnclaimedInstances(config, function(err, instances) {
    if (err) return console.log(err);
    
    instances.forEach(function(instance) {
      
      instance.giturl = instance.zipFile;   //backward compatible hack
      
      claimInstance(serverConfig, registry, instance)
    })
    
  })

}

function claimInstance(serverConfig, registry, instance) {
  require('portfinder').getPort(function(err, port) {
    if (err) return console.log(err);
    
    config = {
      name: instance.name,
      options: {port: port, path: instance.path, host: require('os').hostname()}         
    }
    

    registry.claimInstance(config, function(err, result) {
      if (err) return console.log(err);
      
      console.log('claimed instance on port ' + port);

      installServiceFiles(serverConfig.environment.PAAS_FILES, instance, function(err, folder) {
        if (err) return console.log(err);
        
        installNpmDependencies(folder, function(err) {
          if (err) return console.log(err);
          
          installPackage(folder, instance.name + instance.id, port, function(err) {
          
            if (err) return console.log(err);
          })
        })
        
      })
    })          
  })
}

function installServiceFiles(folder, instance, callback) {
  if (!instance.giturl) return callback('Cannot install without a git url');
  
  var newFolder = instance.name + '.' + instance.id
  fs.mkdirSync(path.resolve(folder, newFolder));
  gits.git(folder, ['clone', '--recursive', instance.giturl, newFolder], function(err, stdout, stderr) {
  
    if (err) return callback(err);
    
    callback(null, path.resolve(folder, newFolder));
  })
}

function installNpmDependencies(folder, callback) {

  var command = 'npm install';
  exec(command, {cwd: folder, env: process.env}, function(err, stdout, stderr) {
    if (err) return callback(err);
    
    callback();
  })
}

function installPackage(folder, name, port, callback) {

  var packageJson = path.resolve(folder, 'package.json');
  if (!path.existsSync(packageJson)) return callback('Could not find package.json at ' + packageJson);
  
  var packageContents = JSON.parse(fs.readFileSync(packageJson, 'utf8'));
  var bin = path.join(folder, packageContents.bin);
  
  var command = 'node ' + bin + ' install --port ' + port + ' ' + name;
  console.log('Executing install: ' + command);
  exec(command, {cwd: folder, env: process.env}, function(err, stdout, stderr) {
   
    console.log(stderr);
    
    if (err) return callback(err);
    
    console.log(stdout); 
    
    callback();
  })
}











