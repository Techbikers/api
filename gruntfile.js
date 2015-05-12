var configureGrunt = function(grunt) {

    // Load all the grunt tasks
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-contrib-compass');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    // Load the configuration
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        // ### grunt-contrib-watch
        // Watch files and livereload in the browser during development.
        watch: {
            react: {
                files: [
                    'client/**/*.jsx',
                    'client/**/*.js'
                ],
                tasks: ['browserify:dev']
            },
            sass: {
                files: [
                    'client/sass/**/*.scss'
                ],
                tasks: ['compass:dev']
            },
            livereload: {
                files: [
                    'server/static/**/*'
                ],
                options: {
                    livereload: true
                }
            }
        },

        // ### grunt-compass
        // compile sass to css using Compass
        compass: {
            options: {
                sassDir: 'client/sass',
                cssDir: 'server/static/css',
                imagesDir: 'server/static/img',
                fontsDir: 'server/static/fonts',
                httpImagesPath: '/static/img',
                httpFontsPath: '/static/fonts'
            },
            prod: {
                options: {
                    environment: 'production',
                    force: true
                }
            },
            dev: {
                options: {
                    environment: 'development',
                    outputStyle: 'nested',
                    sourcemap: true
                }
            }
        },

        // ### grunt-browserify
        // pull together multiple js files into single app and libs files
        browserify: {
            options: {
                transform: [['babelify', { "stage": 0 }]],
                extensions: ['.jsx'],
                external: [
                    'react',
                    'react-router',
                    'marty',
                    'lodash',
                    'moment'
                ]
            },
            dev: {
                options: {
                    browserifyOptions: {
                        debug: true
                    }
                },
                src: ['client/**/*.jsx'],
                dest: 'server/static/js/app.js'
            },
            prod: {
                options: {
                    debug: false
                },
                src: ['client/**/*.jsx'],
                dest: 'server/static/js/app.js'
            },
            libs: {
                // External modules that don't need to be constantly re-compiled
                options: {
                    debug: false,
                    alias: [
                        'react:',
                        'react-router:',
                        'marty:',
                        'lodash:',
                        'moment:'
                    ],
                    external: null  // Reset this here because it's not needed
                },
                src: ['.'],
                dest: 'server/static/js/libs.js',
            }
        },

        // ### grunt-contrib-uglify
        // Minify concatenated javascript files ready for production
        uglify: {
            prod: {
                options: {
                    sourceMap: false
                },
                files: {
                    'server/static/js/app.js': 'server/static/js/app.js',
                    'server/static/js/libs.js': 'server/static/js/libs.js'
                }
            }
        }
    });


    // ### Dev environment
    // `grunt dev` - build assets on the fly whilst developing
    //
    // `grunt dev` manages starting an express server and restarting the server whenever core files change (which
    // require a server restart for the changes to take effect) and also manage reloading the browser whenever
    // frontend code changes.
    grunt.registerTask('dev', 'Dev Mode; watch files and restart server on changes',
       ['browserify:libs', 'watch']);

    // ### Production assets
    // `grunt prod` - will build the minified assets used in production.
    //
    // It is otherwise the same as running `grunt`, but is only used when running Ghost in the `production` env.
    grunt.registerTask('prod', 'Build JS & templates for production',
        ['compass:prod', 'browserify:libs', 'browserify:prod', 'uglify:prod']);
};

// Export the configuration
module.exports = configureGrunt;