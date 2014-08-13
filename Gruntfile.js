module.exports = function(grunt) {

  grunt.initConfig({
    coffee: {
      compile: {
        options: {
          bare: false,
          join: true
        },
        files: {
          'velge.js': ['lib/velge.coffee', 'lib/util.coffee', 'lib/ui.coffee', 'lib/store.coffee'],
          'test/velge_test.js': ['test/store_test.coffee', 'test/ui_test.coffee', 'test/velge_test.coffee']
        }
      }
    },

    uglify: {
      options: {
        report: 'min'
      },
      dist: {
        src: 'velge.js',
        dest: 'velge.min.js'
      }
    },

    mocha: {
      src: ['test/test.html'],
      options: {
        bail: true,
        log: true,
        run: true,
        mocha: {
          ignoreLeaks: true
        }
      }
    },

    watch: {
      files: ['lib/*.coffee', 'test/*.coffee'],
      tasks: ['coffee:compile']
    },

    umd: {
      all: {
        src: 'velge.js',
        indent: '  ',
        objectToExport: 'Velge',
        globalAlias: 'Velge'
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-coffee');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-mocha');
  grunt.loadNpmTasks('grunt-umd');

  grunt.registerTask('test',    ['coffee:compile', 'umd:all', 'mocha']);
  grunt.registerTask('default', ['test']);
  grunt.registerTask('release', ['test', 'uglify']);
};
