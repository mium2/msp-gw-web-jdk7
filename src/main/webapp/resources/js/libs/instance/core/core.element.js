
(function(window, undefined) {
	
var 
/* ----- Private UI Module ----- */
Class = UI.Class,
Helper = UI.Helper,
Core = Class.Core,
Event = Class.Event,
UIPoint = UI.Point,
UISize = UI.Size,
UIRect = UI.Rect,
UIEdgeInsets = UI.EdgeInsets,
Tween = UI.Tween,

/**
 * IObject
 * @name IObject
 * @class
 */

IObject = Class({
	name: "IObject",
	parent: Core,
	constructor: function() {
	
		return {
			__construct: function() {
				this.init();
			},
			
			init: function() {
				return this;
			}
		};
	}
}),

/**
 * Responder
 * @name Responder
 * @class
 */

Responder = Class({
	name: "Responder",
	parent: IObject,
	constructor: function() {
	
		
		var _eventUID;
		
		return {
			eventUID: function() {
				if ( ! _eventUID ) {
					_eventUID = "Event." + Element.guid ++;
				};
				
				return _eventUID;
			},
		
			context: function( func ) {
				var context = this;
				
				return (function() {
					func.apply( context, arguments );
				});
			},

			addEventListener: function( event, handler ) {
			
				if ( typeof handler != "function" ) {
					return;
				};
				
				var self = this;
				
				if ( typeof event == "array" ) {
					Array.prototype.array_each( event, function( i, e ) {
						self.addEventListener( e, handler );
					});
					
					return;
				};
				
				Event.manager().add( this, event, handler );
			},
			
			removeEventListener: function( event, handler ) {
				
				var self = this;
				
				if ( is_array( event ) ) {
					array_each( event, function( i, e ) {
						self.removeEventListener( e, handler );
					});
					
					return;
				};
				
				Event.manager().remove( this, event, handler );
			},
			
			dispatchEvent: function( event ) {
				
				var args = Array.prototype.slice.call( arguments, 0 );
				args.shift();
				
				var dispatcher = Event.manager().bindedEvent( this, event );
				dispatcher.dispatchEvent.apply( dispatcher, args );
			},
			
			bind: function( event, handler ) {
				this.addEventListener( event, handler );
				
				return this;
			},
			
			unbind: function( event, handler ) {
				this.removeEventListener( event );
				
				return this;
			},
			
			trigger: function(){
				this.dispatchEvent.apply( this, arguments );
				
				return this;
			}
		};
	}
}),

/**
 * Element
 * @name Element
 * @class
 */
Element = Class({
	name: "Element",
	parent: Responder,
	constructor: function( element ) {
	
		var _enabled = true,
			_element = ( element && element.jquery ) ? element.get(0) : element,
			_instance = null,
			_animating = false,
			_tweens = [];
			_scale = 1,
			_gestureRecognizers = [];
		
		return {
			__construct: function( ) {
				_instance = this;
				
				if ( element ) {
					this._initElement( element );
				}
				else {
					
					if ( typeof this["_init"] == "function" ) {
						this._init();
					};
				};
			},

			__destruct: function() {
				if ( _element ) {
					_element = undefined;
				};
			},
			
			_addInstance: function() {
				var instanceID = Helper.String.guid( "UIKit.xxxxxxxx" ) + "." + Element.guid ++;
				
				this.attribute("data-instance-id", instanceID );
				
				this.instanceID = instanceID;
				
				UI.manager.add( this );
			},
			
			_removeInstance: function() {
				if ( UIInstanceManager.isExpanded( this.constructor ) ) {
					this.constructor.instanceManager.remove( this );
				};
				
				UI.manager.remove( this );
				
				if ( _element ) {
					this.removeAttribute("data-instance-id");
				};
			},
			
			_instance: function() {
				return _instance;
			},
			
			_initElement:function( element ) {
				_element = ( element && element.jquery ) ? element.get(0) : element;
			
				this._addInstance();
				this.init();	
			},
			
			instanceID: 0,
		
			init: function( element ) {
			
				return this;
			},

			destory: function() {
			
				this._removeInstance();
				
				this.__destruct.apply( this, arguments );
			},
			
			hasElement: function() {
				return ( _element != undefined && _element != null ) ? true : false;
			},
			
			window: function() {
				return window;
			},
			
			element: function() {
				return _element;
			},
			
			css: function() {
				// TODO : jQuery 버림
			
				return $(_element).css.apply( $(_element), arguments );
			},
			
			findForEach: function(selector, handler){
				// TODO : jQuery 버림
				var self = this;
				
				$(_element).find(selector).each(function() {
					handler.apply(self, arguments);
				});
			},
			
			val: function( value ) {
				if ( !arguments.length ) {
					if ( _element ) {
						return (_element.value != undefined ) ? _element.value : "";
					}
		
					return;
				}
		
				if ( _element.value != undefined ) {
					_element.value = value;
				}
			},
			
			enabled: function( enabled ) {
				if ( arguments.length == 0 ) {
					return _enabled;
				};

				_enabled = enabled;
			},
			
			show: function() {
				
				$(_element).show.apply($(_element), arguments);
			},
			
			hide: function() {
				
				$(_element).hide.apply($(_element), arguments);
			},
			
			addGestureRecognizer: function( gestureRecognizer ) {
				if ( ! in_array( _gestureRecognizers, gestureRecognizer  ) ) {

					if ( gestureRecognizer._gestureObject() ) {
						gestureRecognizer._gestureObject().removeGestureRecognizer.call( gestureRecognizer._gestureObject(), gestureRecognizer );
					};

					array_add( _gestureRecognizers, gestureRecognizer );

					gestureRecognizer._gestureObject( this );
				};
			},

			removeGestureRecognizer: function( gestureRecognizer ) {
				if ( in_array( _gestureRecognizers, gestureRecognizer  ) ) {
					gestureRecognizer._gestureObject( null );
					array_remove( _gestureRecognizers, gestureRecognizer );
				};
			},
			
			scale: function( scale ) {
				if ( arguments.length == 0 ) {
					return _scale;
				}
				
				_scale = scale;
				_element.style.cssText += "-webkit-transform:scale(" + _scale + ")";
			},	
						
			size: function() {
				// TODO: jQuery 버리기
			
				if ( this.hasElement() ) {
					var width = $(_element).width();
					var height = $(_element).height();
					
					return new UISize( width, height );
				};
				
				return new UISize();
			},
			
			offset: function() {
				// TODO: jQuery 버리기
				
				if ( this.hasElement() ) {
					var offset = $(_element).offset();
					var x = offset.left;
					var y = offset.top;
					
					return new UIPoint( x, y );
				};
				
				return new UIPoint();
			},
			
			position: function() {
				// TODO: jQuery 버리기
			
				if ( this.hasElement() ) {
					var position = $(_element).position();
					var x = position.left;
					var y = position.top;
					
					return new UIPoint( x, y );
				};
				
				return new UIPoint();
			},
			
			removeAttribute: function(key) {
				_element.removeAttribute( key );
			},
			
			attribute: function(key, value) {
				// TODO: jQuery 버리기
			
				if ( value == undefined ) {
					return $(_element).attr(key);
				};
			
				return $(_element).attr(key, value);
			},
			
			append: function( child, option ) {
				var childElement = child.element();
				
				childElement = ( childElement && childElement.jquery ) ? childElement.get(0) : childElement;
				
				if ( childElement.nodeType === 1 || childElement.nodeType === 11 || childElement.nodeType === 9 ) {
					_element.appendChild( childElement );
				};
			},
	
			createElement : function(elem, option) {
				var appendEle = document.createElement(elem);
				for(var name in option) {
					if(name == 'text') {
						text = document.createTextNode( option[name] );
						appendEle.appendChild(text);
					} else if(name == 'html') {
						appendEle.innerHTML = option[name];
					};
				};
				
				return appendEle;
			},
			
			dispatchFromElement: function( event, args ) {
				
			},
			
			addEventListener: function( event, handler ) {
				this._super().addEventListener( event, handler );
				
				if ( _element ) {
					_element.addEventListener( event, handler, false );
				};
			},
			
			removeEventListener: function( event, handler ) {
				this._super().removeEventListener( event, handler );
				
				// TODO : Unbind Check
				_element.removeEventListener( event, handler, false );
			},
			
			__didFinishToTween: function( tween ) {
				//debug.error( "__didFinishToTween", tween );
				
				var self = this;
			
				if ( tween ) {
					array_remove( _tweens, tween );	
				}
				else {
					_tweens.shift();
				}
				
				if ( _animating && _tweens.length == 0 ) {
					return this._stopAnimation();
				}
			
				setTimeout(function() {
					self._nextAnimation();
				}, 0);
			},
			
			_nextAnimation: function() {
				
				var tween = _tweens[_tweens.length - 1];
				tween.start();
				
				//debug.error( "_nextAnimation", tween );
			},
			
			_stopAnimation: function() {
				//debug.error( "_stopAnimation" );
			
				return _animating = false;	
			},
			
			_startAnimations: function() {
				//debug.error( "_startAnimations" );
			
				if ( _animating && _tweens.length == 0 ) {
					return this._stopAnimation();
				}
			
				if ( _animating == false ) {
					_animating = true;
				
					this._nextAnimation();
				}
				else {
					debug.warn( this.name,  " is animating !!" );
				}
			},
			
			animate: function( duration, vars ) {
				debug.log( this.name, "animate", arguments );
				
				var tween = new Tween(this);
				tween.set( duration, vars );
				
				_tweens.push( tween );
				
				this._startAnimations();
			}
		};
	},
	'static': function() {
		
		return {
			guid: 0
		}
	}
});


var 
/* ----- Instance Manager ----- */

/**
 * Javascript Instance Module
 * @name UIManager
 * @class
 */
UIManager = function() {
	var _instances = [];
	var _defined = {};
	
	return {
		add: function( instance ) {
			if ( ! instance.element() || instance.element().length == 0 ||  ! instance.element().nodeType || instance.element().nodeType !== 1 ) {
				debug.warn( "instance is null", instance );
				return;
			};
		
			var instanceID = instance.attribute("data-instance-id");
			var instanceIndex = parseInt( instanceID.split(".")[2] );
			
			_defined[instanceID] = _instances[instanceIndex] = instance;
		},
		
		remove: function( instance ) {
			if ( instance.element().length == 0 ) {
				debug.warn( "instance is null", instance );
				return;
			};
		
			var instanceID = instance.attribute("data-instance-id");
			
			_defined[instanceID] = undefined;
			delete _defined[instanceID];
		},
		
		item: function( selector, constructor ) {
			var item = ( selector && selector.length != undefined && selector.length == 1 ) ? selector[0] : selector;
		
			constructor = window[constructor] || Class[constructor] || constructor;
			
			var checker = function() {
				if ( item == undefined ) {
					return true;
				};
				
				// instance 는 존재하나 constructor 가 다른 경우
				if ( item.constructor != undefined && constructor != undefined ) {
					if ( item.constructor != constructor ) {
						//debug.warn( "different constructor", item.constructor.name, constructor.name );
						return true;
					};
				};
				
				return false;
			};
			
			if ( checker() ) {
			
				var params = Array.prototype.slice.call( arguments, 2 );
				
				if ( typeof constructor == "function"  ) {
					// is not class
					if ( ! Class.isClass( constructor ) ) {
						var className = ( typeof selector["selector"] == "string" ? function( name ) {
								return name.replace(/[\.\-]/gi, "_");
							}(selector["selector"]) : undefined );
						
						constructor = Class({
							"name": className,
							"parent": UIEventDispatcher,
							"constructor": constructor
						});
					};
				};
			
				item = new constructor( UIFactory(selector), params[0], params[1], params[2] ); // option 3 이상은 없을꺼라고 예상
			};
			
			return item;	
		},
		
		get: function( selector, constructor, options ) {
		
			if ( selector && selector.length != undefined && selector.length > 1 ) {
				var items = [];
				var self = this;
			
				array_each(selector, function(index, element ) {
					var item = self.item(element, constructor, options );
				
					items.push( item );
				});
				
				return UIFactory(items);
			};
			
			return this.item.apply( this, arguments );
		},
		
		byID: function( instanceID ) {
			return _defined[instanceID];
		},
		
		atIndex: function( index ) {
			return _instances[index];
		},
		
		withElement: function( element ) {
			var instanceID = $(element).attr("data-instance-id");
			
			return this.byID( instanceID );
		},
		
		countOf: function() {
			return _instances.length;
		}
	};
};

UI.manager = new UIManager();
	
})(window);