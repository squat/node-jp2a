"use strict";

var spawn = require( "child_process" ).spawn;

/**
 * This method exists to process a hash of options and produce an array of
 * arguments suitable for the jp2a command line tool.
 * @param {array|object|string} options - Some acceptable jp2a parameters.
 * @returns {array} - An array of argument strings that can be applied to the
 * jp2a process.
 */
var processOptions = function( options ) {
    /** Initialize an array to carry all the arguments. */
    var args = [];

    /** Allow the options to be a simple string. */
    if ( Object.prototype.toString.call( options ) === "[object String]" ) {
        args.push( options );
    }

    /** Allow the options to be an array. If so, assume it is ready. */
    else if ( Object.prototype.toString.call( options ) === "[object Array]" ) {
        args = options;
    }

    /** Allow the options to be a hash. If it is, iterate over the keys. */
    else if ( Object.prototype.toString.call( options ) === "[object Object]" ) {

        /** If options.data is specified then default to stdin for input. */
        if ( options.data ) {
            options.src = "-";
        }

        /** Iterate over each of the keys and push parameters to an array. */
        for ( var option in options ) {
            /** If a file src is specified, make it the first argument. */
            if ( option === "src" ) {
                args.unshift( options[ option ] );
            }
            /**
            * Need to check width option explicitly since it could be a falsey number,
            * namely 0.
            */
            else if ( option === "width" ) {
                args.push( "--" + option + "=" + options[ option ] );
            }
            else if ( option === "background" ) {
                args.push( "--" + option + "=" + options[ option ] );
            }
            /** Check if the option is "truthy" and if it is add it to args. */
            else if ( options[ option ] === true || options[ option ] === "true" ) {
                /** Skip the data option since we need to send it to stdin. */
                if ( option !== "data" ) {
                    args.push( "--" + option );
                }
            }
        }
    }

    return args;
};

/**
 * A method to validate the options passed to the exposed jp2a module. This
 * function will throw any necessary errors.
 * @param {array|object|string} options - Some variable containg all the
 * parameters we wish to apply to the jp2a cli tool.
 * @param {function} callback - The callback function that should be executed
 * after conversion.
 * @returns undefined.
 */
var validate = function( options, callback ) {
    /** Ensure that options exists. */
    if ( !options ) {
        throw new TypeError( "You must supply at least one argument" );
    }

    /** Ensure that `options` is of the correct type. */
    if ( Object.prototype.toString.call( options ) !== "[object Object]" && Object.prototype.toString.call( options ) !== "[object Array]" && Object.prototype.toString.call( options ) !== "[object String]" ) {
        throw new TypeError( "First argument must be an array, object, or string" );
    }

    /**
     * If `options` is a hash, ensure it has either a `src` or `data`
     * attribute.
     */
    if ( Object.prototype.toString.call( options ) === "[object Object]" && !options.src && !options.data ) {
        throw new TypeError( "You must supply either a src or data" );
    }

    /** Ensure that `callback` is a function. */
    if ( Object.prototype.toString.call( callback ) !== "[object Function]" ) {
        throw new TypeError( "Second argument must be a function" );
    }
};

/**
 * Expose jp2a.
 * @param {array|object|string} options - An array, object, or string of
 * parameters for the jp2a cli tool.
 * @param {function} callback - A callback function that is executed when the
 * jp2a tool finishes converting the image.
 */
module.exports = function( options, callback ) {
    /** Validate the options and callback and throw appropriate errors. */
    validate( options, callback );

    /** Transform the options argument into an array of arguments for jp2a. */
    var args = processOptions( options );

    var jp2a = spawn( "jp2a", args ),
        out = "";

    /**
     * If options is an object, a `data` option is specified, and no `src`
     * option exists, pipe the data to stdin.
     */
    if ( Object.prototype.toString.call( options ) === "[object Object]" && options.src === "-" && options.data ) {
        if ( typeof options.data === "string" ) {
            jp2a.stdin.setEncoding( "binary" );
            jp2a.stdin.write( options.data, "binary" );
            jp2a.stdin.end();
        } else {
            jp2a.stdin.end( options.data );
        }
    }

    jp2a.stdout.on( "data", function( data ) {
        out += data;
    });

    jp2a.stdout.on( "end", function() {
        if ( callback ){
            return callback( out );
        }
    });
};
