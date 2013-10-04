module.exports = function ( grunt ) {

	var coffeesToWatch = null
	,	sassToWatch = null
	,	jadeToWatch = null;

	grabCoffees();
	initConfig();

	grunt.loadNpmTasks( "grunt-contrib-watch" );
	grunt.loadNpmTasks( 'grunt-contrib-jade' );
	grunt.loadNpmTasks( "grunt-contrib-coffee" );
	grunt.loadNpmTasks( "grunt-contrib-compass" );

	grunt.registerTask( "default", "watch" );

	grunt.event.on( "watch", function( action, filepath ) {
		grabCoffees();
		initConfig();
	} );

	function grabCoffees() {
		var baseCoffee = "./src/coffee/";
		coffeesToWatch = [ baseCoffee + "*.coffee" ];

		grunt.file.recurse( baseCoffee, function(abspath, rootdir, subdir, filename) {
			if( subdir == undefined )
				return;
			coffeesToWatch[ coffeesToWatch.length ] = baseCoffee + subdir + "/*.coffee";
		});

		// coffeesToWatch.push( "./src/coffee/" );
		coffeesToWatch.reverse();

		// filesToWatch = [ "GruntFile.js", "./src/sass/*.scss", "./src/jade/*.jade" ];
		// filesToWatch = filesToWatch.concat( coffeesToWatch );
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
				}
			},

			jade: {
				compile: {
					options: {
						data: {
							debug: true
						}
					},
					files: {
						"./deploy/index.html": "./src/jade/index.jade"
					}
				}
			},

			coffee: {
				compile: {
					options: {
						bare: true
					},
					files: {
						"./deploy/js/main.min.js" : coffeesToWatch
					}
				}
			},

			compass: {
				dist: {
					options: {
						config: "./config.rb"
					}
				}
			}
		});

		// grunt.registerTask( "default", "watch" );

		// grunt.registerTask( "default", "fwatch" );
	}
}