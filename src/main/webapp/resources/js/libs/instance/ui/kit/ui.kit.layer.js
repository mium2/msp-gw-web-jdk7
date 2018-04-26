(function(window, undefined) {

var
Class = UI.Class,
UICore = Class.UICore,

UILayer = Class({
	name: "UISlider",
	parent: UICore,
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
}),

UIModal = Class({
	name: "UIModal",
	parent: UILayer,
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

window.UILayer = UILayer;
window.UIModal = UIModal;

})(window);