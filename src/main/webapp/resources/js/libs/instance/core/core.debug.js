/*!
 * Instance UI - Debug 
 * Update : 2014-03-05 
 */
 
(function(window, undefined) {
	
// debug 
window.debug_enabled = window.debug_enabled || false;


var 
/* ----- Debug ----- */

Debug = function() {
	
	var _microtime = function( get_as_float ) {
		var now = new Date().getTime() / 1000;
		var s = parseInt(now, 10); 
		return (get_as_float) ? now : (Math.round((now - s) * 1000) / 1000);
	};

	// Debugging 내용 출력 허용 여부
	// 전역 변수로 DebugEnabled 값을 true 로 하고 실행하면 출력 허용됨
	Debug.enabled = ( window['debug_enabled'] === true ) ? true : false;
	Debug.currentTime = _microtime(true);
	
	var _methods = ["log", "info", "warn", "error"];
	var _methodsPatch = function( handler, context ) {
		if (typeof handler != "function") {
			return;
		};
		
		for( var i in _methods ) {
			var method = _methods[i];
			handler.call( context, method );
		};
	};
	
	// IE bug Fixed
	if ( Function.prototype.bind && window.console != undefined && typeof window.console.log == "object" ) {
		_methodsPatch( function( method ) {
			if ( window.console[method] == undefined ) {
				window.console[method] = this.bind( window.console[method], window.console );
			};
		}, Function.prototype.call );
		
		return window.console;
	};
	
	_methods.push( "resetTime", "elapsedTime", "captureTrace", "message" );
	
	var _constructor = {
		filter:[],
		
		_execute: function( method, args ) {
			if ( method != "message" && method != "error" && Debug.enabled == false ) {
				return;
			};
			
			// force message
			if ( method == "message" ) {
				method = "log";
			};
			
			var params = Array.prototype.slice.call( args, 0 );
			
			if ( Function.prototype.bind && window.console != undefined ) {
			
				switch ( method ) {
					case "resetTime":
						Debug.currentTime = _microtime(true);
					break;
					
					case "captureTrace":
						var stack = "";
				
						try {
							var trace = {};
							
							if ( typeof Error.captureStackTrace == "function" ) {
								Error.captureStackTrace(trace, this ); // for Crome
							}
							else {
								var error = new Error();
								trace.stack = error.stack; // Firefox
							};
							
							var stack = trace.stack.split(/\n/);
							stack.shift();
							stack.shift();
							stack.shift();
							stack.shift();
							
							stack = stack[0];
						}
						catch(e) {
							console.log( e );
							stack = "";
						};
						
						window.console.log( stack );
					break;
	
					case "elapsedTime":
						params.push( method );
						params.push( (_microtime(true) - Debug.currentTime).toFixed(3) );
			
						var func = Function.prototype.bind.call( window.console["log"], window.console );
						func.apply( window.console, params );
					break;
	
					default:
						if ( _constructor.filter && _constructor.filter.length > 0 ) {
							if ( ! in_array( _constructor.filter, params[0] ) ) {
								break;
							}
						}
						
						var func = Function.prototype.bind.call( window.console[method], window.console );
						func.apply( window.console, params );
					break;
				};
			};
		}
	};
	
	_methodsPatch( function( method ) {
		if ( typeof _constructor["_execute"] == "function" ) {
			_constructor[method] = function( message ){ 
				_constructor._execute( method, arguments ); 
			};
		};
		
	}, _constructor );
	
	return _constructor;
};

Debug.type = function( type ) {
	var filter = ( window.debug ) ? window.debug.filter : [];

	window.debug = ( type == "console" ) ? window.console : new Debug();
	window.debug.filter = filter;
};


Debug.__ClassCreateLog = false;
	
Debug.filter = function( filter ) {
	window.debug.filter = arguments;
};

Debug.type( "debug" ); //( window.console ? "console" : 

window.Debug = Debug;


})(window);