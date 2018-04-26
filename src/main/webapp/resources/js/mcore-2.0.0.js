/*!
 * Morpheus 2.0.0 Library
 * http://www.morpheus.kr
 *
 * Copyright 2013 Uracle Co., Ltdocument. 
 * 166 Samseong-dong, Gangnam-gu, Seoul, 135-090, Korea All Rights Reserved.
 *
 * Date: 2014-01-06
 */

// Load wnInterface File
(function( window, undefined ) {

var 
coreFileName = "mcore-2.0.0.js",
interfaceFileName = "wnInterface.js";

// Load Script 
var ScriptLoader=function(){var c=document.getElementsByTagName("head")[0];var d=document.getElementsByTagName("base")[0];if(d){c=baseElement.parentNode};return{scriptPath:function(a){var b=document.getElementsByTagName('script'),protocal=document.location.protocol,scriptPath="",components;for(var i=0;i<b.length;i++){if(b[i].src&&b[i].src.indexOf(a)!=-1){scriptPath=b[i].src.substring(0,b[i].src.lastIndexOf('/')+1);break}};scriptPath=scriptPath.replace(document.location.protocol+"//",'');components=scriptPath.split("/");if(components.length>0&&components[components.length-1]==""){components.pop()};return protocal+"//"+components.join("/")},loadScript:function(a){var b=document.createElement("script");b.src=a;b.type="text/javascript";b.charset="utf-8";if(d){c.insertBefore(b,d)}else{c.appendChild(b)}},writeScript:function(a){document.write('<script type="text/javascript" src="'+a+'"></script>')}}}();

ScriptLoader.writeScript( ScriptLoader.scriptPath(coreFileName) + "/" + interfaceFileName );

})(window);


// Morpheus 2.0 Javascript Core
(function( window, undefined ) {

var debug = window.console || {
	log: function() {},
	warn: function() {},
	error: function() {}
};

var MCore = {};

MCore.util = {
	typeOf: function(_value) {
		
		if (_value === undefined || _value === null) {
			return undefined;
		}
		
		if (typeof _value === 'string') {
			return 'string';
		}
		
		if (typeof _value === 'number') {
			return 'number';
		}
		
		if (_value.constructor === Object) {
			return 'object';
		}
		
		if (_value.constructor === Array) {
			return 'array';
		}
		
		if (_value.constructor === Function) {
			return 'function';
		}
		
		if (_value.constructor === Boolean) {
			return 'boolean';
		}
		
		return typeof _value;
	},

	parseParam: function(_value){
		if (M.util.typeOf(_value) === 'object') {
			var param = new Parameter();
			// 객체의 경우
			for (var key in _value) {
				param.putParameter(key, _value[key])
			}
			return param.toParamString();
		}
		
		if (M.util.typeOf(_value) === 'string') {
			return encodeURI( _value.replace(/^\?/, '') );
		}
	},

	// 상수를 반환한다.
	parseConstant: function(_type, _list){
		var  type = _type || 0
			,list = _list

		if (typeof type == 'number') {
			return list.split('|')[type].toUpperCase();
		}
		if (!new RegExp('^(?:' + type + ')$', 'i').test(type)) {
			debug.error('dateType이 잘못 지정되었습니다.');
			return false;
		} else {
			return type.toUpperCase();
		}
	},
	
	splitString: function( str, delimiter ) {
		delimiter = delimiter || ',';
	
		var arr = str.split(delimiter);
		for ( var key in arr ) {
			arr[key] = M.util.trim(arr[key]);
		}
		return arr;
	},
	
	json: function(_value, _type) {
		if (_type === '0' || _type === 0 || _type === 'string') {
			return JSON.stringify(_value);
		}
		
		if (_type === '1' || _type === 1 || _type === 'json') {
			if (_value != '') {
				return JSON.parse(_value);
			} else {
				return {};
			}
		}
		
		if (typeof _value === 'object') {
			return JSON.stringify(_value);
		} else {
			if (_value != '') {
				return JSON.parse(_value);
			} else {
				return {};
			}
		}
	},
	
	stringFromObject: function( obj ) {
		var type = M.util.typeOf( obj );
		var value;
		
		switch( type ) {
			case "object":
			case "array":
				value = JSON.stringify(obj);
				break;
				
			case "number":
				value = obj + '';
				break;
				
			case "boolean":
				value = (obj) ? "true" : "false";
				break;
				
			case "function":
			default:
				value = obj + '';
				break;
		}
		
		return value;
	},
	
	objectFromString: function( str ) {
		var obj = str;
		
		if ( str && str.length > 1 ) {
			var firstChat = str.substr(0,1);
			if ( firstChat == '{' || firstChat == '[' ) {
				try {
					obj = JSON.parse(str);
				}
				catch(e) {
					obj = str;
				};
			}
		}
		
		return obj;
	},
	
	profix: function( str ) {
		if ( str && typeof str == "string" && str.length > 1 ) {
			return str.substr(0,1);
		}
		return "";
	},
	
	trim: function( str ) {
		var trimReg = new RegExp( "^" + "[\\x20\\t\\r\\n\\f]" + "+|((?:^|[^\\\\])(?:\\\\.)*)" + "[\\x20\\t\\r\\n\\f]" + "+$", "g" );
	
		return str == null ?
				"" :
				( str + "" ).replace( trimReg, "" );	
	}
};

var DefaultSetting = function( setting ) {
	
	var _defaultVars = setting.defaultSetting || {};
	var _surrogateKeys = setting.surrogateKeys || {};
	var _enumsKeys = setting.enumsKeys || {};
	
	return {
		
		_convertObject: function( obj, vars ) {
			if ( vars == undefined ) {
				return obj;
			}
		
			for ( var key in obj ) {
				obj[key] = this._convert( obj[key], vars[key] );
			};
			
			return obj;
		}, 
		
		_convertArray: function( arr, vars ) {
			for ( var i=0, count = arr.length; i<count; i++ ) {
				arr[i] = this._convert( arr[i], vars[i] );
			};
			
			return arr;
		},
		
		_convertVar: function( defaultVars, vars ) {
			return ( vars !== undefined ) ? vars : defaultVars;
		},
		
		_convertEnums: function( type, enums ) {
			var  
			type = type || 0,
			list = enums.split('|');
	
			if (typeof type == 'number') {
				return list[type].toUpperCase();
			};
			
			if (!new RegExp('^(?:' + type + ')$', 'i').test(type)) {
				debug.warn( type + ' is not valid in enums', list );
				return list[0];
			}
			else {
			
				return type.toUpperCase();
			};
		},
	
		_convert: function( defaultVars, vars ) {
			
			if ( M.util.typeOf(defaultVars) == "object" ) {
				return this._convertObject( defaultVars, vars );
			}
			else if ( M.util.typeOf(defaultVars) == "array" ) {
				return this._convertArray( defaultVars, vars );
			}
			else if ( vars != undefined ) {
				return this._convertVar( defaultVars, vars );
			}
			
			return defaultVars;
		},
		
		enumsKeys: function( keys ) {
			for ( var key in keys ) {
				_enumsKeys[key] = keys[key];
			};
		},
		
		surrogateKeys: function( keys ) {
			for ( var key in keys ) {
				_surrogateKeys[key] = keys[key];
			};
		},
		
		convert: function( vars ) {
		
			var key, surrogateKey, originalKey, wasVars,
			vars = vars || {};
			wasVars = vars;
			
			for ( key in wasVars ) {
			
				surrogateKey = key.toLowerCase();
				
				if ( _surrogateKeys[surrogateKey] != undefined ) {
					originalKey = _surrogateKeys[surrogateKey];
					
					if ( vars[originalKey] == undefined ) {
						vars[originalKey] = wasVars[key];
					};
				};
			};
			
			for ( key in vars ) {
				if ( _enumsKeys[key] ) {
					vars[key] = this._convertEnums(vars[key] || 0, _enumsKeys[key] );
				};
			};
		
			return this._convert( _defaultVars, vars );
		}
	};
};

DefaultSetting.create = function( setting ) {
	return new DefaultSetting( setting );
};

/* 버퍼 개체로 익명함수 처리 */
var EventBuffer = function() {
	this.g = {};
};

EventBuffer.bufferIndex = 0;

EventBuffer.prototype = {
	
	handler: function( callback, /* INTERNAL */ group, progress, options ) {
		var that = this,
			key = group || this.groupID(),
			idx = this.makeIndex( key ),
			context = this;
		
		if (!this.g[key]) {
			this.g[key] = {};
		};
		
		if ( ! callback ) {
			callback = function() {};
		};
		
		var handler = function() {
			
			var args = Array.prototype.slice.call( arguments, 0 );
			if ( options != undefined ) {
				args.push( options );
			};
			
			callback.apply(context, args);
			
			if (!progress) { // TODO: 다시한번 체크
				delete that.g[key];
			};
		};
		
		handler.key = key;
		handler.idx = idx;
		
		this.g[key][idx] = handler;
		
		return handler;
	},
	
	on : function() {
		var handler = this.handler.apply( this, arguments );
		
		return 'M.buffer["g"]["'+handler.key+'"]["'+handler.idx+'"]';
	},
	
	makeIndex: function( groupID ) {
		var arr = groupID.split('.');
		var bufferIndex = arr[arr.length-1];
	
		return 'idx' + Math.round(Math.random()*100000) + '.' + bufferIndex;
	},
	
	groupID: function() {
		var bufferIndex = EventBuffer.bufferIndex ++;
		
		return 'g' + Math.round(Math.random()*100000) + '.' + bufferIndex;
	}
};

MCore.buffer = new EventBuffer();

/* Callback 개체로 이벤트 처리 */
var EventCallback = function() {
	this.buffer = {};
}

EventCallback.prototype = {
	set: function(key, value) {
		if (this.buffer[key] == undefined) {
			this.buffer[key] = [];
		}
		if (value) {
			this.buffer[key][0] = value;
		}
	},
	put: function(key, value) {
		if (this.buffer[key] == undefined) {
			this.buffer[key] = [];
		}
		if (value) {
			this.buffer[key].push(value);
		}
	},
	get: function(key) {
		return this.buffer[key];
	},
	exec: function(key) {
		this.batch.apply( this, arguments );
		this.remove(key);
		return this.buffer;
	},
	batch: function(key) {
		if (this.buffer[key] == undefined) {
			return false;
		}
		var fns = this.buffer[key];
		var args = Array.prototype.slice.call(arguments,0); args.shift();
		for (var fn in fns) {
		    if ( typeof fns[fn] !== "function" ) {
		        console.error( "fns[fn]", fns[fn] );
		        continue;
		    };
		    
		    fns[fn].apply(fns[fn], args);   
			
		}
		return this.buffer;
	},
	remove: function(key){
		delete this.buffer[key];	
	}
};

MCore.cb = MCore.callback = new EventCallback();

var CoreNavigator = function() {
    var
    
    ua = window.navigator.userAgent || {},
    		
    os = (/iphone|ipad|ipod/gi).test(ua) ? 
    		'ios' : (/android/gi).test(ua) ? 
    		'android' : (/mac/gi).test(ua) ? 
    		'macOS' : (/windows/gi).test(ua) ? 
    		'windows' : 
    		'other',
    
    device = (/iphone|ipad|ipod|android/gi).test(ua) ? 
    		'mobile' : 
    		'pc',
    		
    deviceType = 
    		(os === 'ios') ? ( (/ipad/gi).test(ua) ? 'tablet' : 'phone' ) :
    		(os === 'android') ? ( (/mobile/gi).test(ua) ? 'phone' : 'tablet' ) :
			'pc',
    		
    browserName = (/chrome/gi).test(ua) ? 
    		'chrome' : (/safari/gi).test(ua) ? 
    		'safari' : (/simulator/gi).test(ua) ? 
    		'ios simulator' : (/firefox/gi).test(ua) ? 
    		'firefox' : (/triden/gi).test(ua) ? 
    		'ie' : (/presto/gi).test(ua) ? 
    		'opera' : 
    		'other',
    		
    browserVer = 
    		browserName === 'safari' ? ua.match(/version\/([0-9.]+)/ig).toString().split("/")[1] : 
    		browserName === 'opera' ? ua.match(/version\/([0-9.]+)/ig).toString().split("/")[1] : 
			browserName === 'chrome' ? ua.match(/chrome\/([0-9.]+)/ig).toString().split("/")[1] : 
			browserName === 'firefox' ? ua.match(/firefox\/([0-9.]+)/ig).toString().split("/")[1] : 
			browserName === 'ie' ? ua.match(/MSIE ([0-9.]+)/ig).toString().split(" ")[1] : 
			undefined,
			
    osVer = 
    		os === 'android' ? ua.match(/android ([0-9.]+)/ig).toString().split(" ")[1] : 
    		os === 'ios' ? ua.match(/ OS ([0-9._]+)/ig).toString().split(" ")[2].replace(/_/g, '.') : 
    		os === 'macOS' ? ua.match(/ Mac OS X ([0-9._]+)/ig).toString().split("X ")[1].replace(/_/g, '.') : 
    		os === 'windows' ? ua.match(/ NT ([0-9._]+)/ig).toString().split(" ")[2] : undefined,
    		
    prefix = (/webkit/gi).test(ua) ? 
    		'webkit' : (/firefox/gi).test(ua) ? 
    		'moz' : (/triden/gi).test(ua) ? 
    		'ms' : (/presto/gi).test(ua) ? 
    		'o' : 
    		'';

	this.userAgent = ua;
	this.device = device;
	this.deviceType = deviceType;
	this.os = os;
	this.browserName = browserName;
	this.browserVer = browserVer;
	this.osVer = osVer;
	this.prefix = prefix;
    
    return this;
};

MCore.navigator = new CoreNavigator();


/*
 * 화면 상태 함수
 */
MCore.onReady = function(fn) {
	M.callback.put('oninitpage', fn);
	
	return MCore;
};

MCore.onHide = function(fn) {
	M.callback.put('onhidepage', fn);
	
	return MCore;
};

MCore.onRestore = function(fn) {
	M.callback.put('onrestorepage', fn);
	
	return MCore;
};

MCore.onDestroy = function(fn) {
	M.callback.put('ondestroypage', fn);
	
	return MCore;
};

MCore.onResume = function(fn) {
	M.callback.put('onresumepage', fn);
	
	return MCore;
};

MCore.onPause = function(fn) {
	M.callback.put('onpausepage', fn);
	
	return MCore;
};

MCore.onBack = function(fn) {
	if (fn === undefined) {
		var events = M.getScreenEvents();
		M.callback.batch('onhistorybackpage', events);
		
		return MCore;
	}
	if (M.util.typeOf(fn) == 'function') {
		M.callback.put('onhistorybackpage', fn);
		
		return MCore;
	}
};

MCore.onKey = function(fn) {
	M.callback.put('onkey', fn);
	
	return MCore;
};

/*
MCore.onNetworkError = function(fn) {
	M.callback.put('onnetworkerror', fn);
	
	return MCore;
};
*/

// 화면 상태 함수 이벤트
MCore.getScreenEvents = function(fn) {
	
	var 
	eventInfo = WN2InfoEvent(),
	href = window.location.href,
	mode = '',
	thisStack = eventInfo.stack[ eventInfo.stack.length-1 ],
	thisTab = eventInfo.stack[ eventInfo.stack.length-1 ].tabs[0];
	deviceType = eventInfo.deviceType,
	params = thisTab ? thisTab.param : {},
	orient = thisTab ? thisTab.orient : '',
	prevPage = eventInfo.prevPage,
	stack = thisStack,
	tabStack = thisStack.tabs,
	action = thisStack.action,
	time = eventInfo.startTime;
	

	return {
		'action': action,
		'browser': M.navigator.browserName,
		'browserVer': M.navigator.browserVer,
		'currentPage': href.substr(href.lastIndexOf('/')+1).split('?')[0],
		'device': M.navigator.device,
		'deviceType': M.navigator.deviceType,
		'fullPath': href,
		'mode': mode == 'Y' ? 'develop' : mode == 'N' ? 'real' : '',
		'orient': orient,
		'os': M.navigator.os,
		'osVer': M.navigator.osVer,
		//'param': JSON.parse(params),
        'param': params,
		'path': href.split('?')[0],
		'prefix': M.navigator.prefix,
		'prevPage': prevPage,
		'screenHeight': window.innerHeight,
		'screenWidth': window.innerWidth,
		'scrollHeight': document.body.clientHeight,
		'stack': stack,
		'scrollWidth': document.body.clientWidth,
		'tabStack': tabStack,
		'time': new Date().getTime() - time
	};
};

/*
 * 화면이동 
 */
MCore.page = {
		
	'html': function(_url, _setting) {
		var 
		defaultSetting = DefaultSetting.create({
			defaultSetting: {
				'url': '',
				'param': '',
				'delay': 0, //
				'actionType': 'NEW_SCR',
				'animationType': 'DEFAULT',
				'orientationType': 'DEFAULT'
			},
			surrogateKeys: {
				'action': 'actionType',
				'animation': 'animationType',
				'animate': 'animationType',
				'orient': 'orientationType',
				'orientation': 'orientationType'
			},
			enumsKeys: {
				'actionType': 'NEW_SCR|NO_HISTORY|CLEAR_TOP',
				'animationType': 'DEFAULT|NONE|SLIDE_LEFT|SLIDE_RIGHT|SLIDE_TOP|SLIDE_BOTTOM|ZOOM_IN|ZOOM_OUT|FADE|MODAL_UP|MODAL_DOWN',
				'orientationType': 'DEFAULT|PORT|LAND|ALL'
			}
		}),
		
		setting = defaultSetting.convert( M.util.typeOf(arguments[0]) == "object" ? arguments[0] : M.util.typeOf(arguments[1]) == "object" ? arguments[1] : {} ),
		url = ( M.util.typeOf(_url) == "string" ) ? _url : setting.url,
		param = M.util.parseParam(setting.param),
		handler = function() {
			WNMoveToHtmlPage(url, param, setting.actionType, setting.animationType, setting.orientationType);
		};
		
		if ( setting.delay > 0 ) {
			setTimeout( handler, setting.delay );
		}
		else {
			handler.call( MCore );
		};
		
		return MCore;
	},
	
	'native': function(_appClass, _setting) {
	
		var 
		defaultSetting = DefaultSetting.create({
			defaultSetting: {
				'appClass': '',
				'param': '',
				'actionType': 'NEW_SCR',
				'animationType': 'DEFAULT',
				'orientationType': 'DEFAULT'
			},
			surrogateKeys: {
				'action': 'actionType',
				'animation': 'animationType',
				'animate': 'animationType',
				'orient': 'orientationType',
				'orientation': 'orientationType'
			},
			enumsKeys: {
				'actionType': 'NEW_SCR|NO_HISTORY|CLEAR_TOP',
				'animationType': 'DEFAULT|NONE|SLIDE_LEFT|SLIDE_RIGHT|SLIDE_TOP|SLIDE_BOTTOM|ZOOM_IN|ZOOM_OUT|FADE|MODAL_UP|MODAL_DOWN',
				'orientationType': 'DEFAULT|PORT|LAND|ALL'
			}
		}),
		
		setting = defaultSetting.convert( M.util.typeOf(arguments[0]) == "object" ? arguments[0] : M.util.typeOf(arguments[1]) == "object" ? arguments[1] : {} ),
		appClass = ( M.util.typeOf(_appClass) == "string" ) ? _appClass : setting.appClass,
		param = M.util.parseParam(setting.param);

		WNMoveToNativePage(appClass, param, setting.actionType, setting.animationType, setting.orientationType);
		
		return MCore;
	},
	
	'back': function(_setting) {
		var 
		defaultSetting = DefaultSetting.create({
			defaultSetting: {
				'param': '',
				'animationType': 'DEFAULT'
			},
			surrogateKeys: {
				'animation': 'animationType',
				'animate': 'animationType'
			},
			enumsKeys: {
				'animationType': 'DEFAULT|NONE|SLIDE_LEFT|SLIDE_RIGHT|SLIDE_TOP|SLIDE_BOTTOM|ZOOM_IN|ZOOM_OUT|FADE|MODAL_UP|MODAL_DOWN'
			}
		}),
	
		setting = defaultSetting.convert( _setting ),
		param = M.util.parseParam(setting.param);
			
		WNBackPage(param, setting.animationType);
		
		return MCore;
	},

	'replace': function(_url, _setting) {
		var 
		defaultSetting = DefaultSetting.create({
			defaultSetting: {
				'url': '',
				'param': '',
			},
			surrogateKeys: {
				
			},
			enumsKeys: {
			
			}
		}),
	
		setting = defaultSetting.convert( M.util.typeOf(arguments[0]) == "object" ? arguments[0] : M.util.typeOf(arguments[1]) == "object" ? arguments[1] : {} ),
		url = ( M.util.typeOf(_url) == "string" ) ? _url : setting.url,
		param = M.util.parseParam(setting.param);
		
		WNReplaceHtmlPage(url, param);
		
		return MCore;
	},

	'info': function() {
		return WN2InfoStack();
	},
	
	'remove': function(_url) {
		var url = _url || '';
		
		return WNRemovePageInPStack(url);
	},
	
	// Tab이동
	'tab': {
		'html': function(_url, _setting) {
			var 
			defaultSetting = DefaultSetting.create({
				defaultSetting: {
					'url': '',
					'param': '',
					'animationType': 'DEFAULT',
					'orientationType': 'DEFAULT'
				},
				surrogateKeys: {
					'animation': 'animationType',
					'animate': 'animationType',
					'orient': 'orientationType',
					'orientation': 'orientationType'
				},
				enumsKeys: {
					'animationType': 'DEFAULT|NONE|SLIDE_LEFT|SLIDE_RIGHT|SLIDE_TOP|SLIDE_BOTTOM|ZOOM_IN|ZOOM_OUT|FADE|MODAL_UP|MODAL_DOWN',
					'orientationType': 'DEFAULT|PORT|LAND|ALL'
				}
			}),
			
			setting = defaultSetting.convert( M.util.typeOf(arguments[0]) == "object" ? arguments[0] : M.util.typeOf(arguments[1]) == "object" ? arguments[1] : {} ),
			url = ( M.util.typeOf(_url) == "string" ) ? _url : setting.url,
			param = M.util.parseParam(setting.param);
		
			WNTabMoveToHtmlPage(url, param, setting.animationType, setting.orientationType);
			
			return MCore;
		},

		'back': function(_setting) {
			var 
			defaultSetting = DefaultSetting.create({
				defaultSetting: {
					'param': '',
					'animationType': 'DEFAULT'
				},
				surrogateKeys: {
					'animation': 'animationType',
					'animate': 'animationType'
				},
				enumsKeys: {
					'animationType': 'DEFAULT|NONE|SLIDE_LEFT|SLIDE_RIGHT|SLIDE_TOP|SLIDE_BOTTOM|ZOOM_IN|ZOOM_OUT|FADE|MODAL_UP|MODAL_DOWN'
				}
			}),
		
			setting = defaultSetting.convert( _setting ),
			param = M.util.parseParam(setting.param);

			WNTabBackPage(param, setting.animationType);
			
			return MCore;
		},

		'remove': function(_url) {
			var url = _url || '';
			
			return WNTabRemovePage(url);
		}
	}
}


/*
 * 암복호화
 */
MCore.sec = {
	'encrypt': function(_str) {
		var str = _str || '';
		
		return WNEncryptString(str);
	},

	'decrypt': function(_str) {
		var str = _str || '';
		
		return WNDecryptString(str);
	}
}


/*
 * 데이터공유 
 */
MCore.data = {
	
	// Global Variable
	'global': function(_key, _value) {
		
		// 모든 전역변수 반환
		if (_key === undefined) {
			var result = WNListAllVariables();
			var values = result.values;
			
			for ( var key in values ) {
				var value = values[key];
				values[key] = M.util.objectFromString( value );
			};
			return values;
		};

		// json형식으로 전역변수 저장
		if (typeof _key === 'object') {
			var obj = _key;
			for (var key in obj) {
				var value = M.util.stringFromObject( obj[key] );
				WNSetVariable(key, value);
			};
			
			return MCore;
		}

		// 특정 전역변수 반환
		if (_value === undefined) {
			var value = WNGetVariable(_key);
			value = M.util.objectFromString( value );
			return value;
		};

		// 전역변수에 저장
		WNSetVariable(_key, M.util.stringFromObject(_value));
		
		return MCore;
	},

	'removeGlobal': function(_key) {
		// 모든 전역변수 삭제
		if (_key === undefined) {
			WNResetAllVariables();
			return MCore;
		}

		// 특정 전역변수 삭제
		WN2DataRemoveGlobal(_key);
		return MCore;
	},
	
	// Storage
	'storage': function(_key, _value) {
		// 모든 storage 반환
		if (_key === undefined) {
			var result = WNListAllStorageVariables();
			var values = result.values;
			
			for ( var key in values ) {
				var value = values[key];
				values[key] = M.util.objectFromString( value );
			};
			return values;
		};

		// json형식으로 전역변수 저장
		if (typeof _key === 'object') {
			var obj = _key;
			for (var key in obj) {
				var value = M.util.stringFromObject( obj[key] );
				WNSetVariableToStorage(key, value);
			};
			
			return MCore;
		}

		// 특정 전역변수 반환
		if (_value === undefined) {
			var value = WNGetVariableFromStorage(_key);
			value = M.util.objectFromString( value );
			return value;
		};

		// 전역변수에 저장
		WNSetVariableToStorage(_key, M.util.stringFromObject(_value));
		
		return MCore;
	},

	'removeStorage': function(_key) {
		// 모든 Storage 삭제
		if (_key === undefined) {
			WNResetAllStorageVariables();
			
			return MCore;
		}

		// 특정 Storage 삭제
		WN2DataRemoveStorage(_key);
		
		return MCore;
	},
	
	// 파라미터 설정
	'param': function(_key, _value) {
		// 모든 storage 반환
		if (_key === undefined) {
			var result = WNListAllParameters();
			var values = result.values;
			
			for ( var key in values ) {
				var value = values[key];
				values[key] = decodeURIComponent(M.util.objectFromString( value ));
			};
			return values;
		};

		// json형식으로 전역변수 저장
		if (typeof _key === 'object') {
			var obj = _key;
			for (var key in obj) {
				var value = encodeURIComponent(M.util.stringFromObject( obj[key] ));
				WNSetParameter(key, value);
			};
			
			return MCore;
		}

		// 특정 전역변수 반환
		if (_value === undefined) {
			var value = WNGetParameter(_key);
			value = M.util.objectFromString( value );
			return decodeURIComponent(value);
		};

		// 전역변수에 저장
		WNSetParameter(_key, M.util.stringFromObject(_value) );
		
		return MCore;
	},

	'removeParam': function(_key) {
		if (_key === undefined) {
			WNRemoveAllParameter();
			return MCore;
		};
		
		WNRemoveParameter(_key);
		return MCore;
	}
}

/*
 * 정보
 */
MCore.info = {
	'memory': function() {
		return WNGetMemoryInfo();
	},
	
	'device': function() {
		return WNGetDeviceInfo();
	},
	
	'stack': function() {
		return WN2InfoStack();
	},

	// 현재앱 정보
	'app': function() {
		return WN2InfoApp();
	}
}


/*
 * 도구
 */
MCore.tool = {
	'log': function() {
		
		if ( arguments.length == 0 ) {
			return false;
		}
		
		var option = arguments[arguments.length-1];
			tag = 'WEB', 
			msg = '',
			level = 'DEBUG', 
			levelType = 'ERROR|WARN|INFO|DEBUG|VERBOSE',
			screen = '',
			platform = M.getScreenEvents(),
			device = platform.device, mode = platform.mode;
		
		for (var opt in arguments) {
			var arg = arguments[opt],
				type = M.util.typeOf(arg);
			
			if (arg != undefined ) {
				if (opt == arguments.length-1 && arg['level'] || 
					opt == arguments.length-1 && arg['tag'] ||
					opt == arguments.length-1 && arg['screen']) {
					// 옵션
					tag = arg['tag'] || 'WEB';
					level = M.util.parseConstant(arg['level'] || 0, levelType);
					screen = arg['screen'] || '';
				} 
				else {
					if (type === 'object') {
						msg += type + ' {';
						for (var key in arg) {
							msg += key+': ' + arg[key] + ', ';
						}
						msg += '}';
						msg = msg.replace(/,\s}$/g, '}');
					} 
					else if (type === 'array') {
						msg += type + ' [';
						for (var key in arg) {
						    if(M.util.typeOf(arg[key]) == 'string') {
    							msg += '"' + arg[key] + '", ';
						    } 
						    else {
    							msg += '' + arg[key] + ', ';
						    }
						}
						msg += ']';
						msg = msg.replace(/,\s]$/g, ']');
					} 
					else {
						msg += arg;
					}
					msg += ' ';
				}
			}
		}
		
		msg = msg.replace(/\n$/g, '').replace(/\n/g, '<br>');
		
		WNLog(tag, msg, level);
		
		return MCore;
	}
};

/*
 * 시스템
 */
MCore.sys = {
	'call': function(_number) {
		var phoneNo = _number.replace(/-/g, '');
		WNMakeCall(phoneNo);
		
		return MCore;
	},

	'mail': function(_setting) {
	
		var 
		defaultSetting = DefaultSetting.create({
			defaultSetting: {
				'to': [],
				'cc': [],
				'bcc': [],
				'subject': '제목없음',
				'contents': '내용없음'
			},
			surrogateKeys: {
				'content': 'contents'
			},
			enumsKeys: {
				
			}
		}),
	
		setting = defaultSetting.convert( _setting ),
		recipientsInfo = {};
		
		if (M.util.typeOf(setting.to) === 'string') {
			setting.to = M.util.splitString(setting.to, ',');
		}
		
		if (M.util.typeOf(setting.cc) === 'string') {
			setting.cc = M.util.splitString(setting.cc, ',');
		}
		
		if (M.util.typeOf(setting.bcc) === 'string') {
			setting.bcc = M.util.splitString(setting.bcc, ',');
		}
		
		recipientsInfo.to = setting.to;
		recipientsInfo.cc = setting.cc;
		recipientsInfo.bcc = setting.bcc;
		
		WNMoveToSendMail(recipientsInfo, setting.subject, setting.contents);
		
		return MCore;
	},

	// SMS
	'sms': function(_setting) {
		var 
		defaultSetting = DefaultSetting.create({
			defaultSetting: {
				'numbers': [],
				'message': '내용없음'
			},
			surrogateKeys: {
				'target': 'numbers',
				'contents': 'message',
				'content': 'message',
				'msg': 'message'
			},
			enumsKeys: {
				
			}
		}),
		
		setting = defaultSetting.convert( _setting ),
		phoneNumberInfo = {
			'phoneNumbers': []
		};
		
		if (M.util.typeOf(setting.numbers) === 'string') {
			setting.numbers = setting.numbers.split(/\s+,\s+|,\s+|\s+,/g);
		};
		
		for (var i in setting.numbers) {
			phoneNumberInfo['phoneNumbers'].push( setting.numbers[i].replace(/-/g, '') );
		};
		
		WNMoveToSendSms(phoneNumberInfo, setting.message);
		
		return MCore;
	},

	// 진동
	'vibration': function(_ms) {
		var ms = _ms || 1000;

		if (/[0-9]s$/g.test(ms)) {
			ms = ms.replace(/s$/g, '') * 1000;
		};
		
		if (/[0-9]ms$/g.test(ms)) {
			ms = ms.replace(/ms$/g, '');
		};
		
		WNMakeVibration(ms);
		
		return MCore;
	},

	// 종료
	'exit': function() {
		WNExitProgram();
		
		return MCore;
	},

	// 플래시
	'flash': function(_status) {
		if (_status == undefined) {
			// get
			return WNGetFlashState();
		};
		
		WNControlFlash(_status.toUpperCase());
		
		return MCore;
	}
}


/*
 * 앱연동
 */
MCore.apps = {
	'open': function(_scheme, _param) {
		var 
		scheme = _scheme || '',
		param = _param || '';
		param = M.util.parseParam(param);
		return WNMoveToOpenOtherApp(scheme, param);
	},
	
	'browser': function(_url, _encoding) {
		var url      = _url || ''
		   ,encoding = _encoding || 'UTF-8';
		WNOpenWebBrowser(url, encoding);
		return MCore;
	},
	
	'store': function(_appid) {
		var appid = _appid || '';
		
		WNMoveToOpenAppStore(appid);
		
		return MCore;
	},
	
	// 전체앱 정보
	'info': function(_appid) {
	    if (_appid == undefined) {
            return WN2AppsInfo();
        };
		return WN2AppsInfo(_appid);
	},
	
    'install' : function(_url, _appname) {
        var appname = _appname || ''
           ,url = _url || '';
        WN2AppsInstall(url, appname);
        
        return MCore;
    },
    
    'remove' : function(_package) {
        var __package = _package || '';
        WN2AppsDelete(__package);
        
        return MCore;
    },
};


/*
 * 네트워크 통신
 */
MCore.net = {
	'http': {
		// httpsend
		'send': function(_setting) {
			var 
			defaultSetting = DefaultSetting.create({
				defaultSetting: {
					'server': '',
					'trcode': '',
					'method': '',
					'timeout': -1,
					'reqData': {},
					'userData': {},
					'restAction': undefined,
					'retargetUrl': undefined,
					'tagId': undefined,
					'dummy': false,
					'secure': false,
					'indicator': true,
					'message': '',
					'cancelable': false,
					
					'onSuccess': undefined,
					'onError': undefined,
				},
				surrogateKeys: {
					'data': 'reqData',
					'success': 'onSuccess',
					'error': 'onError',
					'tagId': 'message'
				},
				enumsKeys: {
					
				}
			}),
			
			setting = defaultSetting.convert( _setting ),
			reqNetOptions = {};
			
			setting.tagId = setting.tagId || setting.trcode;
		
			// server name 
			if (setting.server === '') {
				alert('서버를 설정해주세요.');
				return false;
			}
			
			reqNetOptions.encrypt = setting.secure;
			reqNetOptions.indicator = setting.indicator;
			reqNetOptions.indicatorMsg = setting.message;
			reqNetOptions.dummy = setting.dummy;
			reqNetOptions.retargetUrl = setting.retargetUrl;
			reqNetOptions.cancelable  = setting.cancelable;
			reqNetOptions.restAction = setting.restAction;
			reqNetOptions.userData = setting.userData;
			reqNetOptions.timeOut = setting.timeout;
			
			if( setting.onError ) {
			    reqNetOptions.userData.errorHandler = M.buffer.on(setting.onError, null, false, _setting);
			};
			
			reqNetOptions.method = setting.method;
			
			var callback = function() {
				var args = Array.prototype.slice.call(arguments);
				debug.log(JSON.stringify(args,null, 4));
				setting.onSuccess.apply( window, [args[1], args[args.length - 1]] );
			};
			
			WNHttpSendData(setting.server, setting.trcode, M.buffer.on(callback, null, false, _setting ), setting.reqData, reqNetOptions, setting.tagId);
			
			return MCore;
		},

		'upload': function( _url, _setting ) {
			
			var 
			defaultSetting = DefaultSetting.create({
				defaultSettings: {
					'header': {},
		            'body': [
		            /*
		            	{
			                'type': "FILE",
			                'name': "file1",
			                'content': "/var/..../Documents/image/abc.png",
						}
					*/
			        ],
			        'parameters': {
			        /*
				    	'params1': 'values1'
				    */
			        },
			        'encoding': "UTF-8",
		            'onProgress': undefined, //function(total, current, setting) {},
		            'onFinish': function(status, header, body, setting) {
			            debug.log('http.upload.finish', status, header, body, setting );
		            }
	           },
	           surrogateKeys: {
		           'progress': 'onProgress',
		           'finish': 'onFinish'
	           }
			}),
			setting = defaultSetting.convert( _setting ),
			willWaitResult = ( setting.onProgress ) ? true : false,
			willUseWebProgress = false,
			groupID = M.buffer.groupID(),
			parameters = new Parameter();
			headerParameters = new Parameter();
			
			for ( var key in setting.parameters ) {
				parameters.putParameter(key, setting.parameters[key]);
			};
			
			for ( var key in setting.header ) {
				headerParameters.putParameter(key, setting.header[key]);
			};
			
			M.callback.remove('http.upload.progress');
			M.callback.remove('http.upload.finish');
			
			if ( setting.onProgress ) {
				M.callback.set('http.upload.progress', M.buffer.handler(setting.onProgress, groupID, true, _setting ));
			}
			
			M.callback.set('http.upload.finish', M.buffer.handler(setting.onFinish, groupID, false, _setting ));
			
			WNHttpFileUpload(_url, parameters.toParamString(), setting.body, willWaitResult, willUseWebProgress, headerParameters.toParamString(), setting.encoding);

			return MCore;
		},
		
		'download': function( _url, _setting ) {
			
			var 
			defaultSetting = DefaultSetting.create({
				defaultSetting: {
					'header': {},
		            'body': "",
			        'parameters': {
			        /*
				    	'params1': 'values1'
				    */
			        },
		            'encoding': "UTF-8",
		            'onProgress': undefined, //function(total, current, setting) {},
		            'onFinish': function(status, header, body, setting) {
			            debug.log('http.download.finish', status, header, body, setting );
		            }
				},
				surrogateKeys: {
		           'progress': 'onProgress',
		           'finish': 'onFinish'
				}
			}),
			
			setting = defaultSetting.convert( _setting ),
			willWaitResult = ( setting.onProgress ) ? true : false,
			groupID = M.buffer.groupID();
			
			M.callback.remove('http.download.progress');
			M.callback.remove('http.download.finish');
			
			if ( setting.onProgress ) {
				M.callback.set('http.download.progress', M.buffer.handler(setting.onProgress, groupID, true, _setting ));
			}
			
			M.callback.set('http.download.finish', M.buffer.handler(setting.onFinish, groupID, false, _setting ));
			
			//TODO : 추후 WN 함수 구현
			
			return MCore;
		}
	},
	
	'ftp': {
		'upload': function( _host, _setting ) {
			
			var 
			
			defaultSetting = DefaultSetting.create({
				defaultSetting: {
					'port': '21',
					'account': {
						'username': 'anonymous',
						'password': ''
					},
					'target': {
						'files':[]
					},
					'onFinish': function(resultCode, resultMessage, setting) {
						debug.log('ftp.upload', resultCode, resultMessage, setting );
					}
				},
				surrogateKeys: {
		           'finish': 'onFinish'
				}
			}),
			
			setting = defaultSetting.convert( _setting );
            
            var connectionInfo = {
	        	'host': _host,
	        	'username': setting.account.username, 
	        	'password': setting.account.password,
	        	'port': setting.port
            };
            
            var jsonFilesInfo = {
            	'files': setting.target.files
            };
            
            var willWaitResult = false;
            
            M.callback.remove('ftp.upload');
            M.callback.set('ftp.upload', M.buffer.handler(setting.onFinish, null, false, _setting ));
			
			WNFtpFileUpload( connectionInfo, jsonFilesInfo, willWaitResult );
			
			return MCore;
		},
		
		'download': function( _host, _setting ) {
		
			var
			
			defaultSetting = DefaultSetting.create({
				defaultSetting: {
					'port': '21',
					'account': {
						'username': 'anonymous',
						'password': ''
					},
					'target': {
						'localpath': '',
						'serverfiles':[]
					},
					'onFinish': function(resultCode, resultMessage, setting ) {
						debug.log('ftp.download', resultCode, resultMessage, setting );
					}
				},
				surrogateKeys: {
		           'finish': 'onFinish'
				}
			}),
			setting = defaultSetting.convert( _setting ),
            connectionInfo = {
	        	'host': _host,
	        	'username': setting.account.username, 
	        	'password': setting.account.password,
	        	'port': setting.port
            },
            jsonServerFilesInfo = {
            	'localpath': setting.target.localpath,
            	'serverfiles': setting.target.serverfiles
            },
            willWaitResult = false;
            
            M.callback.remove('ftp.download');
            M.callback.set('ftp.download', M.buffer.handler(setting.onFinish, null, false, _setting ));
			
			WNFtpFileDownload( connectionInfo, jsonServerFilesInfo, willWaitResult );
			
			return MCore;
		},
		
		'list': function( _host, _setting ) {
			
			var 
			defaultSetting = DefaultSetting.create({
				defaultSetting: {
					'port': '21',
					'account': {
						'username': 'anonymous',
						'password': ''
					},
					'target': {
						'serverpath': ''
					},
					'onFinish': function(resultCode, resultInfo, setting ) {
						debug.log('ftp.list', resultCode, resultInfo, setting );
					}
				},
				surrogateKeys: {
		           'finish': 'onFinish'
				}
			}),
			setting = defaultSetting.convert( _setting ),
			connectionInfo = {
	        	'host': _host,
	        	'username': setting.account.username, 
	        	'password': setting.account.password,
	        	'port': setting.port
            },
            jsonServerListInfo = {
            	'serverpath': setting.target.serverpath
            },
            willWaitResult = false;
            
            M.callback.remove('ftp.list');
            M.callback.set('ftp.list', M.buffer.handler(setting.onFinish, null, false, _setting ));
			
			WNFtpListDownload( connectionInfo, jsonServerListInfo, willWaitResult );
			
			return MCore;
		}
	},
	'res': {
		'_currentSetting': {},
		
		'update': function(_setting) {
		
			var 
			defaultSetting = DefaultSetting.create({
				defaultSetting: {
					'onProgress': function( totalSize, readSize, remainingSize, percentage ) {
						debug.log( 'res.update.progress', totalSize, readSize, remainingSize, percentage );
					},
					'onFinish': function( result, info ) {
						debug.log( 'res.update.finish', result, info );
					},
					'onError': function( errorCode, errorMessage ) {
						debug.log( 'res.update.error', errorCode, errorMessage );
					}
				},
				surrogateKeys: {
		           'progress': 'onProgress',
		           'finish': 'onFinish',
		           'error': 'onError'
				}
			}),
			options = defaultSetting.convert( _setting ),
			groupID = M.buffer.groupID();
			
			this._currentSetting = _setting;
			
			M.callback.remove('res.update.progress');
			M.callback.remove('res.update.finish');
			M.callback.remove('res.update.error');
			
			M.callback.set('res.update.progress', M.buffer.handler(options.onProgress, groupID, true, _setting ));
			M.callback.set('res.update.finish', M.buffer.handler(options.onFinish, groupID, false, _setting ));
			M.callback.set('res.update.error', M.buffer.handler(options.onError, groupID, false, _setting ));
			
			WN2NetResUpdate();
			
			return MCore;
		},
		
		'retry':function() {
			if ( this._currentSetting != undefined && this._currentSetting.onFinish != undefined ) {
				this.update( this._currentSetting );
			};
			
			return MCore;
		}
	},
	
	'socket': {
		'send': function( _setting ) {
		
			var 
			defaultSetting = DefaultSetting.create({
				defaultSetting: {
					'server': '',
					'trcode': '',
					'sendData': '',
					'templateData': '',
					'onMessage': function() {},
					'onError': function() {},
					'tagId': undefined,
					'timeout': -1,
					'option': {
						'secure': false,
						'indicator': {
							'show': false,
							'message': 'Loading'
						}
					}
				},
				surrogateKeys: {
					'reqPacketData':	'sendData',
					'resTemplateData':	'templateData',
					'callback':			'onMessage',
					'error': 			'onError'
				}
			}),
			
			
			reqNetOptions = {};
			
			setting = defaultSetting.convert( _setting ),
			setting.tagId = setting.tagId || setting.trcode;
		
			// server name 
			if (setting.server === '') {
				alert('서버를 설정해주세요.');
				return false;
			}
			
			//reqNetOptions.encrypt = setting.secure;
			//reqNetOptions.indicator = setting.indicator;
			//reqNetOptions.indicatorMsg = setting.message;
			//reqNetOptions.dummy = setting.dummy;
			//reqNetOptions.retargetUrl = setting.retargetUrl;
			reqNetOptions.cancelable  = setting.cancelable;
			//reqNetOptions.restAction = setting.restAction;
			//reqNetOptions.userData = setting.userData;
			reqNetOptions.timeOut = setting.timeout;
			
			if( setting.onError ) {
			    reqNetOptions.userData.errorHandler = M.buffer.on(setting.onError, null, false, _setting);
			};
			
			WNSocketSendData(setting.server, setting.trcode, M.buffer.on( setting.onMessage, null, false, _setting ), setting.reqPacketData, setting.templateData, reqNetOptions, setting.tagId);
			
			return MCore;
		}
	}
};

/*
 * 팝업
 */
MCore.pop = {
	'_dateByType': function( _type ) {
		var  d = new Date()
			,yyyy = String(d.getFullYear())
			,MM = d.getMonth()+1 < 10 ? '0' + (d.getMonth()+1) : d.getMonth()+1
			,dd = d.getDate() < 10 ? '0' + d.getDate() : d.getDate() + ''
			,hh = d.getHours() < 10 ? '0' + d.getHours() : d.getHours() + ''
			,HH = hh > 12 ? hh-12 : HH
			,mm = d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes() + ''
			,hm = hh > 12 ? 'PM' : 'AM'
			,r = {}
			,minDate = '19790101'
			,maxDate = '21001231'
			HH = HH < 10 ? '0'+HH : HH;
			
		
		if (_type == 'YMD') {
			r.init = yyyy + MM + dd;
			r.min = minDate;
			r.max = maxDate;
			return r;
		}
		if (_type == 'YM') {
			r.init = yyyy + MM;
			r.min = minDate.substr(0, 6);
			r.max = maxDate.substr(0, 6);
			return r;
		}
		if (_type == 'MMYYYY') {
			r.init = MM + yyyy;
			r.min = minDate.substr(4, 2) + minDate.substr(0, 4);
			r.max = maxDate.substr(4, 2) + maxDate.substr(0, 4);
			return r;
		}
		if (_type == 'YYYY') {
			r.init = yyyy;
			r.min = minDate.substr(0, 4);
			r.max = maxDate.substr(0, 4);
			return r;
		}
		if (_type == 'MM') {
			r.init = MM;
			r.min = minDate.substr(4, 2);
			r.max = maxDate.substr(4, 2);
			return r;
		}
		if (_type == 'DD') {
			r.init = dd;
			r.min = minDate.substr(6);
			r.max = maxDate.substr(6);
			return r;
		}
		if (_type == 'HM12') {
			r.init = HH + mm + hm;
			r.min = '0000AM';
			r.max = '1259PM';
			return r;
		}
		if (_type == 'HM24') {
			r.init = hh + mm;
			r.min = '0000';
			r.max = '2359';
			return r;
		}	
	},

	// 데이터 피커
	'date': function(_setting, _callback) {
		var 
		defaultSetting = DefaultSetting.create({
			defaultSetting: {
				'dateType': 'HM12',
				'initDate': '',
				'minDate': '',
				'maxDate': '',
				'callback': ( M.util.typeOf( arguments[0] ) == "function" ) ? arguments[0] : ( M.util.typeOf(_callback) == "function" ) ? _callback : function() {}
			},
			surrogateKeys: {
				'type': 'dateType',
				'init': 'initDate'
			},
			enumsKeys: {
				'dateType': 'HM12|HM24|YMD|YM|MMYYYY|YYYY|MM|DD'
			}
		}),
		
		setting = defaultSetting.convert( ( M.util.typeOf(_setting) == "object" ? _setting : {} ) ),
		
		dateInfo = this._dateByType( setting.dateType );
		
		setting.initDate = setting.initDate || dateInfo['init'];
		setting.minDate = setting.minDate || dateInfo['min'];
		setting.maxDate = setting.maxDate || dateInfo['max'];
		
		WNPopupDatePicker(M.buffer.on(setting.callback, null, false, _setting ), setting.dateType, setting.initDate, setting.minDate, setting.maxDate);
		
		return MCore;
	},

	// 알림창
	'alert': function(_message, _setting, _callback) {
		var 
		defaultSetting = DefaultSetting.create({
			defaultSetting: {
				'title': '정보',
				'message': '',
				'buttons': undefined,
				'callback': function() {}
			},
			surrogateKeys: {
				'button': 'buttons',
				'msg': 'message'
			},
			enumsKeys: {
				
			}
		}),
		
		settingObj = M.util.typeOf(arguments[0]) == "object" ? arguments[0] : M.util.typeOf(arguments[1]) == "object" ? arguments[1] : {},
		setting = defaultSetting.convert( settingObj ),
		buttonLists = [],
		buttonObj = {},
		defaultButtonTitle = '확인',
		groupID = M.buffer.groupID();
		
		if ( _callback == undefined ) {
			if (M.util.typeOf(arguments[0]) === 'function') {
				setting.callback = arguments[0];
				setting.message = setting.message || '';
			}
			else if (M.util.typeOf(arguments[1]) === 'function') {
				setting.callback = arguments[1];
				setting.message = arguments[0] || '';
			}
		};

		setting.buttons = setting.buttons || [];
		
		if ( M.util.typeOf(setting.buttons) == 'object' ) {
		
			if (setting.buttons.buttonInfo != undefined && M.util.typeOf(setting.buttons.buttonInfo) == "array" ) {
				console.log( 'setting.buttons.buttonInfo', setting.buttons.buttonInfo );
			
				for ( var i in setting.buttons.buttonInfo ) {
					var buttonInfo = setting.buttons.buttonInfo[i];
					var func = ( M.util.typeOf(buttonInfo.cbFuncName) == 'string' && M.util.typeOf(window[buttonInfo.cbFuncName]) == 'function' ) ? window[buttonInfo.cbFuncName] : function() {};
					
					//TODO: cbFuncName 이 없을때 warning
					
					buttonLists.push({
						'title': buttonInfo.title || defaultButtonTitle,
						'cbFuncName': M.buffer.on(func, groupID, false, settingObj )
					});
				}
				
			} else {
				debug.error('지원하지 않는 버튼리스트 형식입니다.');
				return MCore;
			}
		}
		else {
		
			if (M.util.typeOf(setting.buttons) === 'string') {
				setting.buttons = setting.buttons.split(/\s+,\s+|,\s+|\s+,/g);
				
				if (setting.buttons.length == 1 && setting.buttons[0] == '') {
					//setting.buttons.length = 0;
					setting.buttons = [];
				};
			};
			
			if ( setting.buttons.length == 0 ) {
				
				buttonLists.push({
					'title': defaultButtonTitle,
					'cbFuncName': M.buffer.on(setting.callback, groupID, false, settingObj )
				});
			}
			else {
				
				for (var i=0, max=Math.min(setting.buttons.length, 3); i<max; i++ ) {
					var buttonTitle = M.util.typeOf(setting.buttons[i]) == "string" ? setting.buttons[i] : defaultButtonTitle;
					buttonLists.push({
						'title': buttonTitle,
						'cbFuncName': M.buffer.on(setting.callback, groupID, false, settingObj )
					});
				}
			}
		};
		
		buttonObj.buttonInfo = buttonLists;
		
		WNPopupConfirm(setting.title, setting.message, buttonObj);
		
		return MCore;
	},
	
	// 선택창
	'list': function(_setting, _callback) {
		var 
		defaultSetting = DefaultSetting.create({
			defaultSetting: {
				'mode': 'SINGLE',
				'title': '선택',
				'message': '',
				'list': undefined,
				'value': undefined,
				'buttons': undefined,
				'selected': undefined,
				'callback': ( M.util.typeOf(_callback) == "function" ) ? _callback : function() {}
			},
			surrogateKeys: {
				'button': 'buttons',
				'msg': 'message'
			},
			enumsKeys: {
				'mode': 'SINGLE|MULTI'
			}
		}),
		
		setting = defaultSetting.convert( _setting ),
		
		wasSelected = setting.selected,
		wasValue = setting.value,
		wasList = setting.list,
		buttonLists = [],
		buttonObj = {},
		listObj = {},
		defaultButtonTitle = '확인',
		groupID = M.buffer.groupID(),
		context = this;
		
		setting.selected = [];
		setting.value = [];
		setting.list = [];
		
		// Selected
		setting.selected =	(M.util.typeOf(wasSelected) === 'string') ? M.util.splitString(wasSelected) : 
							(M.util.typeOf(wasSelected) === 'number') ? [wasSelected] : 
							(M.util.typeOf(wasSelected) === 'array') ? wasSelected : []; // ignore object type
		
		// Value
		wasValue = 	(M.util.typeOf(wasValue) === 'string') ? M.util.splitString(wasValue) :
					(M.util.typeOf(wasValue) === 'number') ? [wasValue] : wasValue;
		
		if ( wasValue ) {
			for (var key in wasValue) {
				setting.value.push(wasValue[key]);
			}
		}
		else {
			setting.value = [];
		}
		
		// List
		if (M.util.typeOf(wasList) === 'string') {
			wasList = M.util.splitString(wasList);
			
			console.log( 'wasList', wasList );
			
			if (wasList.length == 1 && wasList[0] == '') {
				wasList = [];
			};
			
			for ( var key in wasList ) {
				setting.list.push({
					'title' : M.util.trim(wasList[key]),
					'value' : ( setting.value[key] ) ? setting.value[key] : M.util.trim(wasList[key])
				});
			};
		}
		else if (M.util.typeOf(wasList) === 'array') {
		
			if ( wasList.length > 0 && M.util.typeOf(wasList[0]) == "string" ) {
				
				for ( var key in wasList ) {
					setting.list.push({
						'title' : M.util.trim(wasList[key]),
						'value' : ( setting.value[key] ) ? setting.value[key] : M.util.trim(wasList[key])
					});
				};
			}
			else {
				for (var key in wasList) {
					setting.list.push({
						'title': wasList[key].title,
						'value': ( setting.value[key] ) ? setting.value[key] : wasList[key].value
					});
				};
			}
		};
		
		if (setting.list.length == 0) {
			debug.error('리스트가 정의되지 않았습니다.');
			return MCore;
		};
		
		listObj.listInfo = setting.list;
		
		// buttons
		setting.buttons = setting.buttons || [];
		
		if ( M.util.typeOf(setting.buttons) == 'object' ) {
		
			if (setting.buttons.buttonInfo != undefined && M.util.typeOf(setting.buttons.buttonInfo) == "array" ) {
				//console.log( 'setting.buttons.buttonInfo', setting.buttons.buttonInfo );
			
				for ( var i in setting.buttons.buttonInfo ) {
					var buttonInfo = setting.buttons.buttonInfo[i];
					var func = ( M.util.typeOf(buttonInfo.cbFuncName) == 'string' && M.util.typeOf(window[buttonInfo.cbFuncName]) == 'function' ) ? window[buttonInfo.cbFuncName] : function() {};
					
					//TODO: cbFuncName 이 없을때 warning
					buttonLists.push({
						'title': buttonInfo.title || defaultButtonTitle,
						'cbFuncName': (function(idx) {
							
							return M.buffer.on(function( info ) {
								//var args = Array.prototype.slice.call( arguments, 0 );
								//args.unshift(parseInt(idx));
								//args.push( _setting );
								
								if ( info["selectedListInfo"] ) {
									info = info.selectedListInfo;
								}
								else {
									var wasInfo = info;
									info = {
										'title': wasInfo.selectedTitle,
										'valie': wasInfo.selectedVal,
										'index':parseInt( wasInfo.selectedIdx )
									}
								}
							
								func.call(context, parseInt(idx), info, _setting );
							}, groupID, false, _setting );
							
						})(i)
					});
					
					buttonLists.push( buttonInfo );
				}
				
			} else {
				debug.error('지원하지 않는 버튼리스트 형식입니다.');
				return MCore;
			}
		}
		else {
		
			if (M.util.typeOf(setting.buttons) === 'string') {
				setting.buttons = M.util.splitString(setting.buttons);
				
				if (setting.buttons.length == 1 && setting.buttons[0] == '') {
					//setting.buttons.length = 0;
					setting.buttons = [];
				};
			};
			
			if ( setting.buttons.length == 0 ) {
				/*
				buttonLists.push({
					'title': defaultButtonTitle,
					'cbFuncName': M.buffer.on(setting.callback, groupID, false, settingObj )
				});
				*/
			}
			else {
				
				for (var i=0, max=Math.min(setting.buttons.length, 3); i<max; i++ ) {
					var buttonTitle = M.util.typeOf(setting.buttons[i]) == "string" ? setting.buttons[i] : defaultButtonTitle;
					buttonLists.push({
						'title': buttonTitle,
						'cbFuncName':  (function(idx) {
							
							return M.buffer.on(function( info ) {
								//var args = Array.prototype.slice.call( arguments, 0 );
								//args.unshift(parseInt(idx));
								//args.push( _setting );
								
								if ( info["selectedListInfo"] ) {
									info = info.selectedListInfo;
								}
								else {
									var wasInfo = info;
									info = {
										'title': wasInfo.selectedTitle,
										'valie': wasInfo.selectedVal,
										'index':parseInt( wasInfo.selectedIdx )
									}
								}
							
								setting.callback.call(context, parseInt(idx), info, _setting );
							}, groupID, false, _setting );
							
						})(i)
					});
				}
			}
		};
		
		buttonObj.buttonInfo = buttonLists;
		
		if (buttonLists.length == 0) {
			// 버튼없는 리스트
			listObj.willSelectIdx = setting.selected[0];
			
			WNPopupNormalChoice( setting.title, listObj, 
			
				// callback
				M.buffer.on(function( info ) {
					
					if ( info["selectedListInfo"] ) {
						info = info.selectedListInfo;
					}
					else {
						var wasInfo = info;
						info = {
							'title': wasInfo.selectedTitle,
							'value': wasInfo.selectedVal,
							'index':parseInt( wasInfo.selectedIdx )
						};
					};
					
					setting.callback.call(context, 0, info, _setting );
				})
			);
			
		} 
		else {
			
			if (setting.mode === 'SINGLE') {
				// 단일 선택
				listObj.willSelectIdx = setting.selected[0];
				
				WNPopupSingleChoice(setting.title, listObj, buttonObj);
			} else {
				// 다중선택
				listObj.willSelectIdx = setting.selected;
				
				WNPopupMultiChoice(setting.title, listObj, buttonObj);
			}
		};
		
		return MCore;
	},

	'instance': function(_message, _setting) {
	
		var 
		defaultSetting = DefaultSetting.create({
			defaultSetting: {
				'message': '',
				'showTime': 'SHORT'
			},
			surrogateKeys: {
				'show': 'showTime',
				'time': 'showTime'
			},
			enumsKeys: {
				'showTime': 'SHORT|LONG'
			}
		}),
		
		setting = defaultSetting.convert( _setting );
		setting.message = _message || setting.message;

		WNShowInstanceMessage(setting.message, setting.showTime);
		
		return MCore;
	}
};

MCore.getThisDate = function(_type) {
	
	
	return r;
}

/*
 * 미디어
 */
MCore.media = {
	'record': function(_setting) {
		var 
		defaultSetting = DefaultSetting.create({
			defaultSetting: {
				'url': '',
				'path': '',
				'name': M.buffer.groupID()
			},
			surrogateKeys: {
				
			},
			enumsKeys: {
				
			}
		}),
		
		setting = defaultSetting.convert( _setting );
		
		WNMoveToTakeVoice(setting.url, setting.path, setting.name);
		
		return MCore;
	},

	'camera': function(_setting, _callback) {
		var 
		defaultSetting = DefaultSetting.create({
			defaultSetting: {
				'mode': 'PHOTO',
				'path': 'COMMON',
				'name': M.buffer.groupID(),
				'callback': ( M.util.typeOf(_callback) == "function" ) ? _callback : function() {}
			},
			surrogateKeys: {
				
			},
			enumsKeys: {
				'mode': 'PHOTO|VIDEO'
			}
		}),
		
		setting = defaultSetting.convert( _setting );
		setting.path = ( M.util.profix(setting.path) != "/" ) ? "/" + setting.path : setting.path;
		
		if (setting.mode === 'VIDEO') {
			WNMoveToTakeMovie(setting.path, M.buffer.on(setting.callback, null, false, _setting ), setting.name);
		} else {
			WNMoveToTakePhoto(setting.path, M.buffer.on(setting.callback, null, false, _setting ), setting.name);
		};
		
		return MCore;
	},

	'play': function(_url, _type) {
		var 
		url = _url || '',
		type = _type || 'WEB';

		WNMoveToShowVideo(url, type.toUpperCase());
		
		return MCore;
	},

	'library': function(_setting, _callback) {
		var 
		defaultSetting = DefaultSetting.create({
			defaultSetting: {
				'choice': 'SINGLE',
				'media': 'PHOTO',
				'callback': ( M.util.typeOf(_callback) == "function" ) ? _callback : function() {}
			},
			surrogateKeys: {
				
			},
			enumsKeys: {
				'choice': 'SINGLE|MULTI',
				'media': 'PHOTO|VIDEO'
			}
		}),
		
		setting = defaultSetting.convert( _setting );
		setting.choice = setting.choice + '_CHOICE';
		
		WNGetCommonMediaFiles(setting.choice.toUpperCase(), setting.media.toUpperCase(), M.buffer.on(setting.callback, null, false, _setting ));
		
		return MCore;
	},
	
	'removeLibrary': function(_setting, _callback) {
		var 
		defaultSetting = DefaultSetting.create({
			defaultSetting: {
				'files': [],
				'media': 'PHOTO',
				'callback': ( M.util.typeOf(_callback) == "function" ) ? _callback : function() {}
			},
			surrogateKeys: {
				
			},
			enumsKeys: {
				'media': 'PHOTO|VIDEO'
			}
		}),
		
		removeMedias = {
			files: []
		},
		
		setting = defaultSetting.convert( _setting );
		
		if (M.util.typeOf(setting.files) === 'string') {
			setting.files = M.util.splitString( setting.files );
		};
		
		for (var key in setting.files) {
			removeMedias.files.push(files[key]);
		};
		
		WNRemoveMediaFiles(removeMedias, setting.media, M.buffer.on(setting.callback, null, false, _setting));
		
		return MCore;
	},

	'info': function(_setting, _callback) {
		var 
		defaultSetting = DefaultSetting.create({
			defaultSetting: {
				'path': '/',
				'division': 'FILE',
				'media': 'PHOTO',
				'callback': ( M.util.typeOf(_callback) == "function" ) ? _callback : function() {}
			},
			surrogateKeys: {
				
			},
			enumsKeys: {
				'division': 'FILE|FOLDER',
				'media': 'PHOTO|MOVIE|VIDEO|VOICE'
			}
		}),
		
		setting = defaultSetting.convert( _setting );
	
		if (setting.media === 'VIDEO') {
			setting.media = 'MOVIE';
		};
		
		if (setting.division === 'FILE') {
			WNGetMediaFilesInfo(setting.path, setting.media, M.buffer.on(setting.callback, null, false, _setting ));
		} 
		else {
			WNGetMediaFolderInfo(setting.path, setting.media, M.buffer.on(setting.callback, null, false, _setting ));
		};
		
		return MCore;
	}
};


/*
 * file IO
 */
MCore.file = {
	'create': function(_setting) {
		var 
		defaultSetting = DefaultSetting.create({
			defaultSetting: {
				'path': '/',
				'type': 'FILE'
			},
			surrogateKeys: {
				
			},
			enumsKeys: {
				'type': 'FILE|DIR'
			}
		}),
		
		setting = defaultSetting.convert( _setting ),
		jsonData = {};
		jsonData.path = setting.path;
		jsonData.type = setting.type;
		
		WN2FileCreate( M.util.json(jsonData) );
		
		return MCore;
	},

	'write': function(_setting, _callback) {
		var 
		defaultSetting = DefaultSetting.create({
			defaultSetting: {
				'encoding': 'UTF-8',
				'path': '',
				'data': '',
				'indicator': undefined,
				'callback': ( M.util.typeOf(_callback) == "function" ) ? _callback : function() {}
			},
			surrogateKeys: {
				'encode': 'encoding'
			},
			enumsKeys: {
				
			}
		}),
		
		setting = defaultSetting.convert( _setting ),
		
		jsonData = {};
		jsonData.encode = setting.encoding;
		jsonData.path = setting.path;
		jsonData.data = setting.data;
		
		if ( setting.indicator ) {
			jsonData.indicator = setting.indicator;
		}
		
		WN2FileWrite( M.util.json(jsonData), M.buffer.on(setting.callback, null, false, _setting));
		
		return MCore;
	},

	'read': function(_setting, _callback) {
		var 
		defaultSetting = DefaultSetting.create({
			defaultSetting: {
				'encoding': 'UTF-8',
				'path': '',
				'indicator': undefined,
				'callback': ( M.util.typeOf(_callback) == "function" ) ? _callback : function() {}
			},
			surrogateKeys: {
				'encode': 'encoding'
			},
			enumsKeys: {
				
			}
		}),
		
		setting = defaultSetting.convert( _setting ),
		
		jsonData = {};
		jsonData.encode = setting.encoding;
		jsonData.path = setting.path;
		
		if ( setting.indicator ) {
			jsonData.indicator = setting.indicator;
		};

		WN2FileRead( M.util.json(jsonData), M.buffer.on(setting.callback, null, false, _setting));
		return MCore;
	},

	'remove': function(_setting) {
		var 
		defaultSetting = DefaultSetting.create({
			defaultSetting: {
				'path': '/',
				'type': 'FILE'
			},
			surrogateKeys: {
				
			},
			enumsKeys: {
				'type': 'FILE|DIR'
			}
		}),
		
		setting = defaultSetting.convert( _setting ),
		
		jsonData = {};
		jsonData.path = setting.path;
		jsonData.type = setting.type;

		WN2FileRemove( M.util.json(jsonData) );
		return MCore;
	},
	
	'copy': function(_setting, _callback) {
		var 
		defaultSetting = DefaultSetting.create({
			defaultSetting: {
				'type': 'FILE',
				'source': '',
				'destination': '',
				'overwrite': 'TRUE', // TODO: BOOLEAN 값으로는 할 수 없는지 체크
				'onProgress': function() {},
				'onFinish': ( M.util.typeOf(_callback) == "function" ) ? _callback : function() {}
			},
			surrogateKeys: {
				'progress': 'onProgress',
				'finish': 'onFinish',
				'callback': 'onFinish'
			},
			enumsKeys: {
				'type': 'FILE|DIR'
			}
		}),
		
		groupID = M.buffer.groupID(),
		setting = defaultSetting.convert( _setting ),
		
		jsonData = {};
		jsonData.type = setting.type;
		jsonData.source = setting.source;
		jsonData.destination = setting.destination;
		jsonData.overwrite = setting.overwrite;
		
		if ( setting.indicator ) {
			jsonData.indicator = setting.indicator;
		};
		
		WN2FileCopy( M.util.json(jsonData), M.buffer.on(setting.onProgress, groupID, true, _setting), M.buffer.on(setting.onFinish, groupID, false, _setting));
		
		return MCore;
	},
	
	'move': function(_setting, _callback) {
		var 
		defaultSetting = DefaultSetting.create({
			defaultSetting: {
				'type': 'FILE',
				'source': '',
				'destination': '',
				'overwrite': 'TRUE', // TODO: BOOLEAN 값으로는 할 수 없는지 체크
				'indicator': undefined,
				'onProgress': function() {},
				'onFinish': ( M.util.typeOf(_callback) == "function" ) ? _callback : function() {}
			},
			surrogateKeys: {
				'progress': 'onProgress',
				'finish': 'onFinish',
				'callback': 'onFinish'
			},
			enumsKeys: {
				'type': 'FILE|DIR'
			}
		}),
		
		groupID = M.buffer.groupID(),
		setting = defaultSetting.convert( _setting ),
		
		jsonData = {};
		jsonData.type = setting.type;
		jsonData.source = setting.source;
		jsonData.destination = setting.destination;
		jsonData.overwrite = setting.overwrite;
		
		if ( setting.indicator ) {
			jsonData.indicator = setting.indicator;
		};
		
		WN2FileMove( M.util.json(jsonData), M.buffer.on(setting.onProgress, groupID, true, _setting), M.buffer.on(setting.onFinish, groupID, false, _setting));
		return MCore;
	},
	
	'info': function(_setting) {
		var 
		defaultSetting = DefaultSetting.create({
			defaultSetting: {
				'path': 'doc://',
			},
			surrogateKeys: {
				
			},
			enumsKeys: {
				
			}
		}),
		
		setting = defaultSetting.convert( _setting ),
		
		jsonData = {};
		jsonData.path = setting.path;

		return WN2FileInfo(M.util.json(jsonData));
	},
	
	'list': function(_setting) {
	
		var 
		defaultSetting = DefaultSetting.create({
			defaultSetting: {
				'path': 'doc://',
				'type': 'DIR'
			},
			surrogateKeys: {
				'name': 'path',
				'option': 'type'
			},
			enumsKeys: {
				//'type': 'FILE|DIR'
			}
		}),
		
		setting = defaultSetting.convert( _setting ),
		
		jsonData = {};
		jsonData.option = setting.type;
		jsonData.name = setting.path;

		return WNFileIoList(jsonData);
	}
};

/*
 * DB
 */
MCore.db = {
	'create': function(_name, _callback) {
		var  
		name = _name || '',
		callback = _callback || function() {};
		
		WNLocalDbCreate(name, M.buffer.on( callback, null, false ) );
		
		return MCore;
	},
	
	'remove': function(_name, _callback) {
		var 
		name = _name || '', 
		callback = _callback || function() {};
		
		WNLocalDbDelete(name, M.buffer.on( callback, null, false ));
		
		return MCore;
	},
	
	'open': function(_name, _callback) {
		var
		name = _name || '',
		callback = _callback || function() {};
		
		WNLocalDbOpen(name, M.buffer.on( callback, null, false ));
		
		return MCore;
	},
	
	'close': function(_name, _callback) {
		var
		name = _name || '',
		callback = _callback || function() {};
		
		WNLocalDbClose(name, M.buffer.on( callback, null, false ));
		
		return MCore;
	},
	
	'execute': function(_name, _sql, _callback) {
		var 
		name = _name || '',
		sql = _sql || '',
		callback = _callback || function() {},
		
		inputData = {};
		inputData.db_name = name;
		inputData.sql = sql;
		
		WNLocalDbExecuteSql(inputData, M.buffer.on( callback, null, false ));
		
		return MCore;
	}
};

/*
 * 압축
 */
MCore.zip = {
	'zip': function(_setting) {
		var 
		defaultSetting = DefaultSetting.create({
			defaultSetting: {
				'files': [],
				'info': '',
				'cbFuncName': '',
				'callback': function() {},
				'options': ''
			},
			surrogateKeys: {
				'cb': 'cbFuncName',
				'cbfunc': 'cbFuncName',
				'opt': 'option'
			},
			enumsKeys: {
				
			}
		}),
	
		setting = defaultSetting.convert( _setting ),
		callback = ( M.util.typeOf(setting.cbFuncName) == 'string' && M.util.typeOf(window[setting.cbFuncName]) == 'function' ) ? window[setting.cbFuncName] : setting.callback;
	
		WNZip(setting.files, setting.info, M.buffer.on(callback, null, false, _setting), setting.options);
		
		return MCore;
	},

	'unzip': function(_setting) {
		var 
		defaultSetting = DefaultSetting.create({
			defaultSetting: {
				'files': [],
				'destination': '',
				'cbFuncName': '',
				'callback': function() {},
				'options': ''
			},
			surrogateKeys: {
				'cb': 'cbFuncName',
				'cbfunc': 'cbFuncName',
				'opt': 'option'
			},
			enumsKeys: {
				
			}
		}),
	
		setting = defaultSetting.convert( _setting ),
		callback = ( M.util.typeOf(setting.cbFuncName) == 'string' && M.util.typeOf(window[setting.cbFuncName]) == 'function' ) ? window[setting.cbFuncName] : setting.callback;
	
		WNUnzip(setting.files, setting.destination, M.buffer.on(callback, null, false, _setting), setting.options);
		
		return MCore;
	}
};

/*
 * QR
 */
MCore.QR = {
	'scan': function(_setting) {
		var 
		defaultSetting = DefaultSetting.create({
			defaultSetting: {
				'cbFuncName': '',
				'callback': function() {},
				'options': ''
			},
			surrogateKeys: {
				'cb': 'cbFuncName',
				'cbfunc': 'cbFuncName',
				'opt': 'option'
			},
			enumsKeys: {
				
			}
		}),
		
		setting = defaultSetting.convert( _setting ),
		callback = ( M.util.typeOf(setting.cbFuncName) == 'string' && M.util.typeOf(window[setting.cbFuncName]) == 'function' ) ? window[setting.cbFuncName] : setting.callback;

		WNMoveToTakeQRCode(M.buffer.on(callback, null, false, _setting), setting.options);
		
		return MCore;
	}
};

/* 전역변수 할당 */
window.M = MCore;

})(this, undefined);



/*
 * 전역함수
 * 모피어스 2.0에서 전역함수를 사용하기 때문에 
 * 모피어스 1.0의 전역함수는 무효화된다.
 */
function onInitPage() {
	var events = M.getScreenEvents();
	//eval(M.callback.excute(key))
	M.callback.batch('oninitpage', events);
}

function onHidePage() {
	var events = M.getScreenEvents();
	M.callback.batch('onhidepage', events);
}

function onRestorePage() {
	var events = M.getScreenEvents();
	M.callback.batch('onrestorepage', events);
}

function onDestroyPage() {
	var events = M.getScreenEvents();
	M.callback.batch('ondestroypage', events);
}

function onResume() {
	var events = M.getScreenEvents();
	M.callback.batch('onresumpage', events);
}

function onPause() {
	var events = M.getScreenEvents();
	M.callback.batch('onpausepage', events);
}

function onKey(evt) {
	evt = M.util.json(evt);
	if (evt['key'] == 'back' && evt['event'] == 'keyup') {
		M.onBack();
		return MCore;
	};
	M.callback.batch('onkey', evt);
}


/*
function onNetworkError( callerServerName, trCode, errCode, errMessage ) {
	var args = Array.prototype.slice.call( arguments, 0 );
	args.unshift( "onnetworkerror" ); 
	
	M.callback.batch.apply( M.callback, args );
}

function CBCommonNetworkHandlingError(callerServerName, trCode, errCode, errMessage) {
	onNetworkError.apply( this, arguments );
}
*/

// 날짜선택 콜백 전역함수
/*
function CBDatePickerCallbackFunction(value) {
	if (M.callback.get('datepicker')) {
		M.callback.exec('datepicker', value);
	}
}
*/

// 단일선택 콜백 전역함수
/*
function CBNormalListCallbackFunction(value) {
	M.callback.exec('singleList', value);
}

// 싱글초이스 버튼있는 리스트
function CBListCallbackFunction0(value) {
	M.callback.exec('singleList', value);
}
function CBListCallbackFunction1(value) {
	M.callback.exec('singleList', value);
}
function CBListCallbackFunction2(value) {
	M.callback.exec('singleList', value);
}
*/

// alert 콜백
/*
function CBAlertButtonCallbackFunction0(value) {
	M.callback.exec('alert0', value);
}
function CBAlertButtonCallbackFunction1(value) {
	M.callback.exec('alert1', value);
}
function CBAlertButtonCallbackFunction2(value) {
	M.callback.exec('alert2', value);
}
*/

/*
// 사진찍기
function CBTakePhotoCallbackFunction(result, value) {
	M.callback.exec('camera', result, value );
}

// 사진가져오기
function CBGetSinglePhotoCallbackFunction(value) {
	M.callback.exec('library', value);
}

// 미디어파일 삭제
function CBRemoveLibraryCallbackFunction(value) {
	M.callback.exec('removelibrary', value);	
}

// 미디어 정보
function CBMediaInfoCallbackFunction(status, result, option) {
	M.callback.exec('mediainfo', status, result, option);
}
*/

// 네트워크 
function CBHttpSendDataCallbackFunction(){

}

// HTTP 파일 전송 상태 정보 수신
function CBHttpFileUploadOnProgress(totalSize, readSize, remainingSize, percentage) {
    M.callback.batch('http.upload.progress', totalSize, readSize, remainingSize, percentage );
}

// HTTP 파일 전송 콜백 함수
function CBHttpFileUpload(resultCode, resultMessage) {
	M.callback.batch('http.upload.finish', resultCode, resultMessage );
} 

// HTTP 파일 전송 상태 정보 수신
function CBHttpFileDownloaddOnProgress(totalSize, readSize, remainingSize, percentage) {
    M.callback.batch('http.download.progress', totalSize, readSize, remainingSize, percentage );
}

// HTTP 파일 전송 콜백 함수
function CBHttpFileDownload(resultCode, resultMessage) {
	M.callback.batch('http.download.finish', resultCode, resultMessage );
} 

// FTP 파일 보내기 콜백 함수
function CBFtpUpload(resultCode, resultMessage) {
	M.callback.batch('ftp.upload', resultCode, resultMessage );
} 

// FTP 파일 다운로드 콜백 함수
function CBFtpDownload(resultCode, resultMessage) {
    M.callback.batch('ftp.download', resultCode, resultMessage );
}

// FTP 리스트 수신 콜백 함수
function CBFtpDownloadList(resultCode, listInfo) {
    M.callback.batch('ftp.list', resultCode, listInfo );
}

// 리소스 업데이트 진행
function CBUpdateResourceFilesOnProgress(totalSize, readSize, remainingSize, percentage) {
	M.callback.batch('res.update.progress', totalSize, readSize, remainingSize, percentage);
}

// 리소스 업데이트 완료
function CBUpdateResourceFiles(result, info) {
	M.callback.batch('res.update.finish', result, info );
}

function CBUpdateResourceFilesOnNetworkError(errorCode, errorMessage) {
    M.callback.batch('res.update.error', errorCode, errorMessage);
}

/*
// DB
// create
function CBLocalDBCreateCallbackFunction(value) {
	M.callback.exec('db.create', value);
}
// delete
function CBLocalDBDeleteCallbackFunction(value) {
	M.callback.exec('db.delete', value);
}
// open
function CBLocalDBOpenCallbackFunction(value) {
	M.callback.exec('db.open', value);
}
// close
function CBLocalDBCloseCallbackFunction(value) {
	M.callback.exec('db.close', value);
}
// excute
function CBLocalDBExcuteCallbackFunction(value) {
	M.callback.exec('db.excute', value);
}
*/

/*
// File
// write
function CBFileWriteCallbackFunction(value) {
	M.callback.exec('file.create', value);
}

// read
function CBFileReadCallbackFunction(value) {
	M.callback.exec('file.read', value);
}

// copy
function CBFileCopyProgressCallbackFunction(value) {
	M.callback.get('file.copy.progress', value);
}

function CBFileCopyCallbackFunction(value) {
	M.callback.exec('file.copy', value);
	M.callback.remove('file.copy.progress');
}

// move
function CBFileMoveProgressCallbackFunction(value) {
	M.callback.get('file.move.progress', value);
}

function CBFileMoveCallbackFunction(value) {
	M.callback.exec('file.move', value);
	M.callback.remove('file.move.progress');
}
*/

