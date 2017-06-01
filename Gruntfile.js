module.exports = function(grunt) {
    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        cacheBust: {
            taskName: {
                options: {
                    assets: [
                        'css/**',
                        ]
                },
                src: ['index.html']
            }
        }
    });
    grunt.loadNpmTasks('grunt-cache-bust');

    grunt.registerTask('default', 'cacheBust');
};

//              'css/**',
//                        'i18n/**',
//                        'model/**',
//                        'pdf/**',
//                        'resources/**',
//                        'view/**'
