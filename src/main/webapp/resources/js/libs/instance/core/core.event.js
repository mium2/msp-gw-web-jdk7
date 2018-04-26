
(function( window, undefined) {

var 
/* ----- Event ----- */
Class = UI.Class,
Core = Class.Core,
IObject = Class.IObject,

Event = Class({
	name: "Event",
	parent: Core,
	constructor: function( touches, event ) {
		var touch = ( touches != undefined && touches[0] != undefined ) ? touches[0] : undefined;
		
		if ( touch != undefined && touch["pageX"] != undefined && touch["pageY"] != undefined ) {
			return {
				"offsetX":touch.pageX,
				"offsetY":touch.pageY
			};
		};
	
		var clientX = ( touches != undefined && touches["length"] > 0 ) ? touches[0].clientX : event.clientX;
		var clientY = ( touches != undefined && touches["length"] > 0 ) ? touches[0].clientY : event.clientY;
		var touches = [];
	
		var doc, docElem, body, win;
		var srcElement = event.target || event.srcElement;
	
		win = window;
		doc = srcElement && srcElement.ownerDocument;
		docElem = doc.documentElement;
		body = doc.body;
					
		var clientTop = docElem.clientTop || body.clientTop || 0;
		var clientLeft = docElem.clientLeft || body.clientLeft || 0;
		var scrollTop = win.pageYOffset || docElem.scrollTop;
		var scrollLeft = win.pageXOffset || docElem.scrollLeft;
	
		var phase = event.type;
	
		return {
			"phase": phase,
			"touches": touches,
			"clientX": clientX,
			"clientY": clientY,
			"offsetX": clientX + scrollLeft - clientLeft,
			"offsetY": clientY + scrollTop - clientTop
		};
	},
	'static': function() {
	
		var _manager;
	
		return {
			eventUID: 0,
			hasTouch: 'ontouchstart' in window,
			manager: function() {
				if ( ! _manager)  {
					_manager = new EventManager();
				};
				return _manager;
			}
		};
	}
}),

TouchEvent = {
	Start:		Event.hasTouch ? "touchstart" : "mousedown",
	Move:		Event.hasTouch ? "touchmove" : "mousemove",
	End:		Event.hasTouch ? "touchend" : "mouseup",
	Cancel:		"touchcancel",
},

EventHandler = function( instance, type ) {

	var _instance = instance;
	var _element = instance.element ? instance.element() : undefined;
	var _type = type;
	var _bindedHandlers = [];

	return {
		handler: function(e) {
			for ( var i in _bindedHandlers ) {
				var handler = _bindedHandlers[i];
				handler.apply( _element, e );
			};
		},
	
		addEventListener: function( handler, options ) {
				
			if ( typeof handler != "function" ) {
				return;
			};
			
			_bindedHandlers[_bindedHandlers.length] = handler;
			
			/*
			for ( var i in _element ) {
				var bubbles = options;
				var element = _element[i];
				
				if ( element && element["nodeType"] != undefined && element["nodeType"] === 1 || element === window ) {
					element.addEventListener( _type, this.handler, false );
				};
			};
			*/
		},
		
		removeEventListener: function( handler, options ) {
			array_remove( _bindedHandlers, handler );
			
			/*
			
//			for ( var i in _element ) {
				var bubbles = options;
				var element = _element;
				
				if ( element["nodeType"] != undefined && element["nodeType"] === 1 || element === window ) {
					element.addEventListener( _type, this.handler );
				};
//			};

			*/
		},
		
		dispatchEvent: function() {
			var args = arguments;
		
			array_each( _bindedHandlers, function( index, handler ) {
				handler.apply( _instance, args );
			});
		}
	}	
},

EventManager = function() {
	var _bindedInstances = {};
	
	return {
	
		bindedEvent: function( instance, types ) {
			var type = types;
			var eventUID = instance.eventUID();
			
			_bindedInstances[eventUID] = (_bindedInstances[eventUID]) ? _bindedInstances[eventUID] : {};
			_bindedInstances[eventUID][type] = ( _bindedInstances[eventUID][type] ) ? _bindedInstances[eventUID][type]: new EventHandler( instance, type );
			
			return _bindedInstances[eventUID][type];
		},
		
		add: function( instance, types, handler, options ) {
			var type = types;
			var eventUID = instance.eventUID();
			
			_bindedInstances[eventUID] = (_bindedInstances[eventUID]) ? _bindedInstances[eventUID] : {};
			_bindedInstances[eventUID][type] = ( _bindedInstances[eventUID][type] ) ? _bindedInstances[eventUID][type]: new EventHandler( instance, type );
			_bindedInstances[eventUID][type].addEventListener( handler, options );
		},
		
		remove: function( instance, types, handler ) {
			var type = types;
			var eventUID = instance.eventUID();
			
			_bindedInstances[eventUID] = (_bindedInstances[eventUID]) ? _bindedInstances[eventUID] : {};
			_bindedInstances[eventUID][type] = ( _bindedInstances[eventUID][type] ) ? _bindedInstances[eventUID][type]: new EventHandler( instance, type );
			_bindedInstances[eventUID][type].removeEventListener(handler);
		},
		
		trigger: function( instance, types ) {
			var type = types;
			var eventUID = instance.eventUID();
			
			if ( _bindedInstances[eventUID][type] != undefined ) {
				_bindedInstances[eventUID][type].trigger
			};
		}
	};
};

UI.TouchEvent = TouchEvent;
UI.Event = Event;	
	
})(window);