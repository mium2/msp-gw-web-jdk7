


(function(window, undefined) {
	
var 

Class = UI.Class,
UICore = Class.Core,

UIInput = Class({
	name: "UIInput",
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

UITextArea = Class({
	name: "UITextArea",
	parent: UIInput,
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

UISpin = Class({
	name: "UISpin",
	parent: UIInput,
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

window.UIInput = UIInput;
window.UITextArea = UITextArea;
window.UISpin = UISpin;

})(window);