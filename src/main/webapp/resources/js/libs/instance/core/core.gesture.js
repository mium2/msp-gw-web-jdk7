
(function(window, undefined) {
	
var
/* ----- UI Gesture ----- */

Class = UI.Class,
Helper = UI.Helper,
IObject = Class.IObject,

UIGestureRecognizerState = {
	Possible:			10,
	Began:				21,
	Changed:			22,
	Ended:				23,
	Recognized:			23, // GestureRecognizerState.Ended
	Cancelled:			41,
	Failed:				44
},

AllowedTransitions = [
	// discrete gestures
	[UIGestureRecognizerState.Possible,		UIGestureRecognizerState.Recognized,	 	true,		true],
	[UIGestureRecognizerState.Possible,		UIGestureRecognizerState.Failed,			false,		true],

	// continuous gestures
	[UIGestureRecognizerState.Possible,		UIGestureRecognizerState.Began,				true,		false],
	[UIGestureRecognizerState.Began,		UIGestureRecognizerState.Changed,			true,		false],
	[UIGestureRecognizerState.Began,		UIGestureRecognizerState.Cancelled,			true,		true],
	[UIGestureRecognizerState.Began,		UIGestureRecognizerState.Ended,				true,		true],
	[UIGestureRecognizerState.Changed,		UIGestureRecognizerState.Changed,			true,		false],
	[UIGestureRecognizerState.Changed,		UIGestureRecognizerState.Cancelled,			true,		true],
	[UIGestureRecognizerState.Changed,		UIGestureRecognizerState.Ended,				true,		true]
],

StateTransition = function( index ) {
	var transition = AllowedTransitions[index];

	return {
		fromState: transition[0],
		toState: transition[1],
		shouldNotify: transition[2],
		shouldReset: transition[3] 
	};
},

UIAction = function( target, action ) {
	this.target = target;
	this.action = action;
},

UIGestureRecognizer = Class({
	name: "UIGestureRecognizer",
	parent: IObject,
	constructor: function() {
		
		var _delegate = null;
		var _delegateCan = {
			shouldBegin: false,
			shouldReceiveTouch: false,
			shouldRecognizeSimultaneouslyWithGestureRecognizer: false 
		};

		var _state = UIGestureRecognizerState.Possible;

		var _registeredActions  = [];
		var _allowedTransitions = [];

		for ( var t in AllowedTransitions ) {
			_allowedTransitions[t] = new StateTransition( t );
		};
		
		var _pressed = false;

		var _gestureObject = null;

		return {
			cancelsTouchesInView : true,
			delaysTouchesBegan  : false,
			delaysTouchesEnded  : true,
			
			_recognizeTouches: function( touches, event ) {
				//debug.error( this, "_recognizeTouches", UIControlEventString(event), touches, event );

				var bool = true;

				if ( this._shouldAttemptToRecognize() ) {
					_trackingTouches = touches;

					switch ( event.type ) {
						case TouchEvent.Start:
							_pressed = true;
							bool = this._gesturesBegan( touches, event );
							break;

						case TouchEvent.Move:
							
							// MouseEvent Bug
							if ( ! Event.hasTouch ) {
								if ( _pressed == false ) {
									return false;
								};
							};

							bool = this._gesturesMoved( touches, event );
							break;

						case TouchEvent.End:
							_pressed = false;
							bool = this._gesturesEnded( touches, event );
							break;

						case TouchEvent.Cancel:
							_pressed = false;
							bool = this._discreteGestures( touches, event );
							break;

						default:
							_pressed = false;
							break;
					};
				};

				return bool;
			},

			_gestureObject: function( instance ) {
				if ( arguments.length == 0 ) { 
					return _gestureObject
				};
				
				var self = this;

				_gestureObject = instance;
				
				_gestureObject.bind( TouchEvent.Start, function(e) {
					return self._recognizeTouches( e.touches, e );
				});
				
				_gestureObject.bind( TouchEvent.Move, function(e) {
					return self._recognizeTouches( e.touches, e );
				});
				
				_gestureObject.bind( TouchEvent.End, function(e) {
					return self._recognizeTouches( e.touches, e );
				});
				
				_gestureObject.bind( TouchEvent.Cancel, function(e) {
					return self._recognizeTouches( e.touches, e );
				});
			},

			_init: function() {
				
				_state = UIGestureRecognizerState.Possible;
				
				this.cancelsTouchesInView = true;
				this.delaysTouchesBegan = false;
				this.delaysTouchesEnded = true;
				
				_registeredActions = [];
				_trackingTouches = [];
				
				this.init();
			},
			
			init: function() {
					
			},

			destory: function() {
			
				if ( _gestureObject ) {
					_gestureObject.unbind( TouchEvent.Start );
					_gestureObject.unbind( TouchEvent.Move );
					_gestureObject.unbind( TouchEvent.End );
					_gestureObject.unbind( TouchEvent.Cancel );
				};

				this._super().destory();
			},

			delegate: function( delegate ) {
				if ( arguments.length == 0 ) {
					return _delegate;
				};

				_delegate = delegate;
				_delegateCan.shouldBegin = ( typeof _delegate["shouldBegin"] == "function" );
				_delegateCan.shouldReceiveTouch = ( typeof _delegate["shouldReceiveTouch"] == "function" );
				_delegateCan.shouldRecognizeSimultaneouslyWithGestureRecognizer = ( typeof _delegate["shouldRecognizeSimultaneouslyWithGestureRecognizer"] == "function" );
			},

			addTarget: function( target, action ) {
				var actionRecord = new UIAction();
				actionRecord.target = target;
				actionRecord.action = action || target["_recognizeTouches"] || function() {};

				Helper.Array.array_add( _registeredActions, actionRecord );
			},

			removeTarget: function( target, action ) {
				var actionRecord = new UIAction();
				actionRecord.target = target;
				actionRecord.action = action || target["_recognizeTouches"] || function() {};

				Helper.Array.array_remove( _registeredActions, actionRecord );
			},

			numberOfTouches: function() {
				return _trackingTouches.length;
			},

			state: function( state, silence ) {
				if ( arguments.length == 0 ) {
					return _state;
				};

				var transition = null;

				for ( var i=0; i<_allowedTransitions.length; i++ ) {
					if ( _allowedTransitions[i].fromState == _state && _allowedTransitions[i].toState == state ) {
						transition = _allowedTransitions[i];
						break;
					};
				};

				if ( transition ) {
					_state = transition.toState;
					
					if ( !silence && transition.shouldNotify ) {
						for ( var a in _registeredActions) {
							var actionRecord = _registeredActions[a];
		
							if ( typeof actionRecord.action == "function" ) {
								actionRecord.action.call( actionRecord.target, this );
							};
						};	
					};
					
					if ( transition.shouldReset ) {
						this.reset();
					};
				};
			},

			isContainedView: function( event ) {
				
				var $element = $(event.srcElement);
				var $view = $( _gestureObject.element() );
				var $parent = $view;

				var isContained = false;

				if ( $parent[0] == $element[0] ) {
					return true;
				};

				var i = 0;

				while ( $parent.length > 0 && i < 20 ) {
					if ( $parent[0] === $element[0] ) {
						isContained = true;
						break;
					};

					$parent = $parent.parent();
					i = i + 1;
				};


				if ( isContained == false ) {
					$element = $( _gestureObject.element() );
					$view = $(event.srcElement);
					$parent = $view;

					i = 0;

					while ( $parent.length > 0 && i < 20 ) {
						if ( $parent[0] === $element[0] ) {
							isContained = true;
							break;
						};

						$parent = $parent.parent();
						i = i + 1;
					};
				};

				return isContained;
			},

			reset: function() {
				_state = UIGestureRecognizerState.Possible;
				_trackingTouches = [];
			},

			canPreventGestureRecognizer: function( preventedGestureRecognizer ) {
				return true;
			},

			canBePreventedByGestureRecognizer: function( preventedGestureRecognizer ) {
				return true;
			},

			ignoreTouch: function( touch, event ) {

			},

			_shouldAttemptToRecognize: function() {
				return ( _gestureObject && _gestureObject.enabled() &&
						_state != UIGestureRecognizerState.Failed &&
						_state != UIGestureRecognizerState.Cancelled && 
						_state != UIGestureRecognizerState.Ended );
			},

			_gesturesBegan: function( touches, event ) {
				return true;
			},

			_gesturesMoved: function( touches, event ) {
				return true;
			},

			_gesturesEnded: function( touches, event ) {
				return true;
			},

			_discreteGestures: function( touches, event ) {
				return true;
			}
		};
	},
	'static': {
		State: UIGestureRecognizerState
	}
}),

UITapGestureRecognizer = Class({
	name: "UITapGestureRecognizer",
	parent: UIGestureRecognizer,
	constructor: function( view, enableInteraction ) {
	
		var _tapCount = 0;
		var _timestamp = new Date();
	
		return {
			
			init: function() {
				
			},
			
			_gesturesBegan: function( touches, event ) {
				
				
				
				return true;
			},

			_gesturesMoved: function( touches, event ) {
				_tapCount = 0;
				
				return true;
			},

			_gesturesEnded: function( touches, event ) {
				
				var timestamp = new Date();
				var difftime = (timestamp.getTime()*0.001) - (_timestamp.getTime()*0.001);
				
				_timestamp = timestamp;
				
				if ( difftime > 0.3 ) {
					_tapCount = 0;
				};
				
				_tapCount = _tapCount + 1;
				
				if ( _tapCount >= 2 ) {
					_tapCount = 0;
					
					return false;
				};
				
				return true;
			},

			_discreteGestures: function( touches, event ) {
				_tapCount = 0;
				
				return true;
			}
		};
	}
}),

UIPanInteraction = {
	Unknown:	1,
	Portrat:	2,
	Landscape: 	3,
	All:		4
},

UIPanGestureRecognizer = Class({
	name: "UIPanGestureRecognizer",
	parent: UIGestureRecognizer,
	constructor: function( view, enableInteraction, angle ) {

		var _minimumNumberOfTouches  = 1;
		var _maximumNumberOfTouches = 10;
		var _translation = { x:0, y: 0 };
		
		var _currentPoint = { x:0, y: 0 };
		var _currentTouch = null;

		var _enableInteraction = ( enableInteraction == undefined ) ? UIPanInteraction.Landscape : enableInteraction;
		var _panningInteraction = UIPanInteraction.Unknown;
		var _checkInteraction = false;
		
		var _slideAngle = ( angle == undefined ) ? 60 : parse_int(angle);

		return {
			
			_gesturesBegan: function( touches, event ) {
				var touch = new Event( touches, event );

				_currentTouch = touch;
				_currentPoint = { x: touch.offsetX, y: touch.offsetY };
				_panningInteraction = UIPanInteraction.Unknown;
				_checkInteraction = false;

				if ( ! Event.hasTouch ) {
					return false;
				};

				return true;
			},

			_gesturesMoved: function( touches, event ) {
				var touch = new Event( touches, event );
				var state = this.state();

				var point = { x: touch.offsetX, y: touch.offsetY };
				var delta = { x: point.x - _currentPoint.x, y:point.y - _currentPoint.y };

				_currentPoint = point;
				_currentTouch = touch;

				if ( _checkInteraction == false ) {
					var M_PI = 3.1415926535898;
					var ratio = Math.atan2( delta.y, delta.x );
					var angle = ( ratio == 0 ) ? 0 : ( ratio *180 / M_PI );

					_panningInteraction = ( Math.abs( angle ) > _slideAngle && Math.abs( angle ) < ( 180 - _slideAngle ) ) ? UIPanInteraction.Portrat : UIPanInteraction.Landscape;
					_checkInteraction = true;
				};

				if (  _enableInteraction == UIPanInteraction.Unknown || _enableInteraction == _panningInteraction ) {
					var isContains = this.isContainedView( event );

					if ( state == UIGestureRecognizerState.Possible && touch && isContains ) {
						this.translation( delta );
						
						_lastMovementTime = event.timeStamp;

						this.state( UIGestureRecognizerState.Began );

					}
					else if ( state == UIGestureRecognizerState.Began || state == UIGestureRecognizerState.Changed ) {
						if ( touch ) {
							if ( this._translate( delta, event ) ) {
								this.state( UIGestureRecognizerState.Changed );
							};
						} else {
							this.state( UIGestureRecognizerState.Cancelled );
						};
					}
					else {
						this.state( UIGestureRecognizerState.Cancelled );
					};

					return false;
				};

				if ( ! Event.hasTouch ) {
					return false;
				};

				return true;
			},

			_gesturesEnded: function( touches, event ) {
				var state = this.state();

				if ( state == UIGestureRecognizerState.Began || state == UIGestureRecognizerState.Changed ) {
					var touch = _currentTouch;
					var delta = { x: 0, y:0 };
					
					if ( touch ) {
						this._translate( delta, event );
						this.state( UIGestureRecognizerState.Ended );
					} else {
						this.state( UIGestureRecognizerState.Cancelled );
					};
				}
				else {
					this.state( UIGestureRecognizerState.Cancelled );
				};

				var bubbleEvent = ( _enableInteraction === _panningInteraction ) ? false : true;

				_currentTouch = null;
				_panningInteraction = UIPanInteraction.Unknown;
				_checkInteraction = false;

				if ( ! Event.hasTouch ) {
					return false;
				};

				return bubbleEvent;
			},

			_discreteGestures: function( touches, event ) {

				_currentTouch = null;
				_panningInteraction = UIPanInteraction.Unknown;
				_checkInteraction = false;

				return true;
			},
		
			init: function() {
				
			},
			
			destory: function() {
				this._super().destory();

			},

			translationInView: function( view ) {
				return _translation;
			},

			_translate: function( delta, event ) {
				var timeDiff = event.timeStamp - _lastMovementTime;

				if ( ! (delta.x == 0 && delta.y == 0)  && timeDiff > 0) {
					_translation.x += delta.x;
					_translation.y += delta.y;
					_velocity.x = delta.x / timeDiff;
					_velocity.y = delta.y / timeDiff;
					_lastMovementTime = event.timeStamp;

					return true;
				};

				return true;
			},

			translation: function( translation, view ) {
				_velocity = { x:0, y: 0 };
				_translation = translation;
			},

			reset: function() {
				this._super().reset();

				_translation = { x:0, y: 0 };
				_velocity = { x:0, y: 0 };
			},

			velocityInView: function( view ) {
				return _velocity;
			}
		};
	},
	'static': {
		Interaction: UIPanInteraction
	}
});

UISwipeGestureRecognizerDirection = {
	Right:	1 << 0,
	Left:	1 << 1,
	Up:		1 << 2,
	Down:	1 << 3	
},

UISwipeGestureRecognizer = Class({
	name: "UISwipeGestureRecognizer",
	parent: UIGestureRecognizer,
	constructor: function( view, enableInteraction, angle ) {

		var _minimumNumberOfTouches  = 1;
		var _maximumNumberOfTouches = 10;
		var _translation = { x:0, y: 0 };
		var _velocity = { x:0, y: 0 };

		var _currentPoint = { x:0, y: 0 };
		var _currentTouch = null;

		var _enableInteraction = ( enableInteraction == undefined ) ? UIPanInteraction.Landscape : enableInteraction;
		var _panningInteraction = UIPanInteraction.Unknown;
		var _checkInteraction = false;
		
		var _slideAngle = ( angle == undefined ) ? 60 : parse_int(angle);
		
		var _direction = UISwipeGestureRecognizerDirection.Right;

		return {
		
			direction: function( direction ) {
				if ( arguments.length == 0 ) {
					return _direction;
				}
				
				_direction = direction;
			},
			
			_gesturesBegan: function( touches, event ) {
				var touch = new Event( touches, event );

				_currentTouch = touch;
				_currentPoint = { x: touch.offsetX, y: touch.offsetY };
				_panningInteraction = UIPanInteraction.Unknown;
				_checkInteraction = false;

				if ( ! Event.hasTouch ) {
					return false;
				};

				return true;
			},

			_gesturesMoved: function( touches, event ) {
				var touch = new Event( touches, event );
				var state = this.state();

				var point = { x: touch.offsetX, y: touch.offsetY };
				var delta = { x: point.x - _currentPoint.x, y:point.y - _currentPoint.y };

				_currentPoint = point;
				_currentTouch = touch;

				if ( _checkInteraction == false ) {
					var M_PI = 3.1415926535898;
					var ratio = Math.atan2( delta.y, delta.x );
					var angle = ( ratio == 0 ) ? 0 : ( ratio *180 / M_PI );

					_panningInteraction = ( Math.abs( angle ) > _slideAngle && Math.abs( angle ) < ( 180 - _slideAngle ) ) ? UIPanInteraction.Portrat : UIPanInteraction.Landscape;
					_checkInteraction = true;
				};

				if (  _enableInteraction == UIPanInteraction.Unknown || _enableInteraction == _panningInteraction ) {
					var isContains = this.isContainedView( event );

					if ( state == UIGestureRecognizerState.Possible && touch && isContains ) {
						this.translation( delta );
						
						_lastMovementTime = event.timeStamp;

						this.state( UIGestureRecognizerState.Began, true );

					}
					else if ( state == UIGestureRecognizerState.Began || state == UIGestureRecognizerState.Changed ) {
						if ( touch ) {
							if ( this._translate( delta, event ) ) {
								this.state( UIGestureRecognizerState.Changed, true );
							};
						} else {
							this.state( UIGestureRecognizerState.Cancelled, true );
						};
					}
					else {
						this.state( UIGestureRecognizerState.Cancelled, true );
					};

					return false;
				};

				if ( ! Event.hasTouch ) {
					return false;
				};

				return true;
			},

			_gesturesEnded: function( touches, event ) {
				var state = this.state();
				
				if ( state == UIGestureRecognizerState.Began || state == UIGestureRecognizerState.Changed ) {
					var touch = _currentTouch;
					var delta = { x: 0, y:0 };
					var silence = true;
					
					if ( touch ) {
						this._translate( delta, event );
						
						if ( Math.abs( _translation.x ) > 10 ) {
							if ( _translation.x > 0 && _direction == UISwipeGestureRecognizerDirection.Right ) {
								silence = false;
							}
							else if ( _translation.x < 0 && _direction == UISwipeGestureRecognizerDirection.Left ) {
								silence = false;
							};
						};
						
						this.state( UIGestureRecognizerState.Ended, silence );
					} else {
						this.state( UIGestureRecognizerState.Cancelled, true );
					};
				}
				else {
					this.state( UIGestureRecognizerState.Cancelled, true );
				};

				var bubbleEvent = ( _enableInteraction === _panningInteraction ) ? false : true;

				_currentTouch = null;
				_panningInteraction = UIPanInteraction.Unknown;
				_checkInteraction = false;

				if ( ! Event.hasTouch ) {
					return false;
				};

				return bubbleEvent;
			},

			_discreteGestures: function( touches, event ) {

				_currentTouch = null;
				_panningInteraction = UIPanInteraction.Unknown;
				_checkInteraction = false;

				return true;
			},

			translation: function( translation, view ) {
				_translation = translation;
			},

			_translate: function( delta, event ) {
				var timeDiff = event.timeStamp - _lastMovementTime;

				if ( ! (delta.x == 0 && delta.y == 0)  && timeDiff > 0) {
					_translation.x += delta.x;
					_translation.y += delta.y;
					_lastMovementTime = event.timeStamp;

					return true;
				};

				return true;
			},
		
			init: function() {
				
			},
			
			destory: function() {
				this._super().destory();
				
			}
		};
	},
	'static': {
		Direction: UISwipeGestureRecognizerDirection
	}
});
	
})(window);