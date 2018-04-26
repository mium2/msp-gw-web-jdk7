/*!
 * Instance UIComponent
 *
 * Date: 2014-01-10
 */
 
(function(window, undefined) {


var 
thisFileName = "ui.kit.js",
Class = UI.Class,
UIConroller = Class.UIConroller,
ScriptLoader = UI.ScriptLoader,

UIComponent = Class({
	name: "UIComponent",
	parent: UIConroller,
	constructor: function(  ) {
		
		return {
			init: function() {
				return this
			}
		}
	}
});

UI.Component = [];

ScriptLoader.writeScript([
	"component/ui.component.grid.js",
	"component/ui.component.codeview.js",
	"component/ui.component.dashboard.js",
	"component/ui.component.chart.js",
	"component/ui.component.tree.js"
], ScriptLoader.scriptPath(thisFileName) );

for ( var componentName in UI.Component ) {
	window[componentName] = Class[componentName];
	
	console.log( "window[componentName]", window[componentName] );
};

})(window);