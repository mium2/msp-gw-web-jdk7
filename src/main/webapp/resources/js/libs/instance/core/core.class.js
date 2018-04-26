
(function(window, undefined) {


var 
/* ----- Core ----- */

Core = function(/* */) {
	return {};
};

Core.prototype = {
	__construct: function() {},	// 생성시 실행 함수
	__destruct: function() {},	// 파괴시 실행 함수
	
	destroy: function() {	// 파괴자 함수
		this.__destruct.apply( this, arguments );
	},
	
	// TODO :
	toString: function() {
		if ( this["name"] ) {
			return this.name;
		};
		
		return "{" + "" + "}";	
	},
	
	__parent: Object,
	__class: Core,
	__ancestor: Core,
	constructor: Core
};


var 
/* ----- Class ----- */

Class = function( options ) {
	if ( typeof options == 'function' ) { // 익명함수를 Class 화 함, 관리하는 방법은 추후 구현
		options = {
			name:"__CLASS__",
			parent: IObject,
			constructor: options
		};
	};

	var _instance, _class, _parent, _constructor, _caller;
	var className = ( typeof options.name == "string" ) ? options.name.replace(/[^a-z_]/gi, '') : "__CLASS__";  
		
	//_class = function __CLASS__() { _instance = this; return _nativeCode.apply( _instance, arguments ); };
	_class = eval('function '+className+'() { _instance = this; return _nativeCode.apply( _instance, arguments ); };'+className );
	_parent = ( typeof options.parent == "function" ) ? 
		// is Function
		function( parent ) {
			if ( Debug.__ClassCreateLog ) {
				debug.log( "Class create [", className, "] from [", parent.name, "]" );
			};
			return parent;
		}( options.parent ) : 
		
		// is String
		function( parentName ) { 
			if ( Debug.__ClassCreateLog ) {
				debug.log( "Class create [", className, "] from [", parentName, "]" );
			};
			
			var parent = ( typeof window[parentName] == "function" && window[parentName].prototype.__ancestor === Core ) ? 
						window[parentName] : 
						( ( typeof Class[parentName] == "function" && Class[parentName].prototype.__ancestor === Core ) ? 
						Class[parentName] : Core );
			
			return parent;
			
		}( ( typeof options.parent == "string" ) ? options.parent : "Core" );

	_constructor = ( options.constructor == undefined ) ? function() {} : options.constructor;
	
	// Prototype
	_class.prototype.include = _class.include = Class.include;
	_class.prototype.extend = _class.extend = Class.extend;
	_class.include( _parent.prototype );
	
	_class.prototype.__class = _class;
	_class.prototype.__parent = _parent;
	_class.prototype.__ancestor = _parent.prototype.__ancestor;
	_class.prototype.constructor = _class;
	
	_class.extend( _parent, _class );
	
	_class.prototype.name = _class.name;
	
	var _nativeCode = function() {
	
		var parent = _parent.apply( _instance, arguments );
		var constructor = ((typeof _constructor == "function") ? _constructor.apply( _instance, arguments ) : _constructor);
		
		var _superClass = function __SUPER__() {
			return {};
		};
		
		var _super = new _superClass();
		
		for ( var name in parent ) {
			_super[name] = parent[name];
		};
		
		if ( typeof _instance.extend == "function" ) {
			_instance.extend( parent );
			_instance.extend( constructor );
		};
		
		_instance._super = function() {
			return _super;
		};
		
		if ( ( this.constructor == Core || _instance.constructor == _class ) && typeof _instance.__construct == "function" ) {      
			_instance.__construct.apply( _instance, arguments );
		};
		
		return _instance;
	};
	//
	if ( className && Class[className] == undefined ) {
		Class[className] = _class;
	};
	
	if ( options["static"] != undefined ) {
		options["staticConstructor"] = options["static"];
	};
	
	if ( options["staticConstructor"] != undefined ) {
		var _staticInstance = ( typeof options.staticConstructor == "function" ) ? options.staticConstructor.apply(_class) : options.staticConstructor;
	
		Class.extend( _staticInstance, _class );
	};
	
	return _class;
};

Class.isClass = Core.isClass = function( constructor ) {
	if ( typeof constructor != "function" ) {
		return false;
	};
	
	if ( typeof constructor.prototype["__ancestor"] == undefined ) {
		return false;
	};
	
	return  ( constructor.prototype.__ancestor === Core );
};

Class.extend = function( prop, context, ignoreOverride, hidden ) { // 확장 함수
	context = ( context == undefined ) ? this : context;

	for ( var name in prop ) {
		if ( ! ignoreOverride || context[name] == undefined ) {
			if ( ! hidden || name.substr(0,1) !== "_" ) {
				context[name] = prop[name];
			};
		}
	};
};
	
Class.include = function( prop, context ) { // Prototype 확장 함수
	context = ( context == undefined ) ? this : context;
	
	var prototype = context.prototype;
	for ( var name in prop ) {
		prototype[name] = prop[name];
	};
};

UI.Class = Class;

})(window);