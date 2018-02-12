module.exports = function(grunt) {

  //require("load-grunt-tasks")(grunt);

  // Project configuration.
  grunt.initConfig({
    less: {
      development: {
        files: {
          'build/client/css/index.css' : 'source/less/index.less'
        }
      }
    },
    babel: {
      options: {
        plugins: ["transform-react-jsx", "transform-es2015-modules-amd"]
      },
      dist: {
        files: [
          {
              expand: true,
              cwd: 'source/javascript/client/',
              // src: ['**/*.js'],
              src: ['app.js', 'view/page/*.js', 'view/component/*.js', 'youtube/youtube-api.js', 'youtube/youtube-service.js', 'series/*.js', 'cache/*.js'],
              dest: 'build/client/javascript/'
          },
          {
            expand: true,
            cwd: 'source/javascript/',
            // src: ['**/*.js'],
            src: ['structure/*.js', '!structure/*.test.js'],
            // src: ['structure/*.js'],
            dest: 'build/client/javascript/'
          }
        ]
      }
    },
    copy:{
      dist:{
        files: [
          {
            expand: true,
            cwd: 'source/javascript/server/',
            src: ['**/*.js' , '!**/*.test.js'],
            dest: 'build/server/javascript/'
          },
          { 'build/client/index.html' : 'source/index.html'},
          { 'build/client/javascript/config.js' : 'config.js'},
          { 'build/client/javascript/index.js' : 'source/javascript/client/index.js'}
        ]
      },
      libs:{
        files: [
          //Javascript libs
          { 'build/client/javascript/libs/react/react.js' : 'node_modules/react/dist/react.js'},
          { 'build/client/javascript/libs/react/react-dom.js' : 'node_modules/react-dom/dist/react-dom.js'},
          { 'build/client/javascript/libs/jquery/jquery.js' : 'node_modules/jquery/dist/jquery.js'},
          { 'build/client/javascript/libs/bootstrap/bootstrap.js' : 'node_modules/bootstrap/dist/js/bootstrap.js'},
          { 'build/client/javascript/libs/requirejs/require.js' : 'node_modules/requirejs/require.js'},

          //CSS libs
          { 'build/client/css/libs/bootstrap/css/bootstrap.css' : 'node_modules/bootstrap/dist/css/bootstrap.css'},
          { 'build/client/css/libs/bootstrap/css/bootstrap.css.map' : 'node_modules/bootstrap/dist/css/bootstrap.css.map'},

          //Fonts libs
          { 'build/client/css/libs/bootstrap/fonts/glyphicons-halflings-regular.eot' : 'node_modules/bootstrap/dist/fonts/glyphicons-halflings-regular.eot'},
          { 'build/client/css/libs/bootstrap/fonts/glyphicons-halflings-regular.svg' : 'node_modules/bootstrap/dist/fonts/glyphicons-halflings-regular.svg'},
          { 'build/client/css/libs/bootstrap/fonts/glyphicons-halflings-regular.ttf' : 'node_modules/bootstrap/dist/fonts/glyphicons-halflings-regular.ttf'},
          { 'build/client/css/libs/bootstrap/fonts/glyphicons-halflings-regular.woff' : 'node_modules/bootstrap/dist/fonts/glyphicons-halflings-regular.woff'},
          { 'build/client/css/libs/bootstrap/fonts/glyphicons-halflings-regular.woff2' : 'node_modules/bootstrap/dist/fonts/glyphicons-halflings-regular.woff2'}
        ]
      },
      assets:{
        files:[
          {
            expand: true,
            cwd: 'assets',
            src: ['*'],
            dest: 'build/client/assets/'
          }
        ]
      }
    },
    watch: {
      react: {
        tasks: ['babel'],
        files: ['source/**/*'],
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