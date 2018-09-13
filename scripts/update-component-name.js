const argv = require('yargs').argv;
const fs = require('fs-extra');
const path = require('path');

const ROOT_DIR = path.join(__dirname, '..');

// constant component names
const COMPONENT_NAME_DASHED = argv.name;
let componentNameCamelCase = COMPONENT_NAME_DASHED
  .replace(/-([a-z])/g, function (g) { return g[1].toUpperCase(); });
const COMPONENT_NAME = componentNameCamelCase[0].toUpperCase() 
  + componentNameCamelCase.substring(1);
const OLD_COMPONENT_NAME_DASHED = 'vue-wc-seed';
const OLD_COMPONENT_NAME = 'VueWcSeed';

// const OLD_COMPONENT_NAME_DASHED = 'thenja-welcome';
// const OLD_COMPONENT_NAME = 'ThenjaWelcome';

/**
 * Replace the old component name with the new one inside a file
 * 
 * @param {string} filepath 
 */
const updateFileContents = function(filepath) {
  return new Promise(function(resolve, reject) {
    fs.readFile(filepath, 'utf-8', function(err, fileContents) {
      if(err) { reject(err); return; }
      fileContents = fileContents.split(OLD_COMPONENT_NAME_DASHED)
        .join(COMPONENT_NAME_DASHED);
      fileContents = fileContents.split(OLD_COMPONENT_NAME).join(COMPONENT_NAME);
      fs.writeFile(filepath, fileContents, function(err) {
        if(err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  });
};


/**
 * Update the rollup config file
 * 
 * @param {Function} cb 
 */
const updateRollupConfig = function() {
  const filepath = path.join(ROOT_DIR, 'config', 'rollup.config.js');
  return updateFileContents(filepath);
};

const updateComponentVueFile = function() {
  const filepath = path.join(ROOT_DIR, 'src', COMPONENT_NAME_DASHED + '.component.vue');
  return updateFileContents(filepath);
};

const updateComponentTsFile = function() {
  const filepath = path.join(ROOT_DIR, 'src', COMPONENT_NAME_DASHED + '.component.ts');
  return updateFileContents(filepath);
};

const updateIndexTsFile = function() {
  const filepath = path.join(ROOT_DIR, 'src', 'index.ts');
  return updateFileContents(filepath);
};

const updateCompileScssScript = function() {
  const filepath = path.join(ROOT_DIR, 'scripts', 'compile-scss.js');
  return updateFileContents(filepath);
};

const updateIndexNoDepsHTML = function() {
  const filepath = path.join(ROOT_DIR, 'index-no-deps.html');
  return updateFileContents(filepath);
};

const updateIndexHTML = function() {
  const filepath = path.join(ROOT_DIR, 'index.html');
  return updateFileContents(filepath);
};

const updatePackageJson = function() {
  const filepath = path.join(ROOT_DIR, 'package.json');
  return updateFileContents(filepath);
};

const renameTsComponentFile = function() {
  const tsFilePath = path.join(ROOT_DIR, 'src', OLD_COMPONENT_NAME_DASHED
    + '.component.ts');
  const newTsFilePath = path.join(ROOT_DIR, 'src', COMPONENT_NAME_DASHED
    + '.component.ts');
  return fs.move(tsFilePath, newTsFilePath);
};

const renameVueComponentFile = function() {
  const tsFilePath = path.join(ROOT_DIR, 'src', OLD_COMPONENT_NAME_DASHED
    + '.component.vue');
  const newTsFilePath = path.join(ROOT_DIR, 'src', COMPONENT_NAME_DASHED
    + '.component.vue');
  return fs.move(tsFilePath, newTsFilePath);
};


const renameFiles = function() {
  return renameTsComponentFile().then(function(){
    return renameVueComponentFile();
  })
  .catch(function(err) {
    return Promise.reject(err);
  });
};


const finishScript = function() {
  console.log('Renaming successful...');
  process.exit();
};

const startScript = function() {
  console.log('Renaming component...');
  renameFiles()
  .then(function(){
    return updateRollupConfig();
  })
  .then(function() {
    return updateComponentVueFile();
  })
  .then(function() {
    return updateComponentTsFile();
  })
  .then(function() {
    return updateIndexTsFile();
  })
  .then(function() {
    return updateCompileScssScript();
  })
  .then(function() {
    return updateIndexNoDepsHTML();
  })
  .then(function() {
    return updateIndexHTML();
  })
  .then(function() {
    return updatePackageJson();
  })
  .then(function() {
    finishScript();
  })
  .catch(function(err){
    throw err;
  });
};

startScript();