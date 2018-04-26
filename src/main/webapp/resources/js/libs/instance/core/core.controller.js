(function(window, undefined) {
	
var 

Class = UI.Class,
Responder = Class.Responder,
	
/**
 * UIController
 * @name UIController
 * @class
 */
UIController = Class({
	name: "UIController",
	parent: Responder,
	constructor: function() {
		
		var _instance;
		
		return {
			__construct: function( ) {
				_instance = this;
				
				this.init();
			},

			__destruct: function() {
				_instance = undefined;
			},
			
			init: function() {
				return this;
			}
		};
	}
}),


/**
 * UIMacroController
 * @name UIMacroController
 * @class
 */
UIMacroController = Class({
	name: "UIMacroController",
	parent: UIController,
	constructor: function() {
		
		
		return {
			init: function() {
				var self = this._super().init();
				if (self) {
					
				};
				return this;
			}
		};
	}
});

window.UIController = UIController;
window.UIMacroController = UIMacroController;

})(window);