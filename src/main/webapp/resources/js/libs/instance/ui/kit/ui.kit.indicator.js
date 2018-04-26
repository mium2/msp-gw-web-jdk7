
(function(window, undefined) {

var
Class = UI.Class,
UICore = Class.UICore,

UIIndicator = Class({
	name: "UIIndicator",
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

UIPageIndicator = Class({
	name: "UIPageIndicator",
	parent: UIIndicator,
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

UIProgressBar = Class({
	name: "UIProgressBar",
	parent: UIIndicator,
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

UIMultiProgressBar = Class({
	name: "UIMultiProgressBar",
	parent: UIProgressBar,
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

window.UIPageIndicator = UIPageIndicator;
window.UIProgressBar = UIProgressBar;
window.UIMultiProgressBar = UIMultiProgressBar;


})(window);