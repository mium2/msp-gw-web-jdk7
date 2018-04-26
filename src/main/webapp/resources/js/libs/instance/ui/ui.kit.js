/*!
 * Instance UIKit
 *
 * Date: 2014-01-10
 */
 
(function(window, undefined) {


var 

thisFileName = "ui.kit.js",

Class = UI.Class,
Element = UI.Class.Element,
ScriptLoader = UI.ScriptLoader,

UICore = Class({
	name: "UICore",
	parent: Element,
	constructor: function( element ) {
		
		return {
			init: function() {
				var self = this._super().init();
				if ( self ) {
					
				};
				return this
			}
		}
	}
});

ScriptLoader.writeScript([
	"kit/ui.kit.graph.js",
	"kit/ui.kit.scroll.js",
	"kit/ui.kit.control.js",
	"kit/ui.kit.input.js",
	"kit/ui.kit.indicator.js",
	"kit/ui.kit.interaction.js",
	"kit/ui.kit.layer.js"
], ScriptLoader.scriptPath(thisFileName) );

})(window);