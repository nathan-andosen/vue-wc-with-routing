const postcssUrlEncode = require('postcss-url/src/lib/encode');
const fs = require('fs');
const klawSync = require('klaw-sync');
const mime = require('mime');
const path = require('path');


function EncodeUrlHandler() {
  /**
   * Encode a file url into base64
   *
   * @param {*} filePath
   * @returns
   */
  const encodeUrl = function(filePath) {
    const file = fs.readFileSync(filePath);
    return postcssUrlEncode({
      path: filePath,
      contents: file,
      mimeType: mime.lookup(filePath)
    }, 'base64');
  };


  /**
   * Check if a file exists in a directory, if yes, return its base64 value
   *
   * @param {*} dirPath
   * @param {*} assetUrl
   * @returns
   */
  const checkFileExists = function(dirPath, assetUrl) {
    var filePath = path.join(dirPath, assetUrl);
    // some file paths might have a query parameter at the end, lets remove it
    if(filePath.indexOf('?') > -1)
      filePath = filePath.substring(0, filePath.indexOf('?'));
    if(fs.existsSync(filePath)) {
      return encodeUrl(filePath);
    }
    return false;
  };


  /**
   * Handle the postcssUrl plugin callback to encode file path urls to base64
   * 
   * @returns
   */
  this.encodeUrl = function(asset, dir, options, decl, warn, result) {
    // console.log(asset);
    if(fs.existsSync(asset.absolutePath)) {
      return encodeUrl(asset.absolutePath);
    } else if (options.basePath){
      for(var i = 0; i < options.basePath.length; i++) {
        const baseDir = path.join(process.cwd(), options.basePath[i]);
        const res = checkFileExists(baseDir, asset.url);
        if(res !== false) return res;
        const dirs = klawSync(baseDir, {nofile: true});
        // lets iterate each directory under the base path and see if we can find our file
        for(var j = 0; j < dirs.length; j++) {
          const res = checkFileExists(dirs[j].path, asset.url);
          if(res !== false) return res;
        }
      }
    }
  };
};

module.exports = new EncodeUrlHandler();



