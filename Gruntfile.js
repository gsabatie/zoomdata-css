module.exports = function (grunt) {

    grunt.initConfig({
        cssmin: {
            combine: {
                files: {
                    './dest/style.min.css': ['./dest/style.css']
                }
            }
        },
        sass: {
            // Convert scss file to css to  q dest file
            def: {
                options:  {
                    sourcemap: 'none',
                },
                 files: [{
                    expand: true,
                    cwd: 'style/objects/zoomdata2_5',
                    src: [ '../../../node_modules/muicss/lib/sass/mui/**/*.scss','*.scss'],
                    dest:'dest', 
                    ext: '.css'
                  }]
            },
            // Generate a style.css and a mixins-to-classes.scsss tpo present the css element on a static webpage
            singleFileToPresent: {
                files: {
                    './dest/style.css' : './dest/mixins-to-classes.scss'                   
                }
            }
        },
        mixdoc: {
            def: {
                options: {
                    styles_folder: './style/objects',
                    dest_folder: './dest',
                }
            }
        },
        // Watch the modification on the .scss files
        watch: {
            tasks: [
                'mixdoc', 
                'sass', 
                'copy', 
            ],
            files: [ '../../../node_modules/muicss/lib/sass/mui/**/*.scss','./style/objects/**/*.scss', './node_modules/grunt-mixdoc/**/*']
        },
        copy: {
            // copy the font in the dest folder
            fonts: {
                files: [
                    {
                        expand: true,
                        cwd: 'style/',
                        src: ['fonts/**'],
                        dest: 'dest'
                    }
                ]
            },
            // Copy the css in the dest folder to the css folder of zoomdata
            toZoomData: {
                files: [
                    {
                       src: ['dest/*.css', '!dest/style.css', '!dest/style.min.css'],
                       dest: '/opt/zoomdata/client/css/'
                    }
                ]   
            }
        },
        connect: {
            options: {
                port: 9000,
                open: true,
                livereload: 35729,
                hostname: '0.0.0.0'
            },
            livereload: {
                options: {
                    middleware: function (connect) {
                        return [
                            connect.static('dest')
                        ];
                    }
                }
            },
            dist: {
                options: {
                    base: 'style',
                    livereload: true
                }
            }
        },
        'gh-pages': {
            options: {
                base: 'dest'
            },
            src: ['**']
        }
    });

    grunt.loadNpmTasks('grunt-mixdoc');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-gh-pages');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-connect');


    grunt.registerTask('default', [
        'mixdoc', 
        'sass:singleFileToPresent',
        'cssmin',
        'copy:fonts',
    ]);
    grunt.registerTask('dev', [
        'default',
        'copy:toZoomData',
        'watch'
    ]);

    grunt.registerTask('deploy', [
        'mixdoc',
        'copy:fonts',
        'gh-pages'
    ]);
};
