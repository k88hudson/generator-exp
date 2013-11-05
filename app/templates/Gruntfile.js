module.exports = function (grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    less: {
      development: {
        src: 'src/**/*.less',
        dest: 'dist/main.css',
        options: {
          dumpLineNumbers: 'comments'
        }
      },
      production: {
        src: 'src/**/*.less',
        dest: 'dist/main.css',
        options: {
          yuicompress: true
        }
      }
    },
    develop: {
      server: {
        file: 'app.js'
      }
    },
    watch: {
      less: {
        files: ['src/**/*.less'],
        tasks: ['less:development'],
        options: { nospawn: true }
      },
      node: {
        files: [
          'app.js',
          'routes/**/*.js',
          'lib/*.js',
        ],
        tasks: ['jshint', 'develop'],
        options: { nospawn: true }
      },
      requirejs: {
        files: [
          'src/**/*.js'
        ],
        tasks: ['jshint', 'copy'],
        options: { nospawn: true }
      }<% if (useJade) { %>,
      jade: {
        files: ['src/**/*.jade'],
        tasks: ['jade:compileJSTemplates']
      }<% } else if (useNunjucks) { %>,
      nunjucks: {
        files: ['src/**/*.html'],
        tasks: ['nunjucks:precompile']
      }<% } %>
    },
    copy: {
      main: {
        expand: true,
        cwd: './src',
        src:'**/*.js',
        dest: 'dist'
      }
    },
    jshint: {
      all: [
        'Gruntfile.js',
        'app.js',
        'routes/**/*.js',
        'src/**/*.js'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    },<% if (useJade) { %>
    jade: {
      compileJSTemplates: {
        options: {
          amd: true,
          client: true,
          compileDebug: false
        },
        files: {
          'dist/templates.js': ['src/**/*.jade']
        }
      }
    },<% } else if (useNunjucks) { %>
    nunjucks: {
      options: {
        src: 'src/**/*.html',
        dest: 'dist/templates.js'
      }
    },<% } %>
    requirejs: {
      compile: {
        options: {
          baseUrl: './bower_components',
          mainConfigFile: './src/main.js',
          include: ['main'],
          paths: {
            'templates': '../dist/templates'
          },
          out: './dist/main.js'
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-develop');
  grunt.loadNpmTasks('grunt-contrib-watch');<% if (useJade) { %>
  grunt.loadNpmTasks('grunt-contrib-jade');}<% } %><% if (useNunjucks) { %>
  grunt.loadNpmTasks('grunt-nunjucks');<% } %>
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-requirejs');

  grunt.registerTask('default', [
    'less:development',<% if (useJade) { %>
    'jade:compileJSTemplates',<% } %><% if (useNunjucks) { %>
    'nunjucks',<% } %>
    'jshint',
    'copy',
    'develop',
    'watch'
  ]);

  grunt.registerTask('heroku', [<% if (useJade) { %>
    'jade:compileJSTemplates',<% } %><% if (useNunjucks) { %>
    'nunjucks',<% } %>
    'less:production',
    'requirejs',
  ]);

};
