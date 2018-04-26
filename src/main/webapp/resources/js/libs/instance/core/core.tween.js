
(function( window, undefined ) {
	
var 
/* ----- Tween ----- */
Class = UI.Class,
Helper = UI.Helper,
Core = Class.Core,
IObject = Class.IObject,

Easing = {
	Linear: function( t, s, e, d ) {
		if ( t <= 0 ) {
			return s;
		}
		else if ( t >= 1 ) {
			return e;
		};
		
		return t * e + (1-t) * s;
	},
	
	Quad: {
		easeIn: function( t, s, e, d ) {
			return Easing.Linear( t * t, s, e );
		},
		
		easeOut: function( t, s, e, d ) {
			return Easing.Linear( ( 2 - t ) * t, s, e );
		},
		
		easeInOut: function( t, s, e, d ) {
			
			var wt = t;
			
			t /= d / 2;
			
			if ( t < 1 ) {
				return Easing.Linear( t * t, s, e + (s-e)*0.5 );
			};
			
			t = wt;
			
			return Easing.Linear( ( 2 - t ) * t, s-(s-e)*0.5, e );
		}
	},
	
	Bounce: {
		easeOut: function( t, s, e, d ) {
			debug.log( t );
		
			if ( t * 2 < 1 ) {
				return Easing.Linear( t * t, s, e );
			};
			
			return Easing.Linear( ( 2 - t ) * t * -1, s, e );
		}
	},
},

Tween = Class({
	name: "Tween",
	parent: IObject,
	constructor: function( instance ) {
		
		var _instance = instance,
			_duration = 0,
			_defaultVars = {
				delay:0,
				top:undefined, left:undefined, right:undefined, bottom:undefined,
				width:undefined, height:undefined,
				scale:1,
				
				transform: {
					rotation: {
						x:0, y:0, z:0
					},
					
					scale: {
						x:0, y:0, z:0
					},
					
					skew: {
						x:0, y:0
					},
					
					matrix: {
						x:0, x2:0, x3:0,
						y:0, y2:0, y3:0,
						z:0, z2:0, z3:0,
						d:0, d2:0, d3:0,
						
						tx:0, ty:0, tz:0, td:0
					}
				},
				
				shadow:0,
				opacity:1,
				
				onStart: UI.Constants.NULL_FUNCTION,
				onUpdate: UI.Constants.NULL_FUNCTION,
				onComplete: UI.Constants.NULL_FUNCTION
			},
			_data = {
				top:0, left:0, right:0, bottom:0,
				width:0, height:0,	
				
				transform: {
					rotation: {
						x:0, y:0, z:0
					},
					
					scale: {
						x:0, y:0, z:0
					},
					
					skew: {
						x:0, y:0
					},
					
					matrix: {
						x:0, x2:0, x3:0,
						y:0, y2:0, y3:0,
						z:0, z2:0, z3:0,
						d:0, d2:0, d3:0,
						
						tx:0, ty:0, tz:0, td:0
					}
				},
				
				shadow:0,
				opacity:1
			},
			_vars = {},
			_kill = false,
			_beginTime = -1,
			_curveFunction = function() {},
			_requestAnimationFrame = window.requestAnimationFrame, 
			_cancelAnimFrame = window.cancelAnimationFrame;
		
		return {
			_animationPosition: 0,
		
			init: function() {
				var self = this._super().init();
				if (self) {
					
					var a = ["ms","moz","webkit","o"];
					var i = a.length;
					
					while (--i > -1 && !_requestAnimationFrame) {
						_requestAnimationFrame = window[a[i] + "RequestAnimationFrame"];
						_cancelAnimFrame = window[a[i] + "CancelAnimationFrame"] || window[a[i] + "CancelRequestAnimationFrame"];
					};
				};
				return this;
			},
			
			_render: function( timeStamp ) {
				if ( _kill === true ) {
					return false;
				};
			
				var self = this,
					beginTime = ( _beginTime == -1 ) ? (_beginTime = timeStamp) : _beginTime,
					currentTime = timeStamp;
					elapsedTime = currentTime - beginTime,
					animationPosition = ( _duration == 0 ) ? 1 : (( elapsedTime == 0 ) ? 0 : Math.min(1, elapsedTime / _duration ));
				
				this._animationPosition = animationPosition;
				
				this._onUpdate( animationPosition );
				
				return ( animationPosition === 1 );
			},
			
			_easingCurve: function( t, start, end ) {
				
			},
			
			_curve: function( timing, start, end ) {
				if ( timing <= 0 ) {
					return start;
				}
				else if ( timing >= 1 ) {
					return end;
				};
				
				return _curveFunction.call( this, timing, start, end, _duration );
			},
			
			_requestAnimationFrame: function() {
				var self = this;
				
				if ( _duration == 0 ) {
					self._render(-1);
					
					if ( _kill == false ) {
						self._onComplete.call( self );
					};
					
					return;
				};
				
				_requestAnimationFrame( function() {
					
					if ( ! self._render.apply( self, arguments ) ) {
						self._requestAnimationFrame();
					}
					else {
						setTimeout(function() {
						
							if ( _kill == false ) {
								self._onComplete.call( self );
							};
						}, 0);
					};
				});	
			},
			
			_onStart: function() {
				//debug.log( "onStart" );
				
				_beginTime = -1;
				
				if ( typeof _vars.onStart == "function" ) {
					_vars.onStart();
				};
			},
			
			_onUpdate: function( timing ) {
				//debug.log( "onUpdate", ratio );
				
				var css = {};
				
				for ( var key in _vars ) {
					
					if ( Helper.Array.in_array( ["left", "right", "top", "bottom", "width", "height"], key ) && _vars[key] != undefined ) {
						css[key] = this._curve( timing, _data[key], _vars[key] ) + "px";
					}
					else if ( Helper.Array.in_array( ["opacity"], key ) && _vars[key] != undefined ) {
						css[key] = this._curve( timing, _data[key], _vars[key] );
					}
					else if ( Helper.Array.in_array( ["scale"], key ) && _vars[key] != undefined ) {
						
						var value = this._curve( timing, _data[key], _vars[key] );
						
						_instance[key](value);
					};
				};
			
				_instance.css(css);
				
				if ( typeof _vars.onUpdate == "function" ) {
					_vars.onUpdate( timing );
				};
			},
			
			_onComplete: function() {
				//debug.log( "onComplete", _instance );
				
				if ( typeof _vars.onComplete == "function" ) {
					_vars.onComplete.call( _instance, this );
				};
				
				if ( typeof _instance.__didFinishToTween == "function" ) {
					_instance.__didFinishToTween.call( _instance, this );
				}
			},
			
			_vars: function( vars ) {
				_vars = {};//Helper.Object.object_copy( _defaultVars );
				
				for ( var key in _defaultVars ) {
					if ( vars[key] != undefined ) {
						var type = typeof _defaultVars[key];
						
						if ( type == "object" ) {
							//this.object_merge( obj1[key], obj2[key] );
						}
						else if ( type == "number" ) {
							if ( (''+_defaultVars[key]).indexOf('.') !== -1 ) {
								_vars[key] = parseFloat(vars[key]) || 0;
							}
							else {
								_vars[key] = parseInt(vars[key]) || 0;
							};
						}
						else { // string, function
							_vars[key] = vars[key];
						};
					};
				};
				
				//debug.log( "_vars", _vars );
			},
			
			_data: function() {
				var element = _instance.element();
				
				var position = _instance.position();
				var size = _instance.size();
				
				_data = {
					left: position.x,
					top: position.y,
					width: size.width,
					height: size.height,
					scale: _instance.scale(),
					opacity: ( element.style.opacity ) ? parseInt( element.style.opacity ) : 1
				};
				
				//debug.log( "_data", _data );
			},
			
			killTo: function() {
				_kill = true;
			},
			
			set: function( duration, vars ) {
				
				_duration = duration * 1000;
				_curveFunction = Easing.Quad.easeOut;
				
				this._vars(vars);
			},
			
			to: function( duration, vars ) {
			
				_kill = false;
			
				this.set( duration, vars );
				this.start();
			},
			
			start: function() {
				this._onStart();
				this._data();
				this._requestAnimationFrame();
			}
		}
	},
	'static': function() {
		
		return {
			set: function( target, duration, vars ) {
				var tween = new Tween( target );
				tween.set( duration, vars );
				return tween;
			},
		
			to: function( target, duration, vars ) {
				var tween = new Tween( target );
				tween.to( duration, vars );
				return tween;
			}
		};
	}
});

UI.Tween = Tween;

})(window);