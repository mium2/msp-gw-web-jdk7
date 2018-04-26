
(function(window, undefined) {

var 
Class = UI.Class,
UIComponent = UI.Class.UIComponent,

UICodeView = Class({
	name: "UICodeView",
	parent: UIComponent,
	constructor: function(  ) {
		
		return {
			init: function() {
				return this
			}
		}
	}
});

window.UICodeView = UICodeView;

})(window);