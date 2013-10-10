module.exports = function ( grunt ) {

    var srcCoffee = "src/coffee/"
    ,   srcJade = "src/jade/"
    ,   deployJade = "deploy/"

    ,   coffeesToWatch = null
    ,   sassToWatch = null
    ,   jadesToWatch = null;

    grunt.loadNpmTasks( "grunt-contrib-watch" );
    grunt.loadNpmTasks( "grunt-contrib-jade" );
    grunt.loadNpmTasks( "grunt-contrib-coffee" );
    grunt.loadNpmTasks( "grunt-contrib-compass" );
    grunt.loadNpmTasks( "grunt-contrib-uglify" );

    grunt.registerTask( "default", "watch" );

    grunt.event.on( "watch", function( action, filepath ) {
        var fileType = getFileType( filepath );
        if( fileType == "coffee" ) {
            getCoffees();
            initConfig();
        } else if ( fileType == "jade" ) {
            getJades();
            initConfig();
        }
    });

    function getFileType( filepath ) {
        return filepath.split( "." ).pop();
    }

    function getCoffees() {
        coffeesToWatch = [ srcCoffee + "*.coffee" ];

        grunt.file.recurse( srcCoffee, function( abspath, rootdir, subdir, filename ) {
            if( subdir == undefined )
                return;
            coffeesToWatch[ coffeesToWatch.length ] = srcCoffee + subdir + "/*.coffee";
        });

        coffeesToWatch.reverse();
    }

    function getJades() {
        jadesToWatch = {};

        var deployPath = ""
        ,   fileNameWithoutType = "";

        grunt.file.recurse( srcJade, function( abspath, rootdir, subdir, filename ) {
            deployPath = deployJade;
            fileNameWithoutType = filename.split( "." ).shift() + ".html"
            if( subdir == undefined ) {
                deployPath += fileNameWithoutType;
            } else {
                deployPath += subdir + "/" + fileNameWithoutType;
            }
            jadesToWatch[ deployPath ] = abspath;
        });
    }

    function initConfig() {
        grunt.config.init( {
            pkg: grunt.file.readJSON('package.json'),

            watch: {
                coffee: {
                    files: [ "src/coffee/**/*.coffee" ],
                    tasks: [ "coffee:compile" ]
                },
                sass: {
                    files: [ "src/sass/**/*.scss" ],
                    tasks: [ "compass" ]
                },
                jade: {
                    files: [ "src/jade/**/*.jade" ],
                    tasks: [ "jade:compile" ]
                }
            },

            jade: {
                compile: {
                    options: {
                        data: {
                            debug: true
                        }
                    },
                    files: jadesToWatch
                }
            },

            coffee: {
                compile: {
                    options: {
                        bare: true
                    },
                    files: {
                        "deploy/js/main.js": coffeesToWatch
                    }
                }
            },

            compass: {
                dist: {
                    options: {
                        config: "config.rb"
                    }
                }
            },

            uglify: {
                compile: {
                    files: {
                        "deploy/js/main.min.js": "deploy/js/main.js"
                    }
                }
            }
        });
    }

    getCoffees();
    getJades();
    initConfig();

    grunt.registerTask( "compile", [ "jade:compile", "coffee:compile", "compass" ] )
    grunt.registerTask( "all", [ "jade:compile", "coffee:compile", "compass", "uglify" ] )

    grunt.task.run( "compile" );
}
