
(function( window, undefined) {
	
var 
/* ----- Data ----- */
Class = UI.Class,
Core = Class.Core,
IObject = Class.IObject,
Helper = UI.Helper,

UserDefaults = Class({
	name: "UserDefaults",
	parent: Class.IObject,
	constructor: function( defaultKey ) {
		
		var localStorage = window.localStorage;
		var _data = {};
		
		return {
			__construct: function() {
				var data = localStorage.getItem( defaultKey );
				
				_data = ( data && typeof data == "string" ) ? JSON.parse(data) : {};
				
				return this;
			},
			
			data: function() {
				return _data;	
			},
			
			get: function( key ) {
				if ( _data[key] == undefined ) {
					return undefined;
				};
				
				return _data[key];
			},
			
			set: function( key, value ) {
				_data[key] = value;
			},
			
			remove: function( key ) {
				_data[key] = undefined;
				delete _data[key];	
			},
			
			clear: function() {
				_data = {};	
			},
		
			keys: function() {
				var keys = [];
				for ( var key in _data ) {
					keys.push(key);
				}
			
				return keys;
			},
			
			synchronize: function() {
				var data = JSON.stringify( _data );
				
				localStorage.setItem( defaultKey, data )
			}
		};
	},
	'static': function() {
		// TODO : 다시 데이타를 복구 하는 부분 체크
		
		var _defaults = {};
		
		return {
			standardUserDefaults: function() {
				return UI.UserDefaults.userDefaultsWithKey( "__UIKIT_USER_DEFAULT__" );
			},
			
			userDefaultsWithKey: function(key) {
				if ( _defaults[key] != undefined ) {
					return _defaults[key];
				};
				
				_defaults[key] = new Class.UserDefaults(key);
				
				return _defaults[key];
			},
			
			resetStandardUserDefaults: function() {
				_standardUserDefaults.destory();
				_standardUserDefaults = undefined;
				
				_standardUserDefaults = new Class.UserDefaults();
			}
		};
	}
}),

LocalStorage = Class({
	name: "LocalStorage",
	parent: IObject,
	constructor: function() {
	
		var localStorage = window.localStorage;
		
		return {
			init: function() {
				return this;
			},
			
			get: function( key ) {
				return localStorage.getItem( key );
			},
			
			set: function( key, value ) {
				localStorage.setItem( key, value );
			},
			
			remove: function( key ) {
				localStorage.removeItem( key );
			},
			
			clear: function() {
				localStorage.clear();
			},
			
			data: function() {
				return localStorage;
			},
		
			keys: function() {
				var keys = [];
				
				for ( var key in localStorage ) {
				
					if ( key != "length" ) {
						keys.push(key);
					}
				}
			
				return keys;
			},
		};
	},
	'static': function() {
		// TODO : 다시 데이타를 복구 하는 부분 체크
		
		var _sharedInstance = new Class.LocalStorage();
		
		return {
			sharedInstance: function() {
				return _sharedInstance;
			}
		};
	}
}),

DataMap = Class({
	name: "DataMap",
	parent: Core,
	constructor: function() {

		var _keys = [],
			_data = {};

		return {
			data: function( data ) {
				if ( arguments.length == 0 ) {
					return _data;
				};
				
				_data = data;
			},
		
			get: function( key ) {
				return _data[key];
			},
			
			put: function( key, value ) {
				if ( _data[key] == undefined ) {
					_keys.push(key);
				};
				
				_data[key] = value;
			},
			
			remove: function( key ) {
				_data[key] = undefined;
				delete _data[key];
				array_remove( _keys, key );	
			},
			
			each: function( fn ) {
				if ( typeof fn != 'function' ) {
					return;
				};
				
				for ( var i=0, length=_keys.length; i<length; i ++ ) {
					var key = _keys[i];
					var value = _data[key];
					fn.call( this, key, value, i );
				};
			},
			
			// TODO: 함수명 리펙토링
			entrys: function() {
				var length = _keys.length;
			    var entrys = new Array(length);
			    for (var i = 0; i < length; i++) {
			        entrys[i] = {
			            key : _keys[i],
			            value : _data[i]
			        };
			    }
			    return entrys;
			},
			
			isEmpty: function() {
				return _keys.length == 0;
			},
			
			size: function() {
				return _keys.length;
			}
		};
	}
});

UI.UserDefaults = UserDefaults;
UI.LocalStorage = LocalStorage;
UI.DataMap = DataMap;
	
})(window);