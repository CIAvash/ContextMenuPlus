var contextMenu = require("context-menu");
var tabs = require("tabs");
let clipboard = require("clipboard");
var selection = require("selection");
const { Hotkey } = require("hotkeys");
const data = require("self").data;
const prefs = require("simple-prefs");
var db = require("simple-storage");

exports.main = function (options, callbacks) {

if(!db.storage.hotkeys){
	db.storage.hotkeys = {
		ptextAndPtitleHotkey:prefs.prefs['ptextAndPtitleHotkey'],
		copyPageURLHotkey:prefs.prefs['copyPageURLHotkey']
	};
}

function copyPageTitle(prefName) {
	if(prefs.prefs[prefName]) {
		copyPageTitleItem = contextMenu.Item({
		  label: "Copy Page Title",
		  contentScript: 'self.on("click", function (node, data) {' +
				         '  self.postMessage(document.title);' +
				         '});',
		  onMessage: function (ptitle) {
					clipboard.set(ptitle);
		  }
		});
	} else {
		copyPageTitleItem.destroy();
	}
}

function copyPageURL(prefName) {
	if(prefs.prefs[prefName]) {
		copyPageURLItem = contextMenu.Item({
		  label: "Copy Page URL",
		  contentScript: 'self.on("click", self.postMessage);',
		  onMessage: function () {
					clipboard.set(tabs.activeTab.url.toString());
		  }
		});
	} else {
		copyPageURLItem.destroy();
	}
}

function copyPageTitleAndURL(prefName) {
	if(prefs.prefs[prefName]) {
		copyPageTitleAndURLItem = contextMenu.Item({
		  label: "Copy Page Title and URL",
		  contentScript: 'self.on("click", function (node, data) {' +
		  				 '	if(document.title && document.URL) {' +
		  				 '		var titleURL = document.title + "\\r\\n" + document.URL;' +
				         '  	self.postMessage(titleURL);' +
				         '}});',
		  onMessage: function (titleURL) {
					clipboard.set(titleURL);
		  }
		});
	} else {
		copyPageTitleAndURLItem.destroy();
	}
}

function copyTitleAndURLOfAllTabs(prefName) {
	if(prefs.prefs[prefName]) {
		copyTitleAndURLOfAllTabsItem = contextMenu.Item({
		  label: "Copy Title & URL of all Tabs",
		  contentScript: 'self.on("click", self.postMessage);',
		  onMessage: function () {
		  			var tabsList = "";
		  			for each (var tab in tabs) {
		  				 if(tab.title && tab.url) {
		  				 	tabsList += tab.title + "\r\n" + tab.url + "\r\n\r\n";
		  				 }
		  			}
					clipboard.set(tabsList);
		  }
		});
	} else {
		copyTitleAndURLOfAllTabsItem.destroy();
	}
}

function copyAsHTMLLink(prefName) {
	if(prefs.prefs[prefName]) {
		copyAsHTMLLinkItem = contextMenu.Item({
		  label: "Copy as HTML Link",
		  contentScript: 'self.on("click", function (node, data) {' +
		  				 '	if(document.title && document.URL) {' +
		  				 "		var link = '<a href=\"' + document.URL + '\">' + document.title + '</a>';" +
				         '  	self.postMessage(link);' +
				         '}});',
		  onMessage: function (link) {
					clipboard.set(link);
		  }
		});
	} else {
		copyAsHTMLLinkItem.destroy();
	}
}

function copyAsLink(prefName) {
	if(prefs.prefs[prefName]) {
		copyAsLinkItem = contextMenu.Item({
		  label: "Copy as Link",
		  contentScript: 'self.on("click", function (node, data) {' +
		  				 '	if(document.title && document.URL) {' +
		  				 "		var link = '<a href=\"' + document.URL + '\">' + document.title + '</a>';" +
				         '  	self.postMessage(link);' +
				         '}});',
		  onMessage: function (link) {
					clipboard.set(link, 'html');
		  }
		});
	} else {
		copyAsLinkItem.destroy();
	}
}

function openPageHostname(prefName) {
	if(prefs.prefs[prefName]) {
		openPageHostnameItem = contextMenu.Item({
		  label: "Open Page Hostname",
		  contentScript: 'self.on("click", function (node, data) {' +
		  				 'if(window.location.hostname !== "") {' +
				         'self.postMessage(window.location.protocol + "//" + window.location.hostname + "/");' +
				         '}});',
		  onMessage: function (hostname) {
		  			tabs.open(hostname);
		  }
		});
	} else {
		openPageHostnameItem.destroy();
	}
}

function copyAsPlainText(prefName) {
	if(prefs.prefs[prefName]) {
		copyAsPlainTextItem = contextMenu.Item({
		  label: "Copy as Plain Text",
		  context: contextMenu.SelectionContext(),
		  contentScript: 'self.on("click", function (node, data) {' +
				         '  self.postMessage(window.getSelection().toString());' +
				         '});',
		  onMessage: function (text) {
					clipboard.set(text.trim());
		  }
		});
	} else {
		copyAsPlainTextItem.destroy();
	}
}

function copySelectionAsHTMLLink(prefName) {
	if(prefs.prefs[prefName]) {
		copySelectionAsHTMLLinkItem = contextMenu.Item({
		  label: "Copy as HTML Link",
		  context: contextMenu.SelectionContext(),
		  contentScript: 'self.on("click", function (node, data) {' +
		  				 '	if(document.URL) {' +
		  				 "		var link = '<a href=\"' + document.URL + '\">' + window.getSelection().toString().trim() + '</a>';" +
				         '  	self.postMessage(link);' +
				         '}});',
		  onMessage: function (link) {
					clipboard.set(link);
		  }
		});
	} else {
		copySelectionAsHTMLLinkItem.destroy();
	}
}

function copySelectionAsLink(prefName) {
	if(prefs.prefs[prefName]) {
		copySelectionAsLinkItem = contextMenu.Item({
		  label: "Copy as Link",
		  context: contextMenu.SelectionContext(),
		  contentScript: 'self.on("click", function (node, data) {' +
		  				 '	if(document.URL) {' +
		  				 "		var link = '<a href=\"' + document.URL + '\">' + window.getSelection().toString().trim() + '</a>';" +
				         '  	self.postMessage(link);' +
				         '}});',
		  onMessage: function (link) {
					clipboard.set(link, 'html');
		  }
		});
	} else {
		copySelectionAsLinkItem.destroy();
	}
}

function copyAsHTML(prefName) {
	if(prefs.prefs[prefName]) {
		copyAsHTMLItem = contextMenu.Item({
		  label: "Copy as HTML",
		  context: contextMenu.SelectionContext(),
		  contentScript: 'self.on("click", self.postMessage);',
		  onMessage: function () {
		  			if(selection.html) {
						clipboard.set(selection.html.trim());
					}
		  }
		});
	} else {
		copyAsHTMLItem.destroy();
	}
}

function copyTextAndURL(prefName) {
	if(prefs.prefs[prefName]) {
		copyTextAndURLItem = contextMenu.Item({
		  label: "Copy Text and URL",
		  context: contextMenu.SelectionContext(),
		  contentScript: 'self.on("click", function (node, data) {' +
		  				 '	if(document.URL) {' +
		  				 '		var textURL = window.getSelection().toString().trim() + "\\r\\n" + document.URL;' +
				         '  	self.postMessage(textURL);' +
				         '}});',
		  onMessage: function (textURL) {
					clipboard.set(textURL);
		  }
		});
	} else {
		copyTextAndURLItem.destroy();
	}
}

function copyLinkText(prefName) {
	if(prefs.prefs[prefName]) {
		copyLinkTextItem = contextMenu.Item({
		  label: "Copy Link Text",
		  context: contextMenu.SelectorContext("a[href]"),
		  contentScript: 'self.on("click", function (node, data) {' +
				         '  self.postMessage(node.textContent);' +
				         '});',
		  onMessage: function (ltext) {
					clipboard.set(ltext.trim());
		  }
		});
	} else {
		copyLinkTextItem.destroy();
	}
}

function openLinkHostname(prefName) {
	if(prefs.prefs[prefName]) {
		openLinkHostnameItem = contextMenu.Item({
		  label: "Open Link Hostname",
		  context: contextMenu.SelectorContext("a[href]"),
		  contentScript: 'self.on("click", function (node, data) {' +
						  'var pattern = new RegExp(".+?://.+?/"); var lhostname = pattern.exec(node.href);' +
				         '  self.postMessage(lhostname.toString());' +
				         '});',
		  onMessage: function (lhostname) {
		  			tabs.open(lhostname);
		  }
		});
	} else {
		openLinkHostnameItem.destroy();
	}
}

function stopLoadingImage(prefName) {
	if(prefs.prefs[prefName]) {
		stopLoadingImageItem = contextMenu.Item({
		  label: "Stop Loading Image",
		  context: contextMenu.SelectorContext("img"),
		  contentScript: 'self.on("click", function (node, data) {' +
						 'node.src = "' + data.url("img/stop.png") + '";' +
						 'node.style.width = "128px";' +
						 'node.style.height = "128px";' +
				         '});'
		});
	} else {
		stopLoadingImageItem.destroy();
	}
}

function getHotkey(prefName) {
	var pref = prefs.prefs[prefName];
	var hotkey;
	if(pref.length === 2) {
		if(pref[0] === db.storage.hotkeys[prefName]) {
			hotkey = pref[1];
		} else if(pref[1] === db.storage.hotkeys[prefName]) {
			hotkey = pref[0];
		} else {
			hotkey = '';
		}
	} else if(pref.length === 1) {
		hotkey = pref;
	} else {
		hotkey = '';
	}
	if(hotkey) {
		if(/[a-zA-Z0-9]/.test(hotkey)) {
			if(prefName === 'ptextAndPtitleHotkey') {
				if(hotkey === prefs.prefs['copyPageURLHotkey']) hotkey = '';
			} else if(prefName === 'copyPageURLHotkey') {
				if(hotkey === prefs.prefs['ptextAndPtitleHotkey']) hotkey = '';
			}
		} else {
			hotkey = '';
		}
	}
	prefs.prefs[prefName] = hotkey;
	db.storage.hotkeys[prefName] = hotkey;
	if(prefName === 'ptextAndPtitleHotkey') {
		if(plainTitleHotKey) plainTitleHotKey.destroy();
		if(hotkey) ptextAndPtitleHotkey(hotkey);
	} else if(prefName === 'copyPageURLHotkey') {
		if(cPageurlHotKey) cPageurlHotKey.destroy();
		if(hotkey) copyPageURLHotkey(hotkey);
	}
}

function ptextAndPtitleHotkey(hotkey) {
	plainTitleHotKey = Hotkey({
		combo: "accel-shift-"+hotkey,
		onPress: function() {
			if(selection.text) {
				clipboard.set(selection.text.toString().trim());
			} else {
				clipboard.set(tabs.activeTab.title.toString());
			}
		 }
	});
}

function copyPageURLHotkey(hotkey) {
	cPageurlHotKey = Hotkey({
		combo: "accel-shift-"+hotkey,
		onPress: function() {
			clipboard.set(tabs.activeTab.url.toString());
		}
	});
}

prefs.on("copyPageTitle", copyPageTitle);
prefs.on("copyPageURL", copyPageURL);
prefs.on("copyPageTitleAndURL", copyPageTitleAndURL);
prefs.on("copyTitleAndURLOfAllTabs", copyTitleAndURLOfAllTabs);
prefs.on("copyAsHTMLLink", copyAsHTMLLink);
prefs.on("copyAsLink", copyAsLink);
prefs.on("openPageHostname", openPageHostname);
prefs.on("copyAsPlainText", copyAsPlainText);
prefs.on("copySelectionAsHTMLLink", copySelectionAsHTMLLink);
prefs.on("copySelectionAsLink", copySelectionAsLink);
prefs.on("copyAsHTML", copyAsHTML);
prefs.on("copyTextAndURL", copyTextAndURL);
prefs.on("copyLinkText", copyLinkText);
prefs.on("openLinkHostname", openLinkHostname);
prefs.on("stopLoadingImage", stopLoadingImage);
prefs.on("ptextAndPtitleHotkey", getHotkey);
prefs.on("copyPageURLHotkey", getHotkey);

//Initializing
if(prefs.prefs['copyPageTitle']) copyPageTitle('copyPageTitle');
if(prefs.prefs['copyPageURL']) copyPageURL('copyPageURL');
if(prefs.prefs['copyPageTitleAndURL']) copyPageTitleAndURL('copyPageTitleAndURL');
if(prefs.prefs['copyTitleAndURLOfAllTabs']) copyTitleAndURLOfAllTabs('copyTitleAndURLOfAllTabs');
if(prefs.prefs['copyAsHTMLLink']) copyAsHTMLLink('copyAsHTMLLink');
if(prefs.prefs['copyAsLink']) copyAsLink('copyAsLink');
if(prefs.prefs['openPageHostname']) openPageHostname('openPageHostname');
if(prefs.prefs['copyAsPlainText']) copyAsPlainText('copyAsPlainText');
if(prefs.prefs['copySelectionAsHTMLLink']) copySelectionAsHTMLLink('copySelectionAsHTMLLink');
if(prefs.prefs['copySelectionAsLink']) copySelectionAsLink('copySelectionAsLink');
if(prefs.prefs['copyAsHTML']) copyAsHTML('copyAsHTML');
if(prefs.prefs['copyTextAndURL']) copyTextAndURL('copyTextAndURL');
if(prefs.prefs['copyLinkText']) copyLinkText('copyLinkText');
if(prefs.prefs['openLinkHostname']) openLinkHostname('openLinkHostname');
if(prefs.prefs['stopLoadingImage']) stopLoadingImage('stopLoadingImage');
if(prefs.prefs['ptextAndPtitleHotkey']) {
	var plainTitleHotKey;
	ptextAndPtitleHotkey(prefs.prefs['ptextAndPtitleHotkey']);
}
if(prefs.prefs['copyPageURLHotkey']) {
	var cPageurlHotKey;
	copyPageURLHotkey(prefs.prefs['copyPageURLHotkey']);
}

if (options.loadReason === 'upgrade') {
        tabs.open(data.url("changelog.html"));
}

}
