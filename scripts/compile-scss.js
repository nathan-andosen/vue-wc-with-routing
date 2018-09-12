const path = require('path');
const mime = require('mime');
const fs = require('fs-extra');
const sass = require('node-sass');
const rootDir = path.join(__dirname, '..');
const scssFilePath = path.join(rootDir, 'src', 'assets', 'scss', 'index.scss');
const scssOutputPath = path.join(rootDir, 'dist', 'thenja-login-form.scss');
const cssOutputPath = path.join(rootDir, 'dist', 'thenja-login-form.css');
const ignoreImports = {
  "~bootstrap/scss/bootstrap.scss": true
};

const ignoreStartTag = 'concat-scss-ignore-start';
const ignoreEndTag = 'concat-scss-ignore-end';

let state = {
  currentDir: '',
  previousDirs: [],
  output: '',
  ignoringLines: false
};


const fetchFileContents = function(path, cb) {
  fs.readFile(path, 'utf-8', function(err, data) { cb(err, data); });
};


const fetchFileContentsFromPaths = function(index, paths, cb) {
  if(index >= paths.length) { cb(null, null); return; }
  let filePath = path.join(state.currentDir, paths[index]);
  if(paths[index].indexOf('~') > -1) {
    // dealing with a node modules import
    const assetPath = paths[index].substring(1);
    filePath = path.join(rootDir, 'node_modules', assetPath);
  }
  fetchFileContents(filePath, function(err, data) {
    if(!data) {
      fetchFileContentsFromPaths(++index, paths, cb);
    } else {
      cb(filePath, data);
    }
  });
};

const insertIntoString = function(str, char, pos) {
  return [str.slice(0, pos), char, str.slice(pos)].join('');
};

const getImportPath = function(line) {
  const strChar = (line.indexOf("'") > -1) ? "'" : "\"";
  let path = line.substring(line.indexOf(strChar) + 1, line.lastIndexOf(strChar));
  if(ignoreImports[path]) return null;
  path = path.replace('.scss', '').replace('.css', '');
  const underscoreScss = insertIntoString(path, '_', path.lastIndexOf('/') + 1);
  return [ 
    underscoreScss + '.scss', 
    path + '.scss', 
    path +'.css' 
  ];
};


const base64EncodeAssetUrl = function(line, cb) {
  if(line.indexOf('url(') > -1) {
    let urlPath = line.substring(line.indexOf('(') + 1, line.indexOf(')'));
    // lets check if the url path is not just a variable, like: url($myVar);
    if(urlPath.indexOf("'") < 0 && urlPath.indexOf('"') < 0) {
      cb(line); return;
    }
    urlPath = urlPath.replace(/'/g, '').replace(/"/g, '');
    // lets check if the url path is already a data url
    if(urlPath.indexOf('data:') > -1) {
      cb(line); return;
    }
    let filePath = path.join(state.currentDir, urlPath);
    const filemime = mime.lookup(filePath);
    if(filePath.indexOf('?') > -1) 
      filePath = filePath.substring(0, filePath.indexOf('?'));
    fs.readFile(filePath, {encoding: 'base64'}, (err, data) => {
      if (err) {
        // something went wrong with getting the url file, not much we can do
        cb(line); return;
      }
      const base64Url = `data:${filemime};base64,${data}`;
      const newLine = line.replace(urlPath, base64Url);
      cb(newLine);
    });
  } else {
    cb(line);
  }
};


const iterateLinesInFile = function(index, lines, cb) {
  if(index >= lines.length) { cb(); return; }
  const line = lines[index];
  if(line.indexOf(ignoreEndTag) > -1) {
    state.ignoringLines = false;
    iterateLinesInFile(++index, lines, cb);
  } else if(state.ignoringLines || line.indexOf(ignoreStartTag) > -1) {
    state.ignoringLines = true;
    iterateLinesInFile(++index, lines, cb);
  } else if(line.indexOf('@import') > -1) {
    const importPaths = getImportPath(line);
    if(importPaths) {
      fetchFileContentsFromPaths(0, importPaths, function(filePath, contents) {
        state.previousDirs.push(state.currentDir);
        state.currentDir = path.dirname(filePath);
        iterateLinesInFile(0, contents.split('\n'), function() {
          state.currentDir = state.previousDirs.pop();
          iterateLinesInFile(++index, lines, cb);
        });
      });
    } else {
      // import path must be ignored
      iterateLinesInFile(++index, lines, cb);
    }
  } else {
    base64EncodeAssetUrl(line, function(newLine) {
      state.output += newLine + '\n';
      iterateLinesInFile(++index, lines, cb);
    }); 
  }
}


const writeOutputToFile = function(cb) {
  fs.writeFile(scssOutputPath, state.output, {}, function(err) {
    cb();
  });
}

const compileSass = function(cb) {
  sass.render({
    file: scssOutputPath
  }, function(err, result) {
    fs.writeFile(cssOutputPath, result.css.toString(), {}, function(err) {
      cb();
    });
  });
};


const startScript = function() {
  fetchFileContents(scssFilePath, function(err, fileContents){
    if(err) throw err;
    state.currentDir = path.dirname(scssFilePath);
    iterateLinesInFile(0, fileContents.split('\n'), function(){
      writeOutputToFile(function() {
        compileSass(function() {
          finishScript();
        });
      });
    });
  });
};

const finishScript = function() {
  process.exit();
};

startScript();