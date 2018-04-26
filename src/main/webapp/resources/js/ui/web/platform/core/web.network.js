/*!
 * Web - Network Manager
 *
 * Date: 2014-03-14
 */
 
(function(window, undefined) {
	

var

ERROR_MESSAGE = "데이터를 처리하는 중 에러가 발생하였습니다.",

Class = UI.Class,
IObject = Class.IObject,

Request = Class({
	name: "Request",
	parent: IObject,
	constructor: function() {
	
		var _header = new UI.DataMap();
		var _head = new UI.DataMap();
		var _body = new UI.DataMap();
		
		return {
			init: function() {
			
				_head.put("device_id", "");
				_head.put("device_md", "iPhone");
				
				_head.put("callback_request_data_flag", "");
				
				_head.put("phone_no", "");
				
				_head.put("screen_id", "");
				_head.put("system_name", "Browser Emulator");
				_head.put("system_version", "1.0.0");
				
				return this;	
			},
			
			license: function( license ) {
			
				var appID = license.appID();
			
				_head.put("app_id", appID);
				_head.put("app_name", "");
				_head.put("app_version", "");
			},
		
			header: function() {
				if ( arguments.length == 2 ) {
					var key = arguments[0],
						value = arguments[1];
						
					_header.put(key, value);
				}
				else if ( arguments.length == 1 ) {
					if ( typeof arguments[0] == "string" ) {
						var key = arguments[0];
						return _header.get(key);
					}
					else if ( typeof arguments[0] == "object" ) {
						var headers = arguments[0];
					
						for ( var key in headers ) {
							_header.put(key, headers[key]);
						};
					}
				}
				
				return _header;
			},
			
			head: function() {
				if ( arguments.length == 2 ) {
					var key = arguments[0],
						value = arguments[1];
						
					_head.put(key, value);
				}
				else if ( arguments.length == 1 ) {
					if ( typeof arguments[0] == "string" ) {
						var key = arguments[0];
						return _head.get(key);
					}
					else if ( typeof arguments[0] == "object" ) {
						var headers = arguments[0];
					
						for ( var key in headers ) {
							_head.put(key+"", headers[key]+"");
						};
					}
				}
				
				return _head;
			},
			
			body: function() {
				if ( arguments.length == 2 ) {
					var key = arguments[0],
						value = arguments[1];
						
					_body.put(key, value);
				}
				else if ( arguments.length == 1 ) {
					if ( typeof arguments[0] == "string" ) {
						var key = arguments[0];
						return _body.get(key);
					}
					else if ( typeof arguments[0] == "object" ) {
						var body = arguments[0];
					
						for ( var key in body ) {
							_body.put(key+"", body[key]);
						};
					}
				}
				
				return _body;
			},
			
			data: function() {
				var data = {
					"head":_head.data(),
					"body":_body.data()
				};
				
				var jsonData = JSON.stringify(data);
				
				return jsonData;
			},
			
			escapeUsingEncoding: function( encoding ) {
				var params = [];
			
				for ( var key in _body ) {
					var param = key + "=" + _body[key];
					params.push(param);
				}
				
				return params.join("&");
			}
		};
	}
}),

Provider = Class({
	name: "Provider",
	parent: IObject,
	constructor: function() {
		var _xhr = function() {
			if (window.XMLHttpRequest) {
				return new XMLHttpRequest();
			}
			
			return new ActiveXObject("Microsoft.XMLHTTP");
		}();
		
		var _request = new Request(),
			_timeout = -1,
			_contentType = "TEXT",
			_encoding = "UTF-8",
			_userData,
			_delegate;
		
		return {
			
			init: function() {
				
				return this;	
			},
			
			request: function() {
				return _request;	
			},
		
			load: function( url, type, options ) {
				//console.log( "url", arguments, _timeout );
			
				var 
				data = options.data || {},
				type = type.toUpperCase() || "POST",
				async = options.async || true,
				username = undefined,
				password = undefined,
				provider = this;
				
				try {
					
					_xhr.open(type, url, async, username, password);
					
					_request.header().each( function( key, value, index ) {
						_xhr.setRequestHeader(key, value);
					});
					
					_xhr.onreadystatechange = function(e) {
						if ( _xhr.readyState == 4 ) {
							debug.log( "xhr", _xhr );
						
							if ( _xhr.status == 200 || _xhr.status == 0 ) {
								var body;
							
								if ( _contentType == "JSON" ) {
									try {
										body = ( typeof _xhr.responseText == "string" )? JSON.parse( _xhr.responseText ) : _xhr.responseText;
									}
									catch(e) {
									
										_delegate.didFailProvider.call( _delegate, provider, "Parse Error", _userData );
										
										return;
									}
								}
								else if ( _contentType == "XML" ) {
									body = _xhr.responseXML;
								}
								else {
									body = _xhr.responseText;
								}
								
								//console.log( "xhr received data", body );
								
								_delegate.didFinishProvider.call( _delegate, provider, _request.header().data(), body, _encoding, _userData );
							}
							else {
								
								_delegate.didFailProvider.call( _delegate, provider, "Server Error ("+_xhr.status+")", _userData );
							}
						}
					};
					
					_xhr.send( data || null );
					
					//console.log( "xhr url", url)
					//console.log( "xhr header", _request.header().data() );
					//console.log( "xhr send data", _request.data() );
				
				} catch(e) {
					console.error( e );
				
					_delegate.didFailProvider.call( _delegate, provider, e.message, _userData );
				}
			},
			
			contentType: function( contentType ) {
				_contentType = contentType;	
			},
			
			encoding: function( encoding ) { 
				_encoding = encoding;
			},
			
			timeout: function( timeout ) {				
				_timeout = ( isNaN(parseInt(timeout) ) ) ? -1 : parseInt(timeout);
			},
			
			userData: function( userData ) {
				_userData = userData;
			},
			
			delegate: function( delegate ) {
				_delegate = delegate;	
			},
		};
	}
}),

NetworkManager = Class({
	name: "NetworkManager",
	parent: IObject,
	constructor: function() {
	
		return {
			checkManager: function( option ) {
				//TODO
				return true;	
			},
			
			configuration: function( info ) {
				
			}
		}	
	}
}),

HttpFileNetworkManager = Class({
	name: "HttpFileNetworkManager",
	parent: NetworkManager,
	constructor: function() {
		var 
		
		MULTIPART_TIMEOUT 		= 10,
		MULTIPART_NAME_KEY      = "name",
		MULTIPART_FILENAME_KEY  = "filename",
		MULTIPART_FILEPATH_KEY  = "localpath",
	
		_config = {
			url: "",
			resourceUpdateURI: "",
			encoding: "UTF-8",
			timeout: -1
		};
	
		return {
			
			/*
			checkManager: function( option ) {
				//TODO
				return true;
			},
			*/
			
			didFailProvider: function( provider, error, userData ) {
				console.error( arguments );	
			},
			
			didFinishProvider: function( provider, header, body, encoding, userData ) {
				console.log( arguments );
			},
			
			process: function( page, url, parameters, files, delegate, wait, progress, userData, headerData, encoding ) {
				
				var 
				provider = new Provider(),
				request = provider.request(),
				type = "POST";
				
				// TODO: MEMORY CHECK
				
				provider.timeout( MULTIPART_TIMEOUT );
				provider.delegate( this );
				
				
				var encodedString = request.escapeUsingEncoding( encoding );
				var requestString = encodedString + "&in=" + _config.encoding;
				
				if ( networkOption.get("encrypt") ) {
					// TODO: 암호화가 필요한 경우
				};
				
				if (_config.resourceUpdateURI && networkOption.get("restAction") ) {
			        if (type == "PUT" || type == "POST") {
						
		            }
			    }
			    else {
					
			    }
			    
			    if (_config.resourceUpdateURI && networkOption.get("restAction") ) {
			        request.header().put( "Accept", "application/json" );
			        request.header().put( "Content-Type", "application/json; charset=" + _config.encoding );
			    }
			    else {
			    	request.header().put( "Content-Type", "application/x-www-form-urlencoded; charset=" + _config.encoding );
			    	request.header().put( "user_data_type", "json" );
			    	request.header().put( "user_com_code", trCode );
			    	request.header().put( "user_data_enc", networkOption.get("encrypt") === true ? "y" : "n" );
			    	request.header().put( "service_code", networkOption.get("dummy") === true ? "dummy" : "" );
			    }
			    
			    provider.timeout( networkOption.get("timeout") );
			    provider.userData( userData );
			    provider.delegate( this );
				provider.load(url, type, {
					data: request.data()
				});
			}
		};
	}
}),

HttpDataNetworkManager = Class({
	name: "HttpDataNetworkManager",
	parent: NetworkManager,
	constructor: function() {
		var 
			CONFIG_URL_KEY = "http-connection-url";
			CONFIG_TIMEOUT_KEY = "http-network-timeout";
			CONFIG_ENCODING_KEY = "http-encoding";
			CONFIG_REST_RSC_UPDATE_URI = "http-resource-update-uri",
			
			_config = {
				url: "",
				resourceUpdateURI: "",
				encoding: "UTF-8",
				timeout: -1
			};
	
		return {
			
			/*
			checkManager: function( option ) {
				//TODO
				return true;
			},
			*/
			
			didFailProvider: function( provider, errormsg, callArgs ) {
				var 
				page = callArgs[0], 
				trCode = callArgs[1], 
				data = callArgs[2], 
				networkOption = callArgs[3], 
				delegate = callArgs[4], 
				userInfo = callArgs[5],
				jsonUserData = JSON.stringify(networkOption.get("jsonUserData"));
				
				delegate.didFailNetworkManager.call( delegate, this, networkOption.get("targetServer"), trCode, networkOption.get("tagId"), jsonUserData, "-1", errormsg, userInfo );
			},
			
			didFinishProvider: function( provider, header, body, encoding, callArgs ) {
				
				var 
				dataType,
				dataBody,
				page = callArgs[0], 
				trCode = callArgs[1], 
				data = callArgs[2], 
				networkOption = callArgs[3], 
				delegate = callArgs[4], 
				userInfo = callArgs[5],
				jsonUserData = JSON.stringify(networkOption.get("jsonUserData"));
				
				if ( _config.resourceUpdateURI && networkOption.get("restAction") ) {
					dataType = "JSON";
				}
				
				try {
					// TODO: encoding
				
					dataBody = ( typeof body == "string" )? JSON.parse( body ) : body;
				}
				catch(e) {
					delegate.didFailNetworkManager.call( delegate, this, networkOption.get("targetServer"), trCode, networkOption.get("tagId"), jsonUserData, ERROR_MESSAGE, "-1", userInfo );
					return;
				}
				
				if ( dataBody.head.result_code === 200 ) {
					var callbackFunc = ( networkOption.get("cbfunc") == "" ) ? "CBResponseData" : networkOption.get("cbfunc");
				
					delegate.didFinishNetworkManager.call( delegate, this, networkOption.get("targetServer"), trCode, JSON.stringify(dataBody.body), callbackFunc, networkOption.get("tagId"), jsonUserData, userInfo );
				}
				else {
					
					delegate.didFailNetworkManager.call( delegate, this, networkOption.get("targetServer"), trCode, networkOption.get("tagId"), jsonUserData, dataBody.head.result_code, dataBody.head.result_msg, userInfo );
				}
			},
			
			configuration: function( info ) {
				_config.url = info.get(CONFIG_URL_KEY);
				_config.encoding = info.get(CONFIG_ENCODING_KEY);
				_config.timeout = parseInt( info.get(CONFIG_TIMEOUT_KEY) ) / 1000;
				_config.resourceUpdateURI = info.get(CONFIG_REST_RSC_UPDATE_URI);
				
				//debug.log( "_config", _config );
			},
			
			process: function( page, trCode, data, networkOption, delegate, userInfo ) {
				
				var retargetURL = networkOption.get("retargetURL"),
					url = ( ! retargetURL ) ? _config.url : retargetURL,
					//dateType = "JSON",
					provider = new Provider(),
					request = provider.request(),
					type = "POST",
					userData = arguments;
					
					request.license( page._delegate().license() );
				
				if ( _config.resourceUpdateURI && networkOption.get("restAction") ) {
					var hasSlashSuffix = url.substr(url.length-1) === '/',
						hasSlashPrefix = trCode.substr(0,1) === '/';
						
						//debug.log( url, trCode, "hasSlashSuffix", hasSlashSuffix, "hasSlashPrefix", hasSlashPrefix );
					
					var restURL;
					
					if ( !retargetURL ) {
						if ( hasSlashSuffix || hasSlashPrefix ) {
							restURL = url + trCode;
						}
						else {
							restURL = url + "/" + trCode;
						}
					}
					else {
						restURL = retargetURL;
					}
					
					url = restURL;
					type = networkOption.get("restAction");
				}
				
				if ( networkOption.get("jsonUserData") ) {
					var networkUserData = networkOption.get("jsonUserData");
					
					if ( networkUserData.action && networkUserData.service_id ) {
						request.head({
							"action": networkUserData.action,
							"service_id": networkUserData.service_id
						});
						
					}
				}
				
				var encodedString = request.escapeUsingEncoding( _config.encoding );
				var requestString = encodedString + "&in=" + _config.encoding;
				
				if ( networkOption.get("encrypt") ) {
					// TODO: 암호화가 필요한 경우
				};
				
				if (_config.resourceUpdateURI && networkOption.get("restAction") ) {
			        if (type == "PUT" || type == "POST") {
						
		            }
			    }
			    else {
					
			    }
			    
			    if (_config.resourceUpdateURI && networkOption.get("restAction") ) {
			        request.header().put( "Accept", "application/json" );
			        request.header().put( "Content-Type", "application/json; charset=" + _config.encoding );
			    }
			    else {
			    	request.header().put( "Content-Type", "application/x-www-form-urlencoded; charset=" + _config.encoding );
			    	request.header().put( "user_data_type", "json" );
			    	request.header().put( "user_com_code", trCode );
			    	request.header().put( "user_data_enc", networkOption.get("encrypt") === true ? "y" : "n" );
			    	request.header().put( "service_code", networkOption.get("dummy") === true ? "dummy" : "" );
			    }
			    
			    // Head
			    // TODO: cate_cd 값(?)
			    
				request.head().put("callback_function", networkOption.get("cbfunc") );
			    
			    // Body
			    var objData = JSON.parse( data );
			    
			    request.body( objData );
			    
			    var requestData = request.data();
			    
			    //console.log( "requestData", requestData );
			    
			    //provider.contentType ( dateType );
			    
			    provider.timeout( networkOption.get("timeout") );
			    provider.userData( userData );
			    provider.delegate( this );
				provider.load(url, type, {
					data: requestData
				});
			}
		};
	}
}),

SocketDataNetworkManager = Class({
	name: "SocketDataNetworkManager",
	parent: NetworkManager,
	constructor: function() {
	
		var 
			CONFIG_HOST_KEY      = "socket-connection-address",
			CONFIG_PORT_KEY      = "socket-connection-port",
			CONFIG_TIMEOUT_KEY   = "socket-network-timeout",
			CONFIG_ENCODING_KEY  = "socket-encoding",
			
			_host,
			_post,
			_encoding,
			_timeout;
	
		return {
			initProvider: function() {
					
			},
		
			configuration: function( info ) {
				_host = info.get(CONFIG_HOST_KEY);
				_post = info.get(CONFIG_PORT_KEY);
				_encoding = info.get(CONFIG_ENCODING_KEY);
				_timeout = info.get(CONFIG_TIMEOUT_KEY);
				
				this.initProvider();
			},
			
			/*
			checkManager: function( option ) {
				//TODO
				return true;
			},
			*/
				
			process: function( page, trCode, data, networkOption, delegate, userInfo ) {
				
				var retargetURL = networkOption.get("retargetURL");
				var url = ( ! retargetURL ) ? _url : retargetURL;
				
				
				
						
				/*
				var ajax = new Ajax();
				ajax.load({
					url: network.option("connectionURL"),
					trcode: network.option("trcode"),
					type: network.option("type")
				});
				*/
			}
		};
	}
}),

NetworkOption = Class({
	name:"NetworkOption",
	constructor: function() {
		var _options = {
			cbFunc: undefined,
			dummy: false,
			encrypt: false,
			indicator: false,
			indicatorMessage: "",
			retargetURL: "",
			calcelable: false,
			targetServer: undefined,
			timeout: -1,
			
			/* only socket network use */
			restTemplete: undefined,
			tagId: undefined, // uitag?
			startTr: false,
			jsonUserData: {},
			
			cbfunc: undefined,
			
			/* only http rest use */
			restAction: "POST"
		};
		
		return {
			get: function( key ) {
				return _options[key];	
			},
		
			options: function( options ) {
				// TODO : 값 타입 체크 
			
				for ( var key in _options ) {
					if ( options[key] != undefined ) {
						_options[key] = options[key];
					}
				}
			}
		};
	}
}),

Network = Class({
	name: "Network",
	parent: IObject,
	constructor: function() {
	
		var _pool = {};
		
		return {
			init: function() {
				_pool = {};
			},
			
			managerForKey: function( key ) {
				var manager = _pool[key];
				if ( ! manager ) {
					var networkSetting = Class.AppManifestConfig.instance().networkSetting( key );
					if ( ! networkSetting ) {
						return;
					}
					
					var className = networkSetting.get("http-network-manager").split(".");
					className = ( className.length > 0 ) ? className[className.length-1] : "";
					
					if ( ! className ) {
						className = networkSetting.get("socket-network-manager").split(".");
						className = ( className.length > 0 ) ? className[className.length-1] : "";
					}
					
					var networkManager = Class[className] || Class.HttpDataNetworkManager;
					
					manager = new networkManager();
					manager.configuration( networkSetting );
				}
				return manager;
			}
		};
	},
	
	'static': function() {
		var _instance;
		return {
			instance: function() {
				_instance = _instance || new Class.Network();
				return _instance;
			}
		};
	}
});
	
})(window);