
(function( window, undefined ) {

//Debug.enabled = true;
//Debug.type( "console" );

var contextRoot = window.__WEB_ROOT__ || undefined;
var resourcePath = window.__WEB_INTERFACE_ROOT__ || undefined;

var web = new Web( contextRoot, resourcePath );
var webInterface = web.virtualInterfaceWithContext(window);
webInterface.scheme( "officeu" );
/*
webInterface.marketLinks({
	ios: "itms-services://?action=download-manifest&url=http://docs.morpheus.kr/download/distributes/office_u/ios/office_u.plist",
	android: "http://docs.morpheus.kr/download/distributes/office_u/android/office_u_2.2.00.apk"
});
*/
webInterface.marketLinks({
	ios: "http://docs.morpheus.kr/download/",
	android: "http://docs.morpheus.kr/download/"
});

web.initialize();

})(window);