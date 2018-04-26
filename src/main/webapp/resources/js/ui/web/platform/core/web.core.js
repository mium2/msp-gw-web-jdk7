
(function(window, undefined) {

var 
Class = UI.Class,

UINotificationPageViewDidReady					= "UINotificationPageViewDidReady",
UINotificationPageViewDidLoadURL				= "UINotificationPageViewDidLoadURL",
UINotificationProjectViewDidMoveHistoryBack		= "UINotificationProjectViewDidMoveHistoryBack",
UINotificationProjectViewDidChangeLockedMode	= "UINotificationProjectViewDidChangeLockedMode",
UINotificationProjectViewDidChangeDeviceSize	= "UINotificationProjectViewDidChangeDeviceSize",

UIRealPath = function( path ) {
	var components = path.split("/");
	var newComponents = [];
	var relationURL = ( components.length > 1 && components[0] == ".." ) ? true : false;
	for ( var i in components ) {
		var component = components[i];
		
		if ( component == '.' ) {
			continue;
		}
		else if ( component == '..' ) {
			if ( relationURL == false ) {
				newComponents.pop();
			}
			else {
				newComponents.push( component );
			}
		}
		else {
			relationURL = false;
			
			newComponents.push( component );
		}
	}
	
	return newComponents.join("/");
},

Parameters = function() {
	
	var _params = {};
	
	return {
		params: function( params ) {
			for ( var key in params ) {
				var value = params[key];
				
				_params[key] = value;
			}
		},
		
		set: function( key, value ) {
			_params[key] = value;
		},
		
		get: function( key ) {
			if ( arguments.length == 0 ) {
				return _params;
			}
		
			return _params[key];
		},
		
		removeAll: function() {
			// TODO: {}
			_params = {};
		},
		
		remove: function( key ) {
			_params[key] = undefined;
			delete _params[key];
		},
		
		keys: function() {
			var keys = [];
			for ( var key in _params ) {
				keys.push(key);
			}
		
			return keys;
		},
		
		data: function() {
			return _params;
		}
	}	
},

MasterOrientation = {
	Portrait:	2,
	Landscape:	4,
	All:		5,
	Custom:		9
},

SupportOrientation = {
	Default:	1,
	Portrait:	2,
	Landscape:	4,
	All:		5	
},

TransitionType = {
	UNSET:			"",
	NONE:			"NONE",
	DEFAULT:		"DEFAULT",
	SLIDE_LEFT:		"SLIDE_LEFT",
	SLIDE_RIGHT:	"SLIDE_RIGHT",
	SLIDE_TOP:		"SLIDE_TOP",
	SLIDE_BOTTOM:	"SLIDE_BOTTOM",
	MODAL_LEFT:		"MODAL_LEFT",
	MODAL_RIGHT:	"MODAL_RIGHT",
	MODAL_UP:		"MODAL_UP",
	MODAL_DOWN:		"MODAL_DOWN",
	FADE:			"FADE",
	ZOOM_IN:		"ZOOM_IN",
	ZOOM_OUT:		"ZOOM_OUT"
},

License = Class({
	name: "License",
	parent: Class.IObject,
	constructor: function() {
	
		var 
		_appID;
		
		return {
			init: function() {
				
			},
			
			fileExistsAtPath: function( path ) {
				var isExists = false;
				
				$.ajax({
					url: path,
					async: false,
					success: function(e) {
						if ( e ) {
							isExists = true;
						};
					},
					fail: function(e) {
						
					}
				});
				
				return isExists;
			},
			
			appID: function() {
				return _appID;
			},
			
			check: function( path ) {
				var isValid = false;
			
				if ( ! this.fileExistsAtPath( path ) ) {
					isValid = false;
				}
				else {
					
					$.ajax({
						url: path,
						async: false,
						dataType: "text",
						success: function( text ) {
							var temp = text.split('\n');
							
							array_each( temp, function( i, line ) {
								var data = line.split('=');
							
								if ( data[0] == "application_id" ) {
									_appID = data[1];
									
									isValid = true;
									
									return false;
								};
								
								return true;
							});
						},
						fail: function(e) {
							// TODO :
						}
					});
				};
				
				return isValid;
			}
		};
	}
}),

AppManifestConfig = Class({
	name: "AppManifestConfig",
	parent: Class.IObject,
	constructor: function() {
		
		var Constant = {
			Path: {
				RESOURCE:			"res",
				WEB:				"www",
				NATIVE:				"native",
				HTML:				"html",
				WNI:				"wni",
				LOCALS:				"locals"
			},
			File: {
				MANIFEST_FILE: 		"AppManifest.xml",
				MANIFEST_FILE_ENC: 	"AppManifest.xml.enc",
				MANIFEST_FILE2_0: 		"Manifest.xml",
				MANIFEST_FILE_ENC2_0: 	"Manifest.xml.enc"
			},
			UpdateMode: {
				Unset:		0,
				Develop:	1,
				Release:	2
			}
		};
				
		var _path = {
			baseURL:				"",
			root:					"",
			resource:				"",
			web:					"",
			html:					"",
			config:					"",
			configENC:				"",
			document:				""
		};
		
		var _config = {
			/* since manifest 1.x */
			debugMode:	false,
			security:	false,
			logging:	"log", // TODO : change log-level
			fileLogging:	false,
			masterOrientation:	MasterOrientation.Custom,
			defaultOrientation:	SupportOrientation.All,
			defaultVersion:	"",
			startPage:	"",
			startPageMode:	"",
			introPage:	"",
			extendWNInterface:	"",
			networkSetting:	"",
			updateMode:	"",
			displayStackInfo:	false,
			langJS:	"",
			screenSwitchingIndicator:	false,
			errorPage:	"",
			
			
			/* since manifest 2.x */
			updateServerName: "",
			updateServerTRCode: "",
			updateMode: Constant.UpdateMode.Develop,
			systemLanguage: ""
		};
		
		var _manifest = {},
			_networkSettings = {},
			_encode = false;
		
		return {
			
			init: function() {
				
			},
			
			path: function() {
				return _path;	
			},
			
			manifest: function() {
				return _manifest;	
			},
			
			config: function() {
				return _config;	
			},
			
			fileExistsAtPath: function( path ) {
				var isExists = false;
				
				$.ajax({
					url: path,
					async: false,
					success: function(e) {
						if ( e ) {
							isExists = true;
						};
					},
					fail: function(e) {
						
					}
				});
				
				//debug.log( this.name, "fileExistsAtPath", path, isExists );
				
				return isExists;
			},
			
			configure: function( path, manifestPath, ver2Higher ) {
				var resourcePath = manifestPath || Constant.Path.RESOURCE;
                _path.root = path;
                _path.resource = _path.root + "/" + resourcePath;
				_path.web = _path.resource + "/" + Constant.Path.WEB;
				
				if ( manifestPath != undefined && this.fileExistsAtPath( _path.resource + "/" + Constant.File.MANIFEST_FILE2_0 ) ) {
				
					if ( ver2Higher == true ) {
						_path.config = _path.root + manifestPath + "/" + Constant.File.MANIFEST_FILE2_0;
						_path.configENC = _path.root + manifestPath + "/" + Constant.File.MANIFEST_FILE_ENC2_0;
						_path.document = _path.root + manifestPath; // + "/" + Constant.Path.HTML;
						
						AppInfo.instance().manifestVer2Higher = true;
						
						
					}
					else {
						_path.config = _path.root + manifestPath + "/" + Constant.File.MANIFEST_FILE;
						_path.configENC = _path.root + manifestPath + "/" + Constant.File.MANIFEST_FILE_ENC;
						_path.document = _path.root + manifestPath + "/" + Constant.Path.HTML;
					}
					
					return;
				};
				
				// {PROJECT}/res/www/AppManifest.xml
				if ( this.fileExistsAtPath( _path.web + "/" + Constant.File.MANIFEST_FILE ) ||
					this.fileExistsAtPath( _path.web + "/" + Constant.File.MANIFEST_FILE_ENC ) ) {
					
					_path.config = _path.web + "/" + Constant.File.MANIFEST_FILE;
					_path.configENC = _path.web + "/" + Constant.File.MANIFEST_FILE_ENC;
					_path.document = _path.web + "/" + Constant.Path.HTML;
					
					return;
				}
				// {PROJECT}/res/AppManifest.xml
				else if ( this.fileExistsAtPath( _path.resource + "/" + Constant.File.MANIFEST_FILE ) ||
					this.fileExistsAtPath( _path.resource + "/" + Constant.File.MANIFEST_FILE_ENC ) ) {
					
					_path.config = _path.resource + "/" + Constant.File.MANIFEST_FILE;
					_path.configENC = _path.resource + "/" + Constant.File.MANIFEST_FILE_ENC;
					_path.document = _path.resource;
					
					return;
				}
				
				// {PROJECT}/res/www/Manifest.xml
				if ( this.fileExistsAtPath( _path.web + "/" + Constant.File.MANIFEST_FILE2_0 ) ||
					this.fileExistsAtPath( _path.web + "/" + Constant.File.MANIFEST_FILE_ENC2_0 ) ) {
					
					_path.config = _path.web + "/" + Constant.File.MANIFEST_FILE2_0;
					_path.configENC = _path.web + "/" + Constant.File.MANIFEST_FILE_ENC2_0;
					_path.document = _path.web + "/" + Constant.Path.HTML;
					
					AppInfo.instance().manifestVer2Higher = true;
					
					return;
				}
				// {PROJECT}/res/Manifest.xml
				else if ( this.fileExistsAtPath( _path.resource + "/" + Constant.File.MANIFEST_FILE2_0 ) ||
					this.fileExistsAtPath( _path.resource + "/" + Constant.File.MANIFEST_FILE_ENC2_0 ) ) {
					
					_path.config = _path.resource + "/" + Constant.File.MANIFEST_FILE2_0;
					_path.configENC = _path.resource + "/" + Constant.File.MANIFEST_FILE_ENC2_0;
					_path.document = _path.resource;
					
					AppInfo.instance().manifestVer2Higher = true;
					
					return;
				}
				else {
					
					_path.config = _path.web + "/" + Constant.File.MANIFEST_FILE;
					_path.configENC = _path.web + "/" + Constant.File.MANIFEST_FILE_ENC;
					_path.document = _path.web + "/" + Constant.Path.HTML;
					
					return;
				};
			},
			
			makeByManifest1: function() {
				debug.log( "makeByManifest1" );
				
				var manifest = null;
			
				if ( _encode == true && this.fileExistsAtPath( _path.configENC ) ) {
					// TODO
					debug.warn("This Emulator is not support to decript encripted config file(" + _path.configENC + ")");
				}
				else {
					
					$.ajax({
						url: _path.config,
						async: false,
						dataType: "xml",
						success: function( xmlDoc ) {
							var obj = UI.Helper.XML.toJSON(xmlDoc);
							manifest = obj.manifest;
						},
						fail: function(e) {
							// TODO :
							
							debug.error(e);
						}
					});
				};
				
				if ( ! manifest ) {
					debug.warn( "manifest is not loaded" );
					return;	
				};
				
				_manifest = manifest;
							
				_config.developMode = BooleanValue( _manifest["develop-mode"] );
				_config.startPage = _manifest["startpage-name"];
				_config.defaultVersion = _manifest["default-version"];
				_config.screenSwitchingIndicator = BooleanValue( _manifest["show-screen-switching-indicator"] );
				
				/*
				TODO : 추후구현
				
				MPVirtual.loadAppManifestXml.serverNode = _xmlDoc.getElementsByTagName("network-setting")[0].childNodes
				for(var i=0; i<MPVirtual.loadAppManifestXml.serverNode.length; i++){ 
					if( MPVirtual.loadAppManifestXml.serverNode[i].nodeType == 1 ){
						try{  
							MPVirtual.networkManager = MPVirtual.loadAppManifestXml.serverNode[i].querySelector("http-network-manager").firstChild.nodeValue; 
							MPVirtual.networkManager = MPVirtual.networkManager.split(".")[MPVirtual.networkManager.split(".").length-1];
							MPVirtual.serverList.push(
								new MPVirtual.pushToServerList(
									MPVirtual.loadAppManifestXml.serverNode[i].getAttribute("name"), 
									MPVirtual.loadAppManifestXml.serverNode[i].querySelector("http-connection-url").firstChild.nodeValue,
									MPVirtual.networkManager
								)
							);
						}catch(e){}
					}
				}
				*/
				
				//console.log( "_manifest", _manifest );
				
				// Network Setting
				var networkSettings = {};
				
				for ( var i in _manifest["network-setting"]["http-network"] ) {
					var setting = _manifest["network-setting"]["http-network"][i];
					var serverName = setting["@attributes"]["name"];
					
					var dataMap = new UI.DataMap();
					for ( var key in setting ) {
						dataMap.put(key, setting[key]);	
					}
					
					networkSettings[serverName] = dataMap;
				}
				
				for ( var i in _manifest["network-setting"]["socket-network"] ) {
					var setting = _manifest["network-setting"]["socket-network"][i];
					var serverName = setting["@attributes"]["name"];
					var dataMap = new UI.DataMap();
					for ( var key in setting ) {
						dataMap.put(key, setting[key]);	
					}
					
					networkSettings[serverName] = dataMap;
				}
				
				_networkSettings = networkSettings;
				
				//console.log( "_networkSettings", _networkSettings );
			},
			
			makeByManifest2: function() {
				debug.log( "makeByManifest2" );
				
				var manifest = null;
			
				if ( _encode == true && this.fileExistsAtPath( _path.configENC ) ) {
					// TODO
					
					debug.warn("This Emulator is not support to decript encripted config file(" + _path.configENC + ")");
				}
				else {
					
					$.ajax({
						url: _path.config,
						async: false,
						dataType: "xml",
						success: function( xmlDoc ) {
							var obj = UI.Helper.XML.toJSON(xmlDoc);
							manifest = obj.manifest;
						},
						fail: function(e) {
							// TODO :
							
							debug.error(e);
						}
					});
				};
				
				if ( ! manifest ) {
					return;	
				};


				_manifest = manifest;
				
				// TODO: encrypted config file 
				
				_config.developMode = ( typeof manifest.resource.target == "string" && manifest.resource.target.toUpperCase() == "APP" ) ? true : false;
				_config.defaultVersion = manifest.resource.base_version;
				_config.updateServerName = manifest.resource.update.server;
				_config.updateServerTRCode = manifest.resource.update.trcode;
				_config.updateMode = ( typeof manifest.resource.update.mode == "string" && manifest.resource.update.mode.toUpperCase() == "REAL" ) ? Constant.UpdateMode.Release : Constant.UpdateMode.Develop;
				
				_config.logging	= manifest.log; // TODO : check valid
				
				// TODO: language setting
				_config.system_language = "";
				
				_config.startPage = manifest.startpage.name;
				_config.startPageMode = manifest.startpage.orient;
				_config.introPage = "";
				
				
				// TODO: orientation setting
				
				// TODO: addon
				
				// TODO: plugin
				
				// Network Setting
				var networkSettings = {};
				
				for ( var serverName in _manifest.network.http ) {
					var setting = _manifest.network.http[serverName];
					
					
					var dataMap = new UI.DataMap();
					dataMap.put("http-network-manager", setting.path);
					dataMap.put("http-connection-url", setting.address);
					dataMap.put("http-network-timeout", setting.timeout);
					dataMap.put("http-encoding", setting.encoding);
					
					if ( setting.type != undefined && setting.type.toUpperCase() == "REST" ) {
						dataMap.put("http-resource-update-uri", setting.type);
					}
					
					networkSettings[serverName] = dataMap;
				}
				
				for ( var serverName in _manifest.network.socket ) {
					var setting = _manifest.network.socket[serverName];
					var dataMap = new UI.DataMap();
					dataMap.put("socket-network-manager", setting.path);
					dataMap.put("socket-connection-address", setting.address);
					dataMap.put("socket-connection-port", setting.port);
					dataMap.put("socket-network-timeout", setting.timeout);
					dataMap.put("socket-encoding", setting.encoding);
					
					networkSettings[serverName] = dataMap;
				}
				
				_networkSettings = networkSettings;
			},
			
			make: function( encode ) {
				_encode = encode == undefined ? false : encode;
				
				//console.log( "AppInfo.instance().manifestVer2Higher", AppInfo.instance().manifestVer2Higher );
			
				if ( ! AppInfo.instance().manifestVer2Higher ) {
					this.makeByManifest1();	
				}
				else {
					this.makeByManifest2();
				};
			},
			
			networkSetting: function( serverName ) {
				return _networkSettings[serverName];
			},
			
			startPagePath: function() {
				var path,
				isHTTP = function( path ) {
					return ( path.toLowerCase().indexOf("http://") != -1 ||
					path.toLowerCase().indexOf("https://") != -1 || 
					path.toLowerCase().indexOf("file://") != -1 ) ? true : false;
				};
			
				if ( AppInfo.instance().manifestVer2Higher == true ) {
					var config = this.config();
					path = config.startPage;
				}
				else {
					path = _manifest.startpage.name;
				}
				
				path = ( isHTTP( path ) || path.substr(0,1) == "/" ) ? path : ("/"+ path);
				
				return path;
			}
		};
	},
	
	'static': function() {
		var _instance;
		return {
			instance: function() {
				_instance = _instance || new Class.AppManifestConfig();
				return _instance;
			}
		};
	}
}),

AppInfo = Class({
	name: "AppInfo",
	parent: Class.IObject,
	constructor: function() {
		
		return {
			manifestVer2Higher: false,
		
			init: function() {
				
			}
		};
	},
	
	'static': function() {
		var _instance;
		return {
			instance: function() {
				_instance = _instance || new Class.AppInfo();
				return _instance;
			}
		};
	}
}),

PageView = Class({
	name: "PageView",
	parent: Class.UIView,
	constructor: function( element, options ) {
		var _url = options.url,
			_components = _url.split("/"),
			_fileName = _components[_components.length-1],
			_id = _fileName.toLowerCase(),
			_delegate = options.delegate,
			_interface,
			_title,
			_frame,
			_readyParams = new Parameters(),
			_params = new Parameters(),
			_htmlPath = "",
			_group = options.group,
			_context;
		
		return {
			url: "",
			
			actionType: "",
			orientation: "PORT", // PORT | LAND
			animation: TransitionType.UNSET,
			
			_readyParams: function() {
				return _readyParams;
			},
			
			_updatePage: function() {
				
				if ( ! _context.M ) {
					return;
				};
				
				var stackList = _context.M.page.info();
				for ( var i in stackList ) {
					var stack = stackList[i];
				    
				    _context.M.tool.log("--" + stack.key, {'tag':'M.tool.log', 'level':'LOG'});
				    
				    for ( var k in stack.tabs ) {
						var tab = stack.tabs[k];
						
						_context.M.tool.log("----" + tab.key, {'tag':'M.tool.log', 'level':'LOG'});
					}
				}
			},
			
			_delegate: function() {
				return _delegate;	
			},
			
			pageID: function() {
				return _id;
			},
			
			group: function() {
				return _group;
			},
			
			tabs: function() {
				return _group.tabs();
			},
			
			tabWithKey: function( key ) {
				var tabs = this.tabs();
				return tabs[key];
			},
		
			virtualInterface: function() {
				return _interface;	
			},
			
			htmlPath: function() {
				return _htmlPath;	
			},
			
			context: function() {
				return _context;	
			},
			
			title: function() {
				return _title;	
			},
			
			objectFromQueryString: function( queryString ) {
				var params = encodeURI( queryString.replace(/^\?/, '') );
				
				var re = /([^&=]+)=?([^&]*)/g;
				var decodeRE = /\+/g;  // Regex for replacing addition symbol with a space
				var decode = function (str) {return decodeURIComponent( str.replace(decodeRE, " ") );};
				var params = {}, e;
				
			    while ( e = re.exec(queryString) ) { 
			        var k = decode( e[1] ), v = decode( e[2] );
			        if (k.substring(k.length - 2) === '[]') {
			            k = k.substring(0, k.length - 2);
			            (params[k] || (params[k] = [])).push(v);
			        }
			        else params[k] = v;
			    }
			    
			    return params;
			},
			
			parameters: function() {
				if ( arguments.length == 0 ) {
					return _params;
				}
				
				var params = (typeof arguments[0] == "string") ? this.objectFromQueryString( arguments[0] ) : arguments[0];
				
				_params.params( params );
				_readyParams.params( params );
			},
			
			params: function(key, value) {
				//debug.log( "params", _params, key );
			
				if ( arguments.length == 2 ) {
					_params.set(key, value);
				}
				else if ( arguments.length == 1 ) {
					return _params.get(key);
				}
				
				return _params;
			},
			
			_init: function() {
				_interface = new WebInterface( _delegate, this );
				
				var self = this;
				
				_htmlPath = UIRealPath( options.url.replace( "/" + _fileName, '' ) );
				_context = window;
					
				$(function() {
					self.__ready();
				});
				
				return this;
			},
		
			init: function() {
				var self = this._super().init();
				
				if (self = this) {
					this._init();
				};
				return this;
			},
			
			onInitPage: function() {
				debug.log( this.name, "onInitPage");
				
				UINotification.defaultCenter.postNotification( UINotificationPageViewDidReady, {
					page:this
				});

				if ( typeof _context.onInitPage == "function") {
					_context.onInitPage.apply( _context.contentWindow );
				};
				
				this._updatePage();
			},
			
			onRestorePage: function() {
				debug.log( this.name, "onRestorePage");
			
				if ( typeof _context.onRestorePage == "function") {
					_context.onRestorePage.apply( _context.contentWindow );
				};
				
				this._updatePage();
			},
			
			onHidePage: function() {
				debug.log( this.name, "onHidePage");
			
				if ( typeof _context.onHidePage == "function") {
					_context.onHidePage.apply( _context.contentWindow );
				};
			},
			
			onDestroyPage: function() {
				debug.log( this.name, "onDestroyPage");
			
				if ( typeof _context.onDestroyPage == "function") {
					_context.onDestroyPage.apply( _context.contentWindow );
				};
			},
			
			onBack: function() {
				debug.log( this.name, "onBack");
			
				if ( _context.M && typeof _context.M.onBack == "function") {
					_context.M.onBack.apply( _context.contentWindow );
				}
				else {
					_delegate.back();
				};
			},
			
			// TODO: 호출 방식 필요
			onResume: function() {
				debug.log( this.name, "onResume");
			
				if ( typeof _context.onResume == "function") {
					_context.onResume.apply( _context.contentWindow );
				};
			},
			
			// TODO: 호출 방식 필요
			onPause: function() {
				debug.log( this.name, "onPause");
			
				if ( typeof _context.onPause == "function") {
					_context.onPause.apply( _context.contentWindow );
				};
			},
			
			onKey: function() {
				debug.log( this.name, "onKey");
			
				if ( typeof _context.onKey == "function") {
					_context.onKey.apply( _context.contentWindow );
				};
			},
			
			loadURL: function( url ) {
				debug.log( this.name, "loadURL", url );
						
				var resourcePath = _delegate.manifestConfig().path().resource;
				var that = this;
				
				this.url = url;
				this.path = url.replace( resourcePath, '' );
				
				UI.Notification.defaultCenter.postNotification( UINotificationPageViewDidLoadURL, {
					url:that.url,
					path:that.path
				} );
			
				this.attribute("src", this.url );
			},
			
			__back: function() {
				this.onBack();
			},
			
			__ready: function() {
				this.onInitPage();
			},
			
			__restore: function() {
				this.onRestorePage();	
			},
			
			__destory: function() {
				this.onDestroyPage();	
			},
			
			__hide: function() {
				this.onHidePage();	
			},
			
			destory: function() {
				this.__destory();
				this.remove();
			},
			
			reload: function() {
				var self = this;
				
				_context.location.reload(true);
			},
			
			remove: function() {
				this.element().remove();	
			},
			
			needsDisplay: function() {
				
			},
			
			transitionOptions: function( page, previousPage, animation, restore ) {
				var options = {};
				var deviceSize = Emulator.sharedInstance().deviceSize();
				var pageSize = this.size();
				
				//debug.log( "animationOptions", animation );
					
				switch( animation ) {
					case TransitionType.NONE:
						
						if ( restore == true ) {
							options.left = pageSize.width;
							options.onStart = function() {
								previousPage.element().style.left = 0;
								previousPage.element().style.top = 0;
							};
						}
						else {
							options.left = 0;	
						};
					
						break;
					
					case TransitionType.DEFAULT:	
					default:
					
						if ( restore == true ) {
							options.left = pageSize.width;
							options.onStart = function() {
								previousPage.element().style.left = -pageSize.width + "px";
								previousPage.element().style.top = 0;
							};
							options.onUpdate = function( ratio ) {
								previousPage.element().style.left = (page.position().x-pageSize.width) + "px";
							};
						}
						else {
							options.left = 0;
							options.onStart = function() {
								page.element().style.left = pageSize.width + "px";
							};
							options.onUpdate = function( ratio ) {
								previousPage.element().style.left = (page.position().x-pageSize.width) + "px";
							};
						};

					
						break;
					
					case TransitionType.DEFAULT:
					case TransitionType.SLIDE_LEFT:
					
						if ( restore == true ) {
							options.left = - pageSize.width;
							options.onStart = function() {
								previousPage.element().style.left = pageSize.width + "px";
								previousPage.element().style.top = 0;
							};
							options.onUpdate = function( ratio ) {
								previousPage.element().style.left = (pageSize.width+page.position().x) + "px";
							};
						}
						else {
							options.left = 0;
							options.onStart = function() {
								page.element().style.left = pageSize.width + "px";
							};
							options.onUpdate = function( ratio ) {
								previousPage.element().style.left = (page.position().x-pageSize.width) + "px";
							};
						};
					
						break;
					
					case TransitionType.SLIDE_RIGHT:
					
						if ( restore == true ) {
							options.left = pageSize.width;
							options.onStart = function() {
								previousPage.element().style.left = -pageSize.width + "px";
								previousPage.element().style.top = 0;
							};
							options.onUpdate = function( ratio ) {
								previousPage.element().style.left = (page.position().x-pageSize.width) + "px";
							};
						}
						else {
							options.left = 0;
							options.onStart = function() {
								page.element().style.left = - pageSize.width + "px";
							};
							options.onUpdate = function( ratio ) {
								previousPage.element().style.left = (pageSize.width+page.position().x) + "px";
							};
						};
					
						break;
					
					case TransitionType.SLIDE_TOP:
					
						if ( restore == true ) {
							options.top = pageSize.height;
							options.onStart = function() {
								previousPage.element().style.left = 0;
								previousPage.element().style.top = pageSize.height + "px";
							};
							
							options.onUpdate = function( ratio ) {
								previousPage.element().style.top = (page.position().y - pageSize.height) + "px";
							};
						}
						else {
							options.top = 0;
							options.onStart = function() {
								page.element().style.top = pageSize.height + "px";
							};
							
							options.onUpdate = function( ratio ) {
								previousPage.element().style.top = (page.position().y - pageSize.height) + "px";
							};
						};
					
						break;
					
					case TransitionType.SLIDE_BOTTOM:
					
						if ( restore == true ) {
							options.top = -pageSize.height;
							options.onStart = function() {
								previousPage.element().style.left = 0;
								previousPage.element().style.top = -pageSize.height + "px";
							};
							
							options.onUpdate = function( ratio ) {
								previousPage.element().style.top = (pageSize.height+page.position().y) + "px";
							};
						}
						else {
							options.top = 0;
							options.onStart = function() {
								page.element().style.top = -pageSize.height + "px";
							};
							
							options.onUpdate = function( ratio ) {
								previousPage.element().style.top = (pageSize.height+page.position().y) + "px";
							};
						};
					
						break;
					
					case TransitionType.MODAL_LEFT:
					
						if ( restore == true ) {
							options.left = pageSize.width;
							options.onStart = function() {
								previousPage.element().style.left = 0;
								previousPage.element().style.top = 0;
							};
						}
						else {
							options.left = 0;
							options.onStart = function() {
								page.element().style.left = pageSize.width + "px";
							};
						};
					
						break;
					
					case TransitionType.MODAL_RIGHT:
					
						if ( restore == true ) {
							options.left = -pageSize.width;
							options.onStart = function() {
								previousPage.element().style.left = 0;
								previousPage.element().style.top = 0;
							};
						}
						else {
							options.left = 0;
							options.onStart = function() {
								page.element().style.left = -pageSize.width + "px";
							};
						};
					
						break;
						
					case TransitionType.MODAL_UP:
					
						if ( restore == true ) {
							options.top = -pageSize.height;
							options.onStart = function() {
								previousPage.element().style.top = 0;
								previousPage.element().style.left = 0;
							};
						}
						else {
							options.top = 0;
							options.onStart = function() {
								page.element().style.top = pageSize.height + "px";
							};
						};
					
						break;
					
					case TransitionType.MODAL_DOWN:
					
						if ( restore == true ) {
							options.top = pageSize.height;
							options.onStart = function() {
								previousPage.element().style.top = 0;
								previousPage.element().style.left = 0;
							};
						}
						else {
							options.top = 0;
							options.onStart = function() {
								page.element().style.top = -pageSize.height + "px";
							};
						};
					
						break;
						
					case TransitionType.FADE:
					
						if ( restore == true ) {
							options.opacity = 0;
							options.onStart = function() {
								
							};
						}
						else {
							options.opacity = 1;
							options.onStart = function() {
								page.element().style.opacity = 0;
							};
						};
					
						break;
						
					case TransitionType.ZOOM_IN:
					
						if ( restore == true ) {
							options.scale = 0;
							options.onStart = function() {
								
							};
						}
						else {
							options.scale = 1;
							options.onStart = function() {
								page.scale(0)
							};
						};
					
						break;
						
					case TransitionType.ZOOM_OUT:
					
						if ( restore == true ) {
							options.scale = 2;
							options.onStart = function() {
								
							};
						}
						else {
							options.scale = 1;
							options.onStart = function() {
								page.scale(2)
							};
						};
					
						break;
				};
				
				return options;
			},
			
			transition: function( animationKey, options ) {
			
				var animation = options.animation, 
					previousPage = options.previousPage,
					callback = options.callback,
					force = options.callback;
			
				if ( animationKey == "addPage" ) {
					this.animation = animation;
					previousPage.animation = animation;
				
					var project = _delegate;
					var page = this;
					var duration = ( animation == TransitionType.NONE ) ? 0 : 0.3;
					var transitionOptions = this.transitionOptions( page, previousPage, animation );
					
					transitionOptions.onComplete = function() {
					
						if ( options.onComplete ) {
							options.onComplete.apply( project );
						};
					};
					
					page.animate(duration, transitionOptions);
				}
				else if ( animationKey == "removePage" ) {
				
					animation = animation || page.animation;
					
					var project = _delegate;
					var page = this;
					var duration = ( animation == TransitionType.NONE ) ? 0 : 0.3;
					var transitionOptions = this.transitionOptions( this, previousPage, animation, true );
					
					transitionOptions.onComplete = function() {
						
						if ( options.onComplete ) {
							options.onComplete.apply( project );
						};
					};
					
					page.animate(duration, transitionOptions);
				}
			},
			
			vibration: function(ms) {
				
				ms = ms || 1000;
				
				var $element = $(this.element());
				var isVibation = false;
				var isLeft = false;
				var yoyo = function() {
					var left = isLeft ? -2 : 2; 
					$element.css("left", left);
					isLeft = isLeft ? false : true;
					ms -= 30;
					
					return ( ms < 0 ) ? false : true;
				};
				
				var vibration = function() {
					
					setTimeout( function() {
						if ( yoyo() ) {
							vibration();
						}
						else {
							$element.css("left", 0);
						}
					}, 30);
				};
				
				vibration();
			}
		};
	}
}),

Web = Class({
	name:"Web",
	parent:Class.IObject,
	constructor:function( rootPath, resourcePath ) {
		var _page;
		var _manifestConfig;
		var _license;
		var _rootPath = rootPath;
		var _resourcePath = resourcePath || "/res";
	
		return {
			init: function() {
				
				var self = this._super().init();
				if (self) {
					_page = new PageView( document.body, {
						url: location.href,
						index: 0,
						group: {},
						delegate : this
					} );
					
					var interfaceData = window.__WEB_INTERFACE_DATA__ || {};
					var params = {};
					
					if ( interfaceData["param"] != undefined ) {
						var paramsString = interfaceData["param"];
					
						if ( typeof paramsString == "string" && paramsString != "" ) {
							if ( paramsString.charAt(0) == '{' ) {
								params = JSON.parse(paramsString);
							}
							else {
								params = decodeURI(paramsString);
							}
						}
					};
					
					_page.parameters( params );
					
					Web.instance = this;
				}
				return this;
			},
			
			checkValidLicense: function() {
				_license = new License();
			
				return true;
			},
			
			license: function() {
				return _license;	
			},
			
			manifestConfig: function() {
				return _manifestConfig;
			},
			
			loadManifestFile: function() {
				var manifestPath = _resourcePath;
				var manifestVer2Higher = true;
				var manifestEncode = false;
			
				var manifestConfig = AppManifestConfig.instance();
				manifestConfig.configure( _rootPath, manifestPath, true );	// configAppManifestPath
				manifestConfig.make( manifestEncode );			// configuration
				
				_manifestConfig = manifestConfig;
			},
			
			_convertToRsourceURL: function( path ) {
				var manifest = AppManifestConfig.instance(),
					url;
				
				if ( path.toLowerCase().indexOf("http://") != -1 ||
					path.toLowerCase().indexOf("https://") != -1 || 
					path.toLowerCase().indexOf("file://") != -1 ) {
					
					url = path;
				}
				else {
					if ( path.substr(0,1) == "/" ) {
						
						if ( manifest.path().baseURL != "" ) {
							url = manifest.path().baseURL + path;
						}
						else {
							url = manifest.path().document + path;
						}
					}
					else {
						var currentPage = this.currentPage();
						var htmlPath = currentPage.htmlPath();
						
						if ( htmlPath && ( htmlPath.indexOf("http://") != -1 || htmlPath.indexOf("https://") != -1 ) ) {
							url = htmlPath + "/" + path;
						}
						else {
							url = htmlPath + "/" + path;
						}
					}
				}
				
				return UIRealPath(url);
			},
			
			back: function( options ) {
				
				history.back();
			},
			
			openPage: function( options ) {
				debug.log( this.name, "openPage", arguments );
			
				var path = options.url || "",
					parameters = options.parameters || {},
					actionType = options.actionType || "",
					animation = options.animation || TransitionType.SLIDE_LEFT,
					orientation = options.orientation || "PORT",
					url = this._convertToRsourceURL( path );
				
				url = url.replace('.html', '.wa');
				url += ( url.indexOf('?') !== -1 ) ? "&" : "?";
				
				var paramString = ( typeof parameters == "object" ) ? JSON.stringify(parameters) : parameters;
				
				var params = [];
				params.push("param=" + encodeURIComponent(paramString) );
				params.push("actionType=" + actionType );
				params.push("animation=" + animation );
				params.push("orientation=" + orientation );
				
				url += params.join("&");
				
				location.href = url;
			},
			
			openStartPage: function() {
				var manifest = _manifestConfig.manifest();
				var path = _manifestConfig.startPagePath();
				var params = {};
				
				this.openPage({
					url: path,
					parameters: params
				});
			},
			
			initialize: function() {
				if ( ! this.checkValidLicense() ) {
					console.error( "License Error ");
				}
				
				this.loadManifestFile();
			},
			
			currentPage: function() {
				return _page;	
			},
		
			virtualInterfaceWithContext: function( context ) {
				return _page.virtualInterface();	
			}
		}
	}
});

window.Web = Web;
	
})(window);