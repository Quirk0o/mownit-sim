
module.exports = function (grunt) {

  require('load-grunt-tasks')(grunt);

  var serverScripts = [ 'Gruntfile.js', 'app.js', 'routes/**/*.js'],
      clientScripts= [ 'public/js/**/*.js' ];

  grunt.initConfig({
    express: {
      options: {
        script: 'bin/www',
        background: true
      },
      dev: {
        options: {
          node_env: 'dev'
        }
      },
      prod: {
        options: {
          node_env: 'prod'
        }
      },
      test: {
        options: {
          node_env: 'test'
        }
      }
    },
    watch: {
      options: {
        livereload: true
      },
      config: {
        files: 'package.json',
        tasks: [ 'express:dev:stop', 'express:dev:start' ],
        options: {
          spawn: false
        }
      },
      express: {
        files: serverScripts,
        tasks: [ 'express:dev:stop', 'jshint', 'express:dev:start' ],
        options: {
          spawn: false
        }
      },
      R: {
        files: 'app/sim.R'
      },
      bower: {
        files: 'bower.json',
        tasks: [ 'wiredep' ]
      },
      scripts: {
        files: clientScripts,
        tasks: [ 'jshint' ]
      },
      css: {
        files: 'public/**/*.css'
      },
      jade: {
        files: 'views/**/*.jade'
      }
    },
    jshint: {
      all: serverScripts.concat(clientScripts)
    },
    wiredep: {
      options: {
        ignorePath: '../public'
      },
      all: {
        src: [
          'views/bower_scripts.jade',
          'views/bower_stylesheets.jade'
        ]
      }
    }
  });

  grunt.registerTask('test', [ 'jshint' ]);

  grunt.registerTask('dist', [ 'wiredep' ]);

  grunt.registerTask('serve', [ 'express:dev', 'watch' ]);

  grunt.registerTask('default', [ 'test', 'dist', 'serve' ]);
};
