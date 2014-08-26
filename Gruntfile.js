module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            options: {
                mangle: true,
                banner: '/*! Uglified <%= grunt.template.today("dd-mm-yyyy") %> */\n'
            },
            dist: {
                src: ['src/knockout.recurse.debug.js'],
                dest: 'dist/knockout.recurse.min.js'
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.registerTask('default', ['uglify']);
};