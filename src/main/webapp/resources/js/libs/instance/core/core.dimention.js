

(function(window, undefined) {
	
var 
/* ----- Dimention ----- */

UIPoint = function( x, y ) { 
	var _x = ( x == undefined || isNaN(parseFloat(x)) ) ? 0 : parseFloat( x );
	var _y = ( y == undefined || isNaN(parseFloat(y)) ) ? 0 : parseFloat( y );
	
	var point = { x:_x, y:_y }; 
	point.toString = function() {
		return JSON.stringify( rect );
	};
	
	return point;
},
UISize = function( width, height ) { 
	var _width = ( width == undefined || isNaN(parseFloat(width)) ) ? 0 : parseFloat(width);
	var _height = ( height == undefined || isNaN(parseFloat(height)) ) ? 0 : parseFloat(height);
	
	var size = { width:_width, height:_height };
	size.toString = function() {
		return JSON.stringify( rect );
	};
	
	return size;
},
UIRect = function( x, y, width, height ) {
	if ( arguments.length == 1 ) {
		var rect = x;
		
		return new UIRect( rect.origin.x, rect.origin.y, rect.size.width, rect.size.height );	
	};

	var _x = ( x == undefined || isNaN(parseFloat(x)) ) ? 0 : parseFloat( x );
	var _y = ( y == undefined || isNaN(parseFloat(y)) ) ? 0 : parseFloat( y );
	var _width = ( width == undefined || isNaN(parseFloat(width)) ) ? 0 : parseFloat(width);
	var _height = ( height == undefined || isNaN(parseFloat(height)) ) ? 0 : parseFloat(height);
	
	var rect = { origin:new UIPoint(_x, _y), size:new UISize(_width, _height) };
	rect.toString = function() {
		return JSON.stringify( rect );
	};
	
	return rect;
},
UIEdgeInsets = function( top, right, bottom, left ) {
	var _top = ( top == undefined || isNaN(parseFloat(top)) ) ? 0 : parseFloat( top );
	var _right = ( right == undefined || isNaN(parseFloat(right)) ) ? 0 : parseFloat( right );
	var _bottom = ( bottom == undefined || isNaN(parseFloat(bottom)) ) ? 0 : parseFloat( bottom );
	var _left = ( left == undefined || isNaN(parseFloat(left)) ) ? 0 : parseFloat( left );
	
	var edgeInsets = { 
		top: _top, 
		right: _right, 
		bottom: _bottom, 
		left: _left 
	};
	edgeInsets.toString = function() {
		return JSON.stringify( rect );
	};
	
	return edgeInsets;
};

UI.Point = UIPoint;
UI.Size = UISize;
UI.Rect = UIRect;
UI.EdgeInsets = UIEdgeInsets;
	
})(window);