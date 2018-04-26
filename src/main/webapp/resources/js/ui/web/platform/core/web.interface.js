
(function(window, undefined) {

var 

Class = UI.Class,

Command = Class({
	name:"Command",
	parent:Class.IObject,
	constructor:function( command, handler, context ) {

		return {
			command: command,
			data: {},
			error: false,
			errorMessage: "",
			webSupported: false,
			execute: function() {
				return handler.apply( this, arguments );
			}
		};
	}
}),

CommandError = Class({
	name:"CommandError",
	parent:Command,
	constructor:function( command, message ) {
		
		
	
		return {
			command: command,
			data: {},
			error: true,
			errorMessage: message,
			execute: function() {
				
			}
		};
	}
}),

CommandFactory = Class({
	name: "CommandFactory",
	parent: Class.IObject,
	constructor: function(  ) {
	
		var _bindedCommands = {};
		
		return {
			register: function( command, handler ) {
				_bindedCommands[command] = new Command( command, handler );
			},
			
			hasCommand: function( command ) {
				//console.log( "_bindedCommands[command]", _bindedCommands[command], command );
			
				return ( _bindedCommands[command] === undefined ) ? false : true;
			},
			
			command: function( command ) {
				return _bindedCommands[command];
			},
			
			execute: function( command /*, ...args */ ) {
				//console.log( this, "execute", arguments );
				
				if ( ! this.hasCommand( command ) ) {
					return new CommandError( command, "Undefined Command (" + command + ")" );
				};
				
				var args = Array.prototype.slice.call( arguments, 1 );
				
				return _bindedCommands[command].execute.apply( window, args );
			}
		}
	}
}),
	
WebInterface = Class({
	name: "WebInterface",
	parent: Class.IObject,
	constructor: function( ) {
	
		var _commandFactory;
		var _scheme = "mcore";
		var _marketLinks = {
			ios: "",
			android: ""
		};
			
		return {
			init: function() {
				var self = this._super().init();
				if (self) {
					_commandFactory = new CommandFactory();
				}
				return this;
			},
			
			register: function( command, handler ) {
				_commandFactory.register( command, handler );	
			},
			
			sendToApp: function( data, encoding ) {
			
				var callerURL = location.href;
				if ( callerURL.indexOf('?') !== -1 ) {
					var temp = callerURL.split('?');
					callerURL = temp[0];
				}
				
				data = data || {};
				data.callerURL = callerURL;
				data.encoding = encoding || "UTF-8";
			
				var path = "";
				var url = _scheme + "://" + path;
				url += ( url.indexOf('?') !== -1 ? "&data=" : "?data=" ) + JSON.stringify( data );
				
				var clickedAt = +new Date;
				
				setTimeout( function() {
					if (+new Date - clickedAt < 2000) {
						var ua = window.navigator.userAgent;
						if (/android/.test(ua)) {
							location.href = _marketLinks.android;
						}
						else {
							location.href = _marketLinks.ios;
						};
					};
				}, 1500);
				
				location.href = url;
			},
			
			marketLinks: function( marketLinks ) {
				if ( arguments.length == 0 ) {
					return _marketLinks;
				};
				
				_marketLinks = marketLinks;
			},
			
			scheme: function( scheme ) {
				if ( arguments.length == 0 ) {
					return _scheme;
				};
				
				_scheme = scheme;
			},
			
			get: function( command ) {
				if ( arguments.length == 0 ) {
					return new CommandError( command, "command is null !" );
				};
				
				var result = _commandFactory.execute.apply( _commandFactory, arguments );
				
				if ( result.error === true ) {
					console.error( result.command, result.errorMessage, result );
				};
				
				return result.data;
			},
		
			execute: function( command ) {
				if ( arguments.length == 0 ) {
					return new CommandError( command, "command is null !" );
				};
				
				var result = _commandFactory.execute.apply( _commandFactory, arguments );
				
				if ( result.error === true ) {
					console.error( result.command, result.errorMessage, result );
				};
				
				return JSON.stringify(result.data);
			},
			
			isWeb: function() {
				return window.Web != undefined ? true : false;	
			},
			
			isSupported: function( command ) {
				return _commandFactory.hasCommand( command ) && _commandFactory.command( command ).webSupported;
			}
		};
	}
});

window.WebInterface = WebInterface;
	
})(window);