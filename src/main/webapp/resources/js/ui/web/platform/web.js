/*!
 * Morpheus 2.0 Library
 * http://www.morpheus.kr
 *
 * Copyright 2014 Uracle Co., Ltdocument. 
 * 166 Samseong-dong, Gangnam-gu, Seoul, 135-090, Korea All Rights Reserved.
 *
 * Date: 2014-03-14
 * Build: 2.0.1(5)
 */
 
window.Debug.enabled = false;

// Load wnInterface File
(function( window, undefined ) {

var 
thisFileName = "web.js",
includeFiles = [,
	"core/web.core.js",
	"core/web.interface.js",
	"core/web.network.js",
	"web.execute.js"
];

UI.ScriptLoader.writeScript( includeFiles, UI.ScriptLoader.scriptPath(thisFileName));

})(window);
