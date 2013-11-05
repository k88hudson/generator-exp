module.exports = function (grunt) {
  grunt.registerMultiTask('nunjucks', function () {
    var nj = require('nunjucks');
    var path = require('path');

    var options = this.options({
      envOptions: null,
      baseDir: './'
    });

    this.files.forEach(function (file) {
      // Set up main file
      var out = '(function () {' + 'var templates = {};\n';

      // Add each template
      out += file.src.filter(function (filepath) {
        if (!grunt.file.exists(filepath)) {
          grunt.log.warn('Source file "' + filepath + '" not found.');
          return false;
        } else {
          return true;
        }
      }).map(function (filepath) {
        // return nj.precompileString(grunt.file.read(filepath), {
        //   name: filepath,
        //   asFunction: true
        // });
        var relativePath = path.relative(options.baseDir, filepath);
        var string = 'templates["' + relativePath + '"] = (function () {\n';
        string += nj.compiler.compile(grunt.file.read(filepath));
        string += '})();';
        return string;
      }).join('\n');

      // Prep for AMD
      out += 'if(typeof define === "function" && define.amd) {\n' +
        '    define(["nunjucks"], function(nunjucks) {\n' +
        '        nunjucks.env = new nunjucks.Environment([], ' + options.envOpts + ');\n' +
        '        nunjucks.env.registerPrecompiled(templates);\n' +
        '        return nunjucks;\n' +
        '    });\n' +
        '}\n' +
        'else if(typeof nunjucks === "object") {\n' +
        '    nunjucks.env = new nunjucks.Environment([], ' + options.envOpts + ');\n' +
        '    nunjucks.env.registerPrecompiled(templates);\n' +
        '}\n' +
        'else {\n' +
        '    console.error("ERROR: You must load nunjucks before the precompiled templates");\n' +
        '}\n' +
        '})();';

      grunt.file.write(file.dest, out);
      grunt.log.writeln('File "' + file.dest + '" created.');

    });
  });
};
