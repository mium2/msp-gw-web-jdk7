
(function(window, undefined) {

var 
Class = UI.Class,
UIComponent = UI.Class.UIComponent,

UITree = Class({
	name: "UITree",
	parent: UIComponent,
	constructor: function( data  ) {
	
		var 
		_$container = null,
		_delegate = {},
		_treeData = data;
		
		return {
			_loadTree: function( treeData, depth ) {
				var $container = $("<UL />").addClass("closed");
			
				for ( var i in treeData ) {
					var itemData = treeData[i];
					var $item = $("<LI />");
					var $itemBullet = $("<span class='item-bullet'></span>").text("▶︎");
					var $itemName = $("<span class='item-name'></span>").text( itemData.itemName );
					
					if ( itemData.subTree.length > 0 ) {
						$item.append( $itemBullet );
					}
					
					$item.append( $itemName );
					
					$subTree = this._loadTree( itemData.subTree, depth + 1 );
					
					if ( itemData.subTree.length > 0 ) {
						$item.append( $subTree );
					};
					
					$item.data( itemData.data );
					
					(function($item, $subTree, i, itemData ) {
						$item.bind("click", function(e) {
							if ( _delegate.didSelectedItem ) {
								_delegate.didSelectedItem.call( _delegate, $item, depth, parseInt(i), itemData );
							};
							
							if ( depth == 0 ) {
								if ( $subTree.hasClass("closed") ) {
									$subTree.removeClass("closed");
									$item.find(".item-bullet").first().text("▼");
								}
								else {
									$subTree.addClass("closed");
									$item.find(".item-bullet").first().text("▶︎");
								}
							};
							
							return false;
						});
					})($item, $subTree, i, itemData);
									
					$container.append( $item );
				};
				
				_$container = $container;
				
				return $container;
			},
		
			init: function() {
				
				return this;
			},
			
			container: function() {
				return ( _$container == null ) ? this._loadTree( _treeData, 0 ) : _$container;
			},
			
			delegate: function( delegate ) {
				_delegate = delegate;
			}
		}
	}
});

window.UITree = UITree;

})(window);