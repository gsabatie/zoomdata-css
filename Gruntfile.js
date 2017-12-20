module.exports = function (grunt) {
    
    var serveStatic = require('serve-static');

    grunt.initConfig({
        cssmin: {
            // Minify all your CSS files into one, used by the style guide
            docs: {
                files: {
                    './doc/style.min.css': ['./dest/*.css']
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
                    src: [ '../../../node_modules/muicss/lib/sass/mui/**/*.scss','*.scss', '*.*.scss'],
                    dest:'dest', 
                    ext: '.css'
                  }]
            },
        },
        kss: {
            // build the style guide
            def: {
                options: {
                    verbose: true,
                    css:'style.min.css'
                },
                files: [{
                    src:'./style/objects/zoomdata2_5',
                    dest: './doc'
                }]
            }
        },
        // Watch the modification on the .scss files
        watch: {
            tasks: [
                'sass', 
                'kss',
                'cssmin'
            ],
            files: ['./style/objects/**/*.scss', 'Gruntfile.js']
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
                options: {
                    mode: true,

                }, 
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
                port: 9090, 
                open: true,
                livereload: 35729,
                hostname: '0.0.0.0'
            },
            livereload: {
                options: {
                    middleware: function (connect) {
                        return [
                            serveStatic('doc')
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
    });

    grunt.loadNpmTasks('grunt-mixdoc');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-kss');

    grunt.registerTask('default', [
        'sass',
        'copy:fonts',
    ]);
    grunt.registerTask('dev', [
        'default',
        'kss',
        'cssmin',
       // 'connect',
        'watch'
    ]);

    grunt.registerTask('deploy', [
        'dev',
        'copy:toZoomData'
    ]);
};
