/*!
 * Instance UI Frameworks
 *
 * Date: 2014-01-10
 */
 
(function(window, undefined) {

var 

version = "1.0.1",

thisFileName = "instance.ui.js",

/* ----- UI ----- */

UI = {
	Constants: {
		NULL_FUNCTION: function() {},
		NULL_ELEMENT_FUNCTION: function() {
			return document.createElement("DIV");
		}	
	}
},

ScriptLoader = function() {
	var _head = document.getElementsByTagName("head")[0];
	var _baseElement = document.getElementsByTagName("base")[0];
	if ( _baseElement ) {
		_head = baseElement.parentNode;
	};

	return {
		scriptPath: function( fileName ) {
			var elements = document.getElementsByTagName('script'),
				protocal = document.location.protocol,
				scriptPath = "",
				components;
			
			for (var i = 0; i < elements.length; i++) { 
				if (elements[i].src && elements[i].src.indexOf(fileName) != -1) { 
					scriptPath = elements[i].src.substring(0, elements[i].src.lastIndexOf('/') + 1); 
					break;
				};
			};
			
			scriptPath = scriptPath.replace(document.location.protocol + "//", '');
			components = scriptPath.split("/");
			
			if ( components.length > 0 && components[components.length-1] == "" ) {
				components.pop();
			};
			
			return protocal + "//" + components.join("/");
		},
	
		loadScript: function( url, rootPath  ) {
			if ( arguments[0] != undefined && arguments[0].constructor === Array ) {
				var files = arguments[0];
				for ( var i in files ) {
					var file = files[i];
					this.loadScript( rootPath + "/" + file );
				};
				
				return files;
			};
		
		
			var script = document.createElement("script");
			script.src = url;
			script.type = "text/javascript";
			script.charset = "utf-8";
			
			if ( _baseElement ) {
				_head.insertBefore(script, _baseElement );
			}
			else {
				_head.appendChild(script);
			};
		},
		
		writeScript: function( url, rootPath, callback ) {
			if ( arguments[0] != undefined && arguments[0].constructor === Array ) {
				var files = arguments[0];
				for ( var i in files ) {
					var file = files[i];
					this.writeScript( rootPath + "/" + file );
				};
				
				if ( callback ) {
					callback();
				};
				
				return files;
			};
		
			document.write( '<script type="text/javascript" src="' + url + '"></script>' );
		}
	};
	
}();

window.UI = UI;

// include 
UI.ScriptLoader = ScriptLoader;
UI.ScriptLoader.writeScript([
	"core/core.debug.js",
	//"core/core.factory.js",
	"core/core.helper.js",
	"core/core.class.js",
	"core/core.data.js",
	"core/core.dimention.js",
	"core/core.tween.js",
	"core/core.event.js",
	"core/core.element.js",
	"core/core.view.js",
	"core/core.controller.js",
	"core/core.gesture.js",
	"core/core.notification.js",
	"ui/ui.kit.js",
	"ui/ui.component.js"
], ScriptLoader.scriptPath(thisFileName) );

// jQuery Instance Plugin
if ( $ !== undefined ) {
	$.fn.instance = function( constructor/*, …arguments*/ ) {
		var args = Array.prototype.slice.call( arguments, 0 );  args.unshift( this );
		var manager = UI.manager;
		
		return manager.get.apply( manager, args );
	};
	
	$.instance = UI.manager;
	
	// UIFactory 를 최신 jQuery 소스로 변경
	UIFactory = $;
	
	//debug.log( "jQuery - ver " + $().jquery );
};

//debug.log( "Instance UI - ver " + version );



})(window);