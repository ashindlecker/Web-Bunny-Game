module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    concat:
    {
      dist:
      {
        src: ["libsrc/**/*.js", "src/**/*.js"],
        dest: "build/<%= pkg.name %>.js"
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-concat');

  // Default task(s).
  grunt.registerTask('default', 'build');
  grunt.registerTask('build', ['concat'])

};
