

(function(window, undefined) {


var
/* ----- Regular Expression ----- */

RegularExpression = {
	quickExpress: /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,
	singleTag: /^<(\w+)\s*\/?>(?:<\/\1>|)$/,
};

/* ----- UIFactory ----- */

UIFactory = function( selector, context ) {
	return new UIFactory.fn.init( selector, context );
};

UIFactory.fn = UIFactory.prototype = {

	init: function( selector, context ) {
		var match, elem;

		if ( !selector ) {
			return this;
		};

		if ( typeof selector === "string" ) {
			if ( selector.charAt(0) === "<" && selector.charAt( selector.length - 1 ) === ">" && selector.length >= 3 ) {
				match = [ null, selector, null ];

			} else {
				match = RegularExpression.quickExpress.exec( selector );
			}
			
			if ( match && (match[1] || !context) ) {
			
				// HANDLE: (Array)
				if ( match[1] ) {
					context = context instanceof UIFactory ? context[0] : context;
			
					UIFactory.merge( this, UIFactory.parseHTML(
						match[1],
						context && context.nodeType ? context.ownerDocument || context : document,
						true
					) );

					if ( RegularExpression.singleTag.test( match[1] ) && Helper.Object.is_plain_object( context ) ) {
						for ( match in context ) {
							// Properties of context are called as methods if possible
							if ( typeof this[ match ] == "function" ) {
								this[ match ]( context[ match ] );

							// ...and otherwise set as attributes
							} else {
								this.attr( match, context[ match ] );
							}
						}
					}

					return this;

				// HANDLE: (#id)
				} else {
					elem = document.getElementById( match[2] );
					
					return elem;
				}

			// HANDLE: (expr, $(...))
			} else if ( !context || context.jquery ) {
				return ( context ).find( selector );

			// HANDLE: (expr, context)
			// (which is just equivalent to: $(context).find(expr)
			} else {
				return this.constructor( context ).find( selector );
			}

		// HANDLE: (DOMElement)
		} else if ( selector.nodeType ) {
			this.context = this[0] = selector;
			this.length = 1;
			
			return this;

		// HANDLE: (function)
		// Shortcut for document ready
		} else if ( typeof selector == "function" ) {
			// 이건 추후에 따로, root .ready( selector )
			return this;
		};

		if ( selector.selector !== undefined ) {
			this.selector = selector.selector;
			this.context = selector.context;
		};

		return UIFactory.makeArray( selector, this );
	},
	
	constructor: UIFactory,
	
	selector: "",
	
	length: 0,
	
	each: function( callback, args ) {
		return UIFactory.each( this, callback, args );
	}
};

UIFactory.extend = UIFactory.fn.extend = function() {
	var options, name, src, copy, copyIsArray, clone,
		target = arguments[0] || {},
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if ( typeof target === "boolean" ) {
		deep = target;
		target = arguments[1] || {};
		// skip the boolean and the target
		i = 2;
	}

	// Handle case when target is a string or something (possible in deep copy)
	if ( typeof target !== "object" && !UIFactory.isFunction(target) ) {
		target = {};
	}

	// extend UIFactory itself if only one argument is passed
	if ( length === i ) {
		target = this;
		--i;
	}

	for ( ; i < length; i++ ) {
		// Only deal with non-null/undefined values
		if ( (options = arguments[ i ]) != null ) {
			// Extend the base object
			for ( name in options ) {
				src = target[ name ];
				copy = options[ name ];

				// Prevent never-ending loop
				if ( target === copy ) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if ( deep && copy && ( UIFactory.isPlainObject(copy) || (copyIsArray = UIFactory.isArray(copy)) ) ) {
					if ( copyIsArray ) {
						copyIsArray = false;
						clone = src && UIFactory.isArray(src) ? src : [];

					} else {
						clone = src && UIFactory.isPlainObject(src) ? src : {};
					}

					// Never move original objects, clone them
					target[ name ] = UIFactory.extend( deep, clone, copy );

				// Don't bring in undefined values
				} else if ( copy !== undefined ) {
					target[ name ] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};

UIFactory.extend({

	// data: string of html
	parseHTML: function( data, context, keepScripts ) {
		if ( !data || typeof data !== "string" ) {
			return null;
		};
		
		if ( typeof context === "boolean" ) {
			keepScripts = context;
			context = false;
		};
		
		context = context || document;
	
		var parsed = RegularExpression.singleTag.exec( data ), 
			scripts = !keepScripts && [];
	
		// Single tag
		if ( parsed ) {
			return [ context.createElement( parsed[1] ) ];
		};
	
		parsed = this.buildFragment( [ data ], context, scripts );
	
		if ( scripts ) {
			UIFactory( scripts ).remove();
		}
	
		return UIFactory.merge( [], parsed.childNodes );
	},
	
	buildFragment: function( elems, context, scripts, selection ) {
		var elem, tmp, tag, wrap, contains, j,
			i = 0,
			l = elems.length,
			fragment = context.createDocumentFragment(),
			nodes = [];
	
		for ( ; i < l; i++ ) {
			elem = elems[ i ];
	
			if ( elem || elem === 0 ) {
	
				// Add nodes directly
				if ( UIFactory.type( elem ) === "object" ) {
					UIFactory.merge( nodes, elem.nodeType ? [ elem ] : elem );
	
				// Convert non-html into a text node
				} else if ( !rhtml.test( elem ) ) {
					nodes.push( context.createTextNode( elem ) );
	
				// Convert html into DOM nodes
				} else {
					tmp = tmp || fragment.appendChild( context.createElement("div") );
	
					// Deserialize a standard representation
					tag = ( rtagName.exec( elem ) || ["", ""] )[ 1 ].toLowerCase();
					wrap = wrapMap[ tag ] || wrapMap._default;
					tmp.innerHTML = wrap[ 1 ] + elem.replace( rxhtmlTag, "<$1></$2>" ) + wrap[ 2 ];
	
					// Descend through wrappers to the right content
					j = wrap[ 0 ];
					while ( j-- ) {
						tmp = tmp.lastChild;
					}
	
					// Support: QtWebKit
					UIFactory.merge( nodes, tmp.childNodes );
	
					// Remember the top-level container
					tmp = fragment.firstChild;
	
					// Fixes #12346
					// Support: Webkit, IE
					tmp.textContent = "";
				}
			}
		}
	
		// Remove wrapper from fragment
		fragment.textContent = "";
	
		i = 0;
		while ( (elem = nodes[ i++ ]) ) {
	
			// #4087 - If origin and destination elements are the same, and this is
			// that element, do not do anything
			if ( selection && UIFactory.inArray( elem, selection ) !== -1 ) {
				continue;
			}
	
			contains = UIFactory.contains( elem.ownerDocument, elem );
	
			// Append to fragment
			tmp = getAll( fragment.appendChild( elem ), "script" );
	
			// Preserve script evaluation history
			if ( contains ) {
				setGlobalEval( tmp );
			}
	
			// Capture executables
			if ( scripts ) {
				j = 0;
				while ( (elem = tmp[ j++ ]) ) {
					if ( rscriptType.test( elem.type || "" ) ) {
						scripts.push( elem );
					}
				}
			}
		}
	
		return fragment;
	},

	isFunction: function( obj ) {
		return UIFactory.type(obj) === "function";
	},

	isArray: Array.isArray,

	isWindow: function( obj ) {
		return obj != null && obj === obj.window;
	},

	isNumeric: function( obj ) {
		return !isNaN( parseFloat(obj) ) && isFinite( obj );
	},

	type: function( obj ) {
		if ( obj == null ) {
			return String( obj );
		}
		
		var class2type = {
			"[object Boolean]":		"boolean",
			"[object Number]":		"number",
			"[object String]":		"string",
			"[object Function]":	"function",
			"[object Array]":		"array",
			"[object Date]":		"date",
			"[object RegExp]":		"regexp",
			"[object Object]":		"object",
			"[object Error]":		"error"
		};
		
		// Support: Safari <= 5.1 (functionish RegExp)
		return typeof obj === "object" || typeof obj === "function" ?
			class2type[class2type.toString.call(obj)] || "object" :
			typeof obj;
	},

	isPlainObject: function( obj ) {
		// Not plain objects:
		// - Any object or value whose internal [[Class]] property is not "[object Object]"
		// - DOM nodes
		// - window
		if ( UIFactory.type( obj ) !== "object" || obj.nodeType || UIFactory.isWindow( obj ) ) {
			return false;
		}

		// Support: Firefox <20
		// The try/catch suppresses exceptions thrown when attempting to access
		// the "constructor" property of certain host objects, ie. |window.location|
		// https://bugzilla.mozilla.org/show_bug.cgi?id=814622
		try {
			if ( obj.constructor &&
					!core_hasOwn.call( obj.constructor.prototype, "isPrototypeOf" ) ) {
				return false;
			}
		} catch ( e ) {
			return false;
		}

		// If the function hasn't returned already, we're confident that
		// |obj| is a plain object, created by {} or constructed with new Object
		return true;
	},

	isEmptyObject: function( obj ) {
		var name;
		for ( name in obj ) {
			return false;
		}
		return true;
	},

	each: function( obj, callback, args ) {
		var value,
			i = 0,
			length = obj.length,
			isArray = UIFactory.isArraylike( obj );
	
		if ( args ) {
			if ( isArray ) {
				for ( ; i < length; i++ ) {
					value = callback.apply( obj[ i ], args );
	
					if ( value === false ) {
						break;
					}
				}
			} else {
				for ( i in obj ) {
					value = callback.apply( obj[ i ], args );
	
					if ( value === false ) {
						break;
					}
				}
			}
	
		// A special, fast, case for the most common use of each
		} else {
			if ( isArray ) {
				for ( ; i < length; i++ ) {
					value = callback.call( obj[ i ], i, obj[ i ] );
	
					if ( value === false ) {
						break;
					}
				}
			} else {
				for ( i in obj ) {
					value = callback.call( obj[ i ], i, obj[ i ] );
	
					if ( value === false ) {
						break;
					}
				}
			}
		}
	
		return obj;
	},

	isArraylike: function( obj ) {
		var length = obj.length,
			type = UIFactory.type( obj );
			
	
		if ( obj === window ) {
			return false;
		}
	
		if ( obj.nodeType === 1 && length ) {
			return true;
		}
	
		return type === "array" || type !== "function" &&
			( length === 0 ||
			typeof length === "number" && length > 0 && ( length - 1 ) in obj );
	},

	makeArray: function( arr, results ) {
		var ret = results || [];
		
		if ( arr != null ) {
		
			if ( UIFactory.isArraylike( Object(arr) ) ) {

				UIFactory.merge( ret,
					typeof arr === "string" ?
					[ arr ] : arr
				);
			}
		}
		
		return ret;
	},

	merge: function( first, second ) {
		var l = second.length,
			i = first.length,
			j = 0;
	
		if ( typeof l === "number" ) {
			for ( ; j < l; j++ ) {
				first[ i++ ] = second[ j ];
			}
		} else {
			while ( second[j] !== undefined ) {
				first[ i++ ] = second[ j++ ];
			}
		}
	
		first.length = i;
	
		return first;
	}
});

UI.objectFromQueryString = function() {
	if ( !window.location.search ) {
		return {};
	};

	var queryString = window.location.search.replace( "?", "" );
	
	var fields = queryString.split("&"),
		params = {},
		temp;
	
	for ( var i=0; i<fields.length; i++ ) {
		temp = fields[i].split("=");
		params[decodeURIComponent(temp[0])] = decodeURIComponent(temp[1]);
	};
	
	return params;
};

})(window);
