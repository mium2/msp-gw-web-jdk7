
(function(window, undefined) {

var 
Class = UI.Class,
UIComponent = UI.Class.UIComponent,

UIGrid = Class({
	name: "UIGrid",
	parent: UIComponent,
	constructor: function(  ) {
		
		return {
			init: function() {
				return this
			}
		}
	}
});

window.UIGrid = UIGrid;

})(window);