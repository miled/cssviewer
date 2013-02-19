/*!
* CSSViewer, A Google Chrome Extension for fellow web developers, web designers, and hobbyists.
* https://github.com/cssviewer/cssviewer
* https://chrome.google.com/webstore/detail/cssviewer/ggfgijbpiheegefliciemofobhmofgce
*
* This source code is licensed under the GNU General Public License,
* Version 2. See the file COPYING for more details.
*/

/*
* Inject cssviewer.js/cssviewer.css into the current page
*/
chrome.browserAction.onClicked.addListener(function(tab) {
	if( tab.url.indexOf("https://chrome.google.com") == 0 || tab.url.indexOf("chrome://") == 0 ) {
		alert( "CSSViewer doesn't work on Google Chrome webstore!" );

		return;
	}

	chrome.tabs.executeScript(tab.id, {file:'js/cssviewer.js'});
	chrome.tabs.insertCSS(tab.id, {file:'css/cssviewer.css'});
});
