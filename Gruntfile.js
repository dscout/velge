/*global module:false*/
module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    coffee: {
      compile: {
        options: {
          bare: false
        },
        files: {
          'dist/<%= pkg.name %>.js': 'lib/<%= pkg.name %>.coffee',
          'test/spec/velge_spec.js': 'test/spec/velge_spec.coffee'
        }
      }
    },

    uglify: {
      options: {
        report: 'min'
      },
      dist: {
        src: 'dist/velge.js',
        dest: 'dist/velge.min.js'
      }
    },

    mocha: {
      src: ['test/test.html'],
      options: {
        bail: true,
        log: true,
        run: true,
        mocha: {
          ignoreLeaks: false
        }
      }
    }
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-coffee');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-mocha');

  // Default task.
  grunt.registerTask('default', ['coffee:compile', 'mocha', 'uglify']);
};
