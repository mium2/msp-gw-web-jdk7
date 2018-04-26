

(function( window, undefined) {


var 
/* ----- Helper ----- */

Helper = function( name, target, hidden ) {
	
	var options = ( typeof target == "function" ) ? target.apply(target, []) : ( target || {} );
	
	Helper[name] = Helper[name] || {};
	
	Helper.extend(Helper[name], options, hidden);
	Helper.extend(window, options, hidden);
	
	return options;
};

Helper.extend = function(context, options, override, hidden ) {
	context = ( context == undefined ) ? {} : context;
	for ( var name in options ) {
		if ( !!override || context[name] == undefined ) {
			if ( ! hidden || name.substr(0,1) !== "_" ) {
				context[name] = options[name];
			};
		}
	};
	
	return context;
};

// Object Helper
Helper( "Object", {
	is_object: function( obj ) {
		return ( Object.prototype.toString.call( obj ) === '[object Object]' );
	},
	
	is_equal: function( a, b, depth, strict ) {
		var bool = true;
	
		if  ( depth === true && typeof a == "object" && typeof b == "object") {
			for ( var key in a ) {
				if ( a[key] !== b[key] ) {
					bool = false;
					break;
				};
			};
		}
		else {
			bool = strict === true ? ( a === b ) : ( a == b );
		};
	
		return bool;
	},
	
	is_plain_object: function( obj ) {
		if ( typeof obj !== "object" || obj.nodeType || obj === window ) {
			return false;
		}

		try {
			if ( obj.constructor &&
					!core_hasOwn.call( obj.constructor.prototype, "isPrototypeOf" ) ) {
				return false;
			}
		} catch ( e ) {
			return false;
		}

		return true;
	},
	
	object_copy: function( obj1 ) {
		var obj2 = {};
		this.object_merge( obj2, obj1, true );
		
		return obj2;
	},
	
	object_merge: function( obj1, obj2, override ) {
		if ( override == true ) {
			for ( var key in obj2 ) {
				var type = typeof obj2;
					
				if ( type == "object" ) {
					this.object_merge( obj1[key], obj2[key], override );
				}
				else {
					obj1[key] = obj2[key];
				};
			};
		}
		else {
			for ( var key in obj1 ) {
				if ( obj2[key] != undefined ) {
					
					var type = typeof obj1[key];
					
					if ( type == "object" ) {
						this.object_merge( obj1[key], obj2[key] );
					}
					else if ( type == "number" ) {
						if ( (''+obj1[key]).indexOf('.') !== -1 ) {
							obj1[key] = parseFloat(obj2[key]) || 0;
						}
						else {
							obj1[key] = parseInt(obj2[key]) || 0;
						};
					}
					else { // string
						obj1[key] = obj2[key];
					};
				};
			};
		}
	}
});

// Array Helper
Helper( "Array", {
	is_array: function( array ) {
		return ( Object.prototype.toString.call( array ) === '[object Array]' );
	},
	
	in_array: function( haystack, needle, strict ) {
		var key = '';
	 
		for (key in haystack) {
			if ( is_equal( haystack[key], needle, true, strict ) ) {
				return true;
			};
		};

		return false;
	},

	/**
	 * 배열의 index 값 찾기
	 * @function
	 */
	array_at_index: function( array, object ) {
		
		if ( ! is_array(array) ) {
			return -1;
		};
		
		var index = -1;
		
		for (var i = 0; i < array.length; i++) {
			if (i in array) {
				if ( array[i] === object ) {
					index = i;
					break;
				};
			};
		};
		
		return index;
	},

	/**
	 * 배열내 값 추가
	 * @function
	 */
	array_add: function( array, object ) {
		
		if ( ! is_array(array) ) {
			array = new Array();
		};
		
		if ( object != null ) {
			array.push.call( array, object );
		};
		
		return array;
	},

	/**
	 * 배열내 값 삭제
	 * @function
	 */
	array_remove: function( array, object ) {
		if ( object == null || array.length == 0 ) {
			return -1;
		}

		var index = -1;
		for ( var i=0; i<array.length; i++ ) {
			if ( is_equal( array[i], object, true ) ) {
				index = i;
				break;
			};
		};

		if ( index < 0 ) {
			return index;
		};
		
		var rest = array.slice( index+1 || array.length );
		array.length = index;
		array.push.apply( array, rest );
		
		return array;
	},

	/**
	 * 배열의 요소를 함수에 값으로 전달하는 함수
	 * @function
	 */
	array_each: function( array, handler, context ) {
		var length = array && typeof array["length"] != undefined ? array.length : 0;

		if (typeof handler != "function") {
			return ;
		};

		for (var i = 0; i < length; i++) {
			if (i in array) {
				if ( handler.call( context, i, array[i] ) === false ) {
					break;
				};
			};
		};
	}
});

// Number Helper
Helper( "Number", {
	parse_int: function( num ) {
		num = String(num).replace(/[,]/gi, '');
		
		var i = parseInt( num,10 );
		if ( isNaN( i ) ) {
			i = 0;
		};
		
		return i;
	},
	
	number_format: function( num ) {
		var input = String(num); 
		var reg = /(\-?\d+)(\d{3})($|\.\d+)/;
		
		if ( reg.test(input) ) {
			return input.replace(reg, function(str, p1,p2,p3) { 
					return number_format(p1) + "," + p2 + "" + p3; 
			    }
		    );
		};
		
		return input;
	}
});

// XML Helper
Helper( "XML", {
	toJSON: function(xml) {
		// Create the return object
		var obj = {};
	
		if (xml.nodeType == 1) { // element
			// do attributes
			if (xml.attributes.length > 0) {
				obj["@attributes"] = {};
				
				for (var j = 0; j < xml.attributes.length; j++) {
					var attribute = xml.attributes.item(j);
					obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
				};
			};
		}
		else if (xml.nodeType == 3) { // text
			obj = xml.nodeValue;
		};
	
		// do children
		if (xml.hasChildNodes()) {
			for(var i = 0; i < xml.childNodes.length; i++) {
				var item = xml.childNodes.item(i);
				var nodeName = item.nodeName;
				var nodeValue = Helper.XML.toJSON(item);
				
				if (obj[nodeName] == undefined) {
					
					if ( nodeName.indexOf("#") !== -1 && nodeName.substr(0, 1) == "#" ) {
						//debug.log( "nodeName", obj, nodeName, nodeValue );
						if ( nodeName == "#text" ) {
							if ( trim(nodeValue) != "" ) {
								obj = nodeValue;
							};
						};
					}
					else {
						obj[nodeName] = nodeValue;
					};
				} 
				else {
					if (typeof(obj[nodeName].push) == "undefined") {
						var old = obj[nodeName];
						obj[nodeName] = [];
						obj[nodeName].push(old);
					};
					
					obj[nodeName].push( nodeValue );
				};
			};
		};
		
		return obj;
	}
});

// String Helper
Helper( "String", {
	guid: function( format ) {
		format = ( format == undefined || typeof format !== "string" ) ? "xxxx-xxxx-xxxx-xxxx" : format;
		
		return format.replace( /[xy]/g, function(c) {
			var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
			return v.toString(16);
		});
	},
	
	trim: function( str ) {
		var trimReg = new RegExp( "^" + "[\\x20\\t\\r\\n\\f]" + "+|((?:^|[^\\\\])(?:\\\\.)*)" + "[\\x20\\t\\r\\n\\f]" + "+$", "g" );
	
		return str == null ?
				"" :
				( str + "" ).replace( trimReg, "" );
	},
	
	lcfirst: function( str ) {
		str += '';
		var f = str.charAt(0).toLowerCase();
		return f + str.substr(1);
	},

	ucfirst: function (str) {
		str += '';
		var f = str.charAt(0).toUpperCase();
		return f + str.substr(1);
	},

	/* 카멜-바 */
	camelize: function(_value) {
		return _value.toLowerCase().replace(/-(.)/g, function(_, c) {
			return c.toUpperCase();
		})
	},

	/* 바-카멜 */
	decamelize: function(_value) {
		return _value.replace(/([a-z])([A-Z])/g,'$1-$2').toLowerCase();
	},
	
	str_pad: function( positiveInteger, totalDigits ) {
		var padding = "00000000000000";
		var rounding = 1.000000000001;
		var currentDigits = positiveInteger > 0 ? 1 + Math.floor(rounding * (Math.log(positiveInteger) / Math.LN10)) : 1;
			return (padding + positiveInteger).substr(padding.length - (totalDigits - currentDigits));
	}
});

// Cookie Helper
Helper( "Cookie", {
	set_cookie: function( cookieName, value, expireTime ) {
	
		expireTime = expireTime || 60*60*24*30*3;
	
		var expireDate = new Date();
		expireDate.setTime( expireDate.getTime() + expireTime );
		
		var cookieValue = escape( value ) + (( expireTime == undefined ) ? "" : "; expires=" + expireDate.toUTCString());
		document.cookie = cookieName + "=" + cookieValue;
	},
	
	get_cookie: function( cookieName ) {
		var cookieValue = document.cookie;
		var start = cookieValue.indexOf(" " + cookieName + "=");
		
		if (start == -1) { 
			start = cookieValue.indexOf(cookieName + "=");
		}
		
		if (start == -1) { 
			cookieValue = null;	
		}
		else {
			start = cookieValue.indexOf("=", start) + 1;
			var end = cookieValue.indexOf(";", start);
			if (end == -1) {
				end = cookieValue.length;
			};
			
			cookieValue = unescape(cookieValue.substring(start, end));
		};
		
		return cookieValue;
	}
});

// LocalStorage Helper
Helper( "LocalStorage", {
	
});

UI.Helper = Helper;
	
})(window);