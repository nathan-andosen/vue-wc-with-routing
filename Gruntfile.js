var isWindows = (process.platform === "win32");
var bashCmd = (isWindows) ? 'bash ' : '';
const path = require('path');

module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-exec');
  grunt.loadNpmTasks('grunt-contrib-connect');

  var init = {};

  // execute bash commands
  init.exec = {
    buildDev: {
      cmd: 'npm run build-dev'
    }
  };

  init.connect = {
    server: {
      options: {
        base: [__dirname],
        port: 9001,
        hostname: '0.0.0.0',
        livereload: true,
        open: {
          target: 'http://localhost:9001/index.html'
        }
      }
    }
  };

  // watch tasks
  init.watch = {
    dev: {
      files : [
        "src/**/*.ts",
        "src/**/*.vue",
        "src/**/*.scss"
      ],
      tasks : ["builddev"],
      options: {
        livereload: true
      }
    }
  };

  grunt.initConfig(init);

  // our grunt commands
  grunt.registerTask("builddev", ['exec:buildDev']);
  grunt.registerTask("dev", ["builddev", "connect:server", "watch:dev"]);
};