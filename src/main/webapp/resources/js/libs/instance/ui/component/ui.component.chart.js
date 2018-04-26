
(function(window, undefined) {

var 
Class = UI.Class,
UIComponent = UI.Class.UIComponent,

UIChart = Class({
	name: "UIChart",
	parent: UIComponent,
	constructor: function(  ) {
		
		return {
			init: function() {
				return this
			}
		}
	}
});

window.UIChart = UIChart;

})(window);