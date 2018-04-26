
(function(window, undefined) {
	
var
/* ----- Public Module ----- */

Class = UI.Class,
Element = Class.Element,
TouchEvent = UI.TouchEvent,

/**
 * EventDispatcher
 * @name EventDispatcher
 * @class
 */
EventDispatcher = Class({
	name: "EventDispatcher",
	parent: Element,
	constructor: function() {
	
		var _binded = false;
		var _pressed = false;
		
		return {
			_shouldAttemptToRecognize: function() {
				return this.enabled();
			},
			
			_recognizeEvents: function( e ) {
				var bubbling = true;
				var event = e;//new UIEvent( e );
				
				//sdebug.log( "event", event );
			
				if ( this._shouldAttemptToRecognize() ) {
					switch ( event.type ) {
						case TouchEvent.Start:
							_pressed = true;
							
							bubbling = this.eventStart( event );
							break;

						case TouchEvent.Move:
							if ( _pressed == true ) {
								bubbling = this.eventDrag( event );
							}
							else {
								bubbling = this.eventMove( event );
							};
							
							break;

						case TouchEvent.End:
							_pressed = false;
							
							bubbling = this.eventEnd( event );
							break;

						/*
						case TouchEvent.Enter:
							_pressed = false;
							
							bubbling = this.eventEnter( event );
							break;

						case TouchEvent.Leave:
							_pressed = false;
							
							bubbling = this.eventLeave( event );
							break;
						*/
						
						case TouchEvent.Cancel:
							_pressed = false;
							
							bubbling = this.eventCancel( event );
							break;

						default:
							_pressed = false;
							
							break;
					};
				};
				
				return bubbling;
			},
			
			_bindEvents: function() {
				if ( _binded == true ) {
					return;	
				};
				
				_binded = true;
				
				var instance = this._instance();
				
				if ( this.hasElement() ) { 
					this.bind( TouchEvent.Start, function(e) {
						return instance._recognizeEvents( e );
					});
					
					this.bind( TouchEvent.Move, function(e) {
						return instance._recognizeEvents( e );
					});
					
					this.bind( TouchEvent.End, function(e) {
						return instance._recognizeEvents( e );
					});
					
					if ( ! Event.hasTouch ) {
						// this.bind( TouchEvent.Enter, function(e) {
						//	return instance._recognizeEvents( e );
						// });
					
						// this.bind( TouchEvent.Leave, function(e) {
						// 	return instance._recognizeEvents( e );
						// });
					}
					else {
						this.bind( TouchEvent.Cancel, function(e) {
							return instance._recognizeEvents( e );
						});
					};
				};
			},
			
			init: function() {
				var self = this._super().init();
				if (self) {
					
					this._bindEvents();
				};
				return this;
			},
			
			destory: function() {

				if ( _binded == true ) {
					this.unbind( TouchEvent.Start );
					this.unbind( TouchEvent.Move );
					this.unbind( TouchEvent.End );
					this.unbind( TouchEvent.Cancel );
					
					/*
					this.unbind( TouchEvent.Enter );
					this.unbind( TouchEvent.Leave );
					*/
					
					_binded = false;
				};

				this._super().destory();
			},

			eventMove: function( event ) {
				return true;
			},
			
			eventStart: function( event ) {
				return true;
			},

			eventDrag: function( event ) {
				return true;
			},

			eventEnd: function( event ) {
				return true;
			},

			eventEnter: function( event ) {
				return true;
			},

			eventLeave: function( event ) {
				return true;
			},

			eventCancel: function( event ) {
				return true;
			}
		};
	}
}),

/**
 * UIView
 * @name UIView
 * @class
 */
UIView = Class({
	name: "UIView",
	parent: EventDispatcher,
	constructor: function() {
		
		var _subviews = [];
		
		return {
			parent: undefined,
			
			addSubview: function( view ) {
				
				_subviews.push( view );
				
				this.element().appendChild( view.element() );
				
				view.parent = this;
				
				this.needsDisplay();
			},
			
			superview: function() {
				return this.parent;
			},
			
			removeFromSuperview: function() {
				var superview = this.superview();
				
				this.remove();
				
				superview.needsDisplay();
			},
			
			needsDisplay: function() {
				
			}
		};
	}
});
	
})(window);