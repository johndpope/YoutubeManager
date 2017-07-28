module.exports = function(grunt) {

  //require("load-grunt-tasks")(grunt);

  // Project configuration.
  grunt.initConfig({
    less: {
      development: {
        files: {
          'build/css/index.css' : 'source/less/index.less'
        }
      }
    },
    babel: {
      options: {
        plugins: ["transform-react-jsx"]
      },
      dist: {
        files: [
          {
              expand: true,
              cwd: 'source/javascript/React/',
              src: ['**/*.js'],
              dest: 'build/javascript/React/'
          }
        ]
      }
    },
    copy:{
      dist:{
        files: [
          {
            expand: true,
            cwd: 'source/javascript',
            src: ['**/*.js' , '!React/**/*.js', !'**/*.test.js'],
            dest: 'build/javascript/'
          },
          { 'build/index.html' : 'source/index.html'},
          { 'build/javascript/config.js' : 'config.js'}
        ]
      },
      libs:{
        files: [
          //Javascript libs
          { 'build/javascript/libs/react/react.js' : 'node_modules/react/dist/react.js'},
          { 'build/javascript/libs/react/react-dom.js' : 'node_modules/react-dom/dist/react-dom.js'},
          { 'build/javascript/libs/jquery/jquery.js' : 'node_modules/jquery/dist/jquery.js'},
          { 'build/javascript/libs/bootstrap/bootstrap.js' : 'node_modules/bootstrap/dist/js/bootstrap.js'},
          { 'build/javascript/libs/requirejs/require.js' : 'node_modules/requirejs/require.js'},

          //CSS libs
          { 'build/css/libs/bootstrap/css/bootstrap.css' : 'node_modules/bootstrap/dist/css/bootstrap.css'},
          { 'build/css/libs/bootstrap/css/bootstrap.css.map' : 'node_modules/bootstrap/dist/css/bootstrap.css.map'},

          //Fonts libs
          { 'build/css/libs/bootstrap/fonts/glyphicons-halflings-regular.eot' : 'node_modules/bootstrap/dist/fonts/glyphicons-halflings-regular.eot'},
          { 'build/css/libs/bootstrap/fonts/glyphicons-halflings-regular.svg' : 'node_modules/bootstrap/dist/fonts/glyphicons-halflings-regular.svg'},
          { 'build/css/libs/bootstrap/fonts/glyphicons-halflings-regular.ttf' : 'node_modules/bootstrap/dist/fonts/glyphicons-halflings-regular.ttf'},
          { 'build/css/libs/bootstrap/fonts/glyphicons-halflings-regular.woff' : 'node_modules/bootstrap/dist/fonts/glyphicons-halflings-regular.woff'},
          { 'build/css/libs/bootstrap/fonts/glyphicons-halflings-regular.woff2' : 'node_modules/bootstrap/dist/fonts/glyphicons-halflings-regular.woff2'}
        ]
      },
      assets:{
        files:[
          {
            expand: true,
            cwd: 'assets',
            src: ['*'],
            dest: 'build/assets/'
          }
        ]
      }
    },
    watch: {
      react: {
        tasks: ['babel'],
        files: ['source/javascript/React/**/*.js'],
        options: {
          interrupt: true
        }
      },
      less: {
        tasks: ['less'],
        files: ['source/less/**/*.less']
      },
      copy: {
        tasks: ['copy'],
        files: ['source/javascript/**/*.js' , '!source/javascript/React/**/*.js']
      }
    },
    clean: ['build']
  });

  // Load the plugin that provides the "less" task.
  grunt.loadNpmTasks('grunt-contrib-less');

  // Load the plugin that provides the "babel" task.
  grunt.loadNpmTasks('grunt-babel');

  // Load the plugin that provides the "copy" task.
  grunt.loadNpmTasks('grunt-contrib-copy');

  // Load the plugin that provides the "watch" task.
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Load the plugin that provides the "clean" task.
  grunt.loadNpmTasks('grunt-contrib-clean');

  // Build task.
  grunt.registerTask('build', ['clean', 'babel', 'less', 'copy']);

  // Default task(s).
  grunt.registerTask('default', ['build']);

  // Development task.
  grunt.registerTask('dev', ['build', 'watch']);
};