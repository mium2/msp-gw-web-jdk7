
(function(window, undefined) {

var 
Class = UI.Class,
UIComponent = UI.Class.UIComponent,

UIDashBoard = Class({
	name: "UIDashBoard",
	parent: UIComponent,
	constructor: function(  ) {
		
		return {
			init: function() {
				return this
			}
		}
	}
});

window.UIDashBoard = UIDashBoard;

})(window);