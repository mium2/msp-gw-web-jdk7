
(function(window, undefined) {

var 
/* ----- Notification ----- */
Class = UI.Class,

Notification = function( info, args ) {
	
	return {
		userInfo: info,
		arguments: args
	};
},

NotificationObserver = function( target, handler ) {

	return {
		post: function() {
			handler.apply( target, arguments );
		}
	};
},

NotificationCenter = function() {

	var _observers = {};
	
	return {
		addObserver: function( target, name, handler ) {
			if ( name.indexOf( "" ) !== -1 ) {
				var someNames = name.split(" ");
				var self = this;
				if ( someNames.length > 1 ) {
					array_each( someNames, function( index, someName ) {
						self.addObserver( target, someName, handler );
					});
					
					return;
				};
			};
		
			if ( _observers[name] == undefined ) {
				_observers[name] = [];
			};
			
			var observer = new NotificationObserver( target, handler );
			
			_observers[name].push( observer );
		},
		
		postNotification: function( name, info ) {
			//debug.log( this, "postNotification", name, info );
		
			if ( _observers[name] == undefined ) {
				return;
			};
		
			var args = Array.prototype.slice.call( arguments, 0 ); args.shift();
			var notification = new Notification( info, args );
			var objservers = _observers[name];
			
			array_each( objservers, function( index, observer ) {
				observer.post.call( observer, notification );
			});
		}
	};
};

Notification.defaultCenter = new NotificationCenter();

UI.Notification = window.UINotification = Notification;

})(window);