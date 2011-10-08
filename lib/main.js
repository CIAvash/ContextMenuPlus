var contextMenu = require("context-menu");
var tabs = require("tabs");
let clipboard = require("clipboard");
var selection = require("selection");
const { Hotkey } = require("hotkeys");
const data = require("self").data;
const widgets = require("widget");
const panels = require("panel");
var db = require("simple-storage");

exports.main = function (options, callbacks) {

function init() {
	db.storage.options = {
		cpageTitle:true,
		cpageurl:true,
		cpAsHtmlLink:true,
		cpAsLink:true,
		opageHostname:true,
		cplaintext:true,
		cAsHtmlCode:true,
		clinkText:true,
		olinkHostname:true,
		ctextTitleHotKey:true,
		ctextTitleKey:'c',
		ctextTitleKeyChanged:false,
		cpageurlHotkey:true,
		cpageurlkey:'u',
		cpageurlkeyChanged:false
	};
}

var optionsPanel = panels.Panel({
	width: 350,
	height: 490,
	contentURL: data.url("options.html"),
	contentScriptFile: [data.url('js/jquery.min.js'), data.url('js/options.js')]
});

optionsPanel.port.on("options", function(options) {
	db.storage.options = options;
	refresh_addon();
});

widgets.Widget({
  id: "open-options-btn",
  label: "ContextMenuPlus Options",
  contentURL: data.url("img/cmp.png"),
  panel: optionsPanel,
  onClick: function() {
    optionsPanel.port.emit("options", db.storage.options);
  }
});

var pTitleItem = true, purlItem = true, phLinkItem = true, paLinkItem = true, pHostnameItem = true, pTextItem = true, hCodeItem = true, lTextItem = true, lHostnameItem = true, textTitleHotkey = true, purlHotkey = true;
function refresh_addon() {
	if(db.storage.options.cpageTitle && pTitleItem) {
		pageTitleItem = contextMenu.Item({
		  label: "Copy Page Title",
		  contentScript: 'self.on("click", function (node, data) {' +
				         '  self.postMessage(document.title);' +
				         '});',
		  onMessage: function (ptitle) {
					clipboard.set(ptitle);
		  }
		});
		pTitleItem = false;
	} else if(!db.storage.options.cpageTitle && !pTitleItem) {
		pageTitleItem.destroy();
		pTitleItem = true;
	}
	if(db.storage.options.cpageurl && purlItem) {
		pageurlItem = contextMenu.Item({
		  label: "Copy Page URL",
		  contentScript: 'self.on("click", function (node, data) {' +
				         '  self.postMessage("");' +
				         '});',
		  onMessage: function () {
					clipboard.set(tabs.activeTab.url.toString());
		  }
		});
		purlItem = false;
	} else if(!db.storage.options.cpageurl && !purlItem) {
		pageurlItem.destroy();
		purlItem = true;
	}
	if(db.storage.options.cpAsHtmlLink && phLinkItem) {
		pHtmlLinkItem = contextMenu.Item({
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
		phLinkItem = false;
	} else if(!db.storage.options.cpAsHtmlLink && !phLinkItem) {
		pHtmlLinkItem.destroy();
		phLinkItem = true;
	}
	if(db.storage.options.cpAsLink && paLinkItem) {
		pAsLinkItem = contextMenu.Item({
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
		paLinkItem= false;
	} else if(!db.storage.options.cpAsLink && !paLinkItem) {
		pAsLinkItem.destroy();
		paLinkItem = true;
	}
	if(db.storage.options.opageHostname && pHostnameItem) {
		pagehostnameItem = contextMenu.Item({
		  label: "Open Page Hostname",
		  contentScript: 'self.on("click", function (node, data) {' +
		  				 'if(window.location.hostname !== "") {' +
				         'self.postMessage(window.location.protocol + "//" + window.location.hostname + "/");' +
				         '}});',
		  onMessage: function (hostname) {
		  			tabs.open(hostname);
		  }
		});
		pHostnameItem = false;
	} else if(!db.storage.options.opageHostname && !pHostnameItem) {
		pagehostnameItem.destroy();
		pHostnameItem = true;
	}
	if(db.storage.options.cplaintext && pTextItem) {
		plainTextItem = contextMenu.Item({
		  label: "Copy as Plain Text",
		  context: contextMenu.SelectionContext(),
		  contentScript: 'self.on("click", function (node, data) {' +
				         '  self.postMessage(window.getSelection().toString());' +
				         '});',
		  onMessage: function (text) {
					clipboard.set(text.trim());
		  }
		});
		pTextItem = false;
	} else if(!db.storage.options.cplaintext && !pTextItem) {
		plainTextItem.destroy();
		pTextItem = true;
	}
	if(db.storage.options.cAsHtmlCode && hCodeItem) {
		HtmlCodeItem = contextMenu.Item({
		  label: "Copy as HTML",
		  context: contextMenu.SelectionContext(),
		  contentScript: 'self.on("click", function (node, data) {' +
				         '  self.postMessage("");' +
				         '});',
		  onMessage: function () {
		  			if(selection.html) {
						clipboard.set(selection.html.trim());
					}
		  }
		});
		hCodeItem = false;
	} else if(!db.storage.options.cAsHtmlCode && !hCodeItem) {
		HtmlCodeItem.destroy();
		hCodeItem = true;
	}
	if(db.storage.options.clinkText && lTextItem) {
		linkTextItem = contextMenu.Item({
		  label: "Copy Link Text",
		  context: contextMenu.SelectorContext("a[href]"),
		  contentScript: 'self.on("click", function (node, data) {' +
				         '  self.postMessage(node.textContent);' +
				         '});',
		  onMessage: function (ltext) {
					clipboard.set(ltext.trim());
		  }
		});
		lTextItem = false;
	} else if(!db.storage.options.clinkText && !lTextItem) {
		linkTextItem.destroy();
		lTextItem = true;
	}
	if(db.storage.options.olinkHostname && lHostnameItem) {
		linkhostnameItem = contextMenu.Item({
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
		lHostnameItem = false;
	} else if(!db.storage.options.olinkHostname && !lHostnameItem) {
		linkhostnameItem.destroy();
		lHostnameItem = true;
	}
	if(db.storage.options.ctextTitleHotKey && textTitleHotkey) {
		plainTitleHotKey = Hotkey({
		  combo: "accel-shift-"+db.storage.options.ctextTitleKey,
		  onPress: function() {
			if(selection.text) {
				clipboard.set(selection.text.toString().trim());
			} else {
				clipboard.set(tabs.activeTab.title.toString());
			}
		  }
		});
		textTitleHotkey = false;
	} else if(!db.storage.options.ctextTitleHotKey && !textTitleHotkey) {
		plainTitleHotKey.destroy();
		textTitleHotkey = true;
	} else if(db.storage.options.ctextTitleKeyChanged) {
		plainTitleHotKey.destroy();
		plainTitleHotKey = Hotkey({
		  combo: "accel-shift-"+db.storage.options.ctextTitleKey,
		  onPress: function() {
			if(selection.text) {
				clipboard.set(selection.text.toString().trim());
			} else {
				clipboard.set(tabs.activeTab.title.toString());
			}
		  }
		});
		db.storage.options.ctextTitleKeyChanged = false;
	}
	if(db.storage.options.cpageurlHotkey && purlHotkey) {
		PageurlHotKey = Hotkey({
		  combo: "accel-shift-"+db.storage.options.cpageurlkey,
		  onPress: function() {
				clipboard.set(tabs.activeTab.url.toString());
			}
		});
		purlHotkey = false;
	} else if(!db.storage.options.cpageurlHotkey && !purlHotkey) {
		PageurlHotKey.destroy();
		purlHotkey = true;
	} else if(db.storage.options.cpageurlkeyChanged) {
		PageurlHotKey.destroy();
		PageurlHotKey = Hotkey({
		  combo: "accel-shift-"+db.storage.options.cpageurlkey,
		  onPress: function() {
				clipboard.set(tabs.activeTab.url.toString());
			}
		});
		db.storage.options.cpageurlkeyChanged = false;
	}
}

if (options.loadReason === 'upgrade') {
        tabs.open(data.url("changelog.html"));
}

if(!db.storage.options) {
	init();
}
refresh_addon();
}
