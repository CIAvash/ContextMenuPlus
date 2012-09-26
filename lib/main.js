var contextMenu = require("context-menu");
var tabs = require("tabs");
let clipboard = require("clipboard");
var selection = require("selection");
const { Hotkey } = require("hotkeys");
const data = require("self").data;
const prefs = require("simple-prefs");
var db = require("simple-storage");
var Request = require("request").Request;
var notifications = require("notifications");

exports.main = function (options, callbacks) {

    if(!db.storage.hotkeys){
	db.storage.hotkeys = {
	    ptextAndPtitleHotkey:prefs.prefs['ptextAndPtitleHotkey'],
	    copyPageURLHotkey:prefs.prefs['copyPageURLHotkey'],
	    pasteAndSubmitHotKey:prefs.prefs['pasteAndSubmitHotKey']
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

    function copyLinkTextAndURL(prefName) {
	if(prefs.prefs[prefName]) {
            copyLinkTextAndURLItem = contextMenu.Item({
		label: "Copy Link Text & URL",
		context: contextMenu.SelectorContext("a[href]"),
		contentScript: 'self.on("click", function (node, data) {' +
		    '  var textAndURL = node.textContent.trim() + "\\r\\n" + node.href;' +
		    '  self.postMessage(textAndURL);' +
		    '});',
		onMessage: function (textAndURL) {
		    clipboard.set(textAndURL);
		}
	    });
        } else {
	    copyLinkTextAndURLItem.destroy();
	}
    }

    function copyLinkTextAndPageURL(prefName) {
	if(prefs.prefs[prefName]) {
            copyLinkTextAndPageURLItem = contextMenu.Item({
		label: "Copy Link Text & Page URL",
		context: contextMenu.SelectorContext("a[href]"),
		contentScript: 'self.on("click", function (node, data) {' +
		    '	if(document.URL) {' +
		    '		var textAndURL = node.textContent.trim() + "\\r\\n" + document.URL;' +
		    '  self.postMessage(textAndURL);' +
		    '}});',
		onMessage: function (textAndURL) {
		    clipboard.set(textAndURL);
		}
	    });
        } else {
	    copyLinkTextAndPageURLItem.destroy();
	}
    }

    function copyAsPlainLink(prefName) {
	if(prefs.prefs[prefName]) {
	    copyAsPlainLinkItem = contextMenu.Item({
		label: "Copy As Plain Link",
		context: contextMenu.SelectorContext("a[href]"),
		contentScript: 'self.on("click", function (node, data) {' +
		    "  var link = '<a href=\"' + node.href + '\">' + node.textContent.trim() + '</a>';" +
		    '  self.postMessage(link);' +
		    '});',
		onMessage: function (link) {
		    clipboard.set(link, 'html');
		}
	    });
	} else {
	    copyAsPlainLinkItem.destroy();
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
		    '	node.src = "' + data.url("img/stop.png") + '";' +
		    '	node.style.width = "128px";' +
		    '	node.style.height = "128px";' +
		    '});'
	    });
	} else {
	    stopLoadingImageItem.destroy();
	}
    }


    function copyFeedURL(prefName) {
	if(prefs.prefs[prefName]) {
	    copyFeedURLMenu = contextMenu.Menu({
		label: "Copy Feed URL",
		context: contextMenu.PageContext(),
		contentScriptFile: data.url("js/copy-feed-URL.js"),
		items: [],
		onMessage: function (data) {
		    switch(data.type) {
		    case 'Feed':
			if(this.items.length > 0){
			    itemCount = this.items.length;
			    for(var i=0; i<itemCount; i++)
				this.items[0].destroy();
			}
			var subFeedItems = new Array;
			for(var i=0; i<data.feeds.length; i++) {
			    subFeedItems[i] = contextMenu.Item({
				label: '[' + data.feeds[i].title + '] ' + data.feeds[i].href,
				data: data.feeds[i].href
			    });
			    this.addItem(subFeedItems[i]);
			}
			break;
		    case 'Feed URL':
			clipboard.set(data.URL);
			break;
		    }
		}
	    });
	} else {
	    copyFeedURLMenu.destroy();
	}
    }

    function pasteAndSubmit(prefName) {
        if(prefs.prefs[prefName]) {
            pasteAndSubmitItem = contextMenu.Item({
		label: "Paste & Submit",
		context: contextMenu.SelectorContext("input[type=text], input[type=password], textarea"),
		contentScriptFile: data.url("js/paste-and-submit.js"),
		onMessage: function () {
		    this.data = clipboard.get();
		}
            });
        } else {
	    pasteAndSubmitItem.destroy();
	}
    }

    function showPageRank(prefName) {
        if(prefs.prefs[prefName]) {
            showPageRankItem = contextMenu.Item({
		label: "Show Google PageRank",
		context: contextMenu.PageContext(),
		contentScriptFile: data.url("js/pr.js"),
		onMessage: function (url) {
		    Request({
                        url: url,
                        onComplete: function (response) {
                            var notification;
                            var pr = /Rank_1:\d:(\d+)/.exec(response.text);
                            if (pr && pr[1] >= 0 && pr[1] <= 10) {
                                notification = pr[1] + "/10";
                                var prIconURL = data.url("img/pr/" + pr[1] + ".png");
                            } else notification = "No page rank available.";
                            notifications.notify({
                                title: "Google PageRank",
                                text: notification,
                                iconURL: prIconURL
                            });
                        }
                    }).get();
		}
            });
        } else {
	    showPageRankItem.destroy();
	}
    }

    var hotkeyList = ['ptextAndPtitleHotkey', 'copyPageURLHotkey', 'pasteAndSubmitHotKey']

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
		for(var i=0; i<hotkeyList.length; i++)
		    if(prefName !== hotkeyList[i])
		        if(hotkey === prefs.prefs[hotkeyList[i]]) hotkey = '';
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
	} else if(prefName === 'pasteAndSubmitHotKey') {
	    if(pasteSubmitHotKey) pasteSubmitHotKey.destroy();
	    if(hotkey) pasteAndSubmitHotKey(hotkey);
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

    function pasteAndSubmitHotKey(hotkey) {
        pasteSubmitHotKey = Hotkey({
	    combo: "accel-shift-"+hotkey,
	    onPress: function() {
		tabs.activeTab.attach({
		    contentScriptFile: data.url("js/paste-and-submit-hotkey.js"),
		    onMessage: function () {
			this.postMessage(clipboard.get());
		    }
		});
	    }
	});
    }

    /** Using prefList list temporarily till Bug 709382 gets fixed
        Bug 709382 – require("simple-prefs").prefs should be iterable
        https://bugzilla.mozilla.org/show_bug.cgi?id=709382
    **/
    var prefList = ['copyPageTitle', 'copyPageURL', 'copyPageTitleAndURL', 'copyTitleAndURLOfAllTabs', 'copyAsHTMLLink', 'copyAsLink', 'openPageHostname', 'copyAsPlainText', 'copySelectionAsHTMLLink', 'copySelectionAsLink', 'copyAsHTML', 'copyTextAndURL', 'copyLinkText', 'copyLinkTextAndURL', 'copyLinkTextAndPageURL', 'copyAsPlainLink', 'openLinkHostname', 'stopLoadingImage', 'copyFeedURL', 'pasteAndSubmit', 'showPageRank', 'ptextAndPtitleHotkey', 'copyPageURLHotkey', 'pasteAndSubmitHotKey'];

    // Creating a dictionary of functions for calling and pointing dynamically
    var functionDict = {
        copyPageTitle: copyPageTitle,
        copyPageURL: copyPageURL,
        copyPageTitleAndURL: copyPageTitleAndURL,
        copyTitleAndURLOfAllTabs: copyTitleAndURLOfAllTabs,
        copyAsHTMLLink: copyAsHTMLLink,
        copyAsLink: copyAsLink,
        openPageHostname: openPageHostname,
        copyAsPlainText: copyAsPlainText,
        copySelectionAsHTMLLink: copySelectionAsHTMLLink,
        copySelectionAsLink: copySelectionAsLink,
        copyAsHTML: copyAsHTML,
        copyTextAndURL: copyTextAndURL,
        copyLinkText: copyLinkText,
        copyLinkTextAndURL: copyLinkTextAndURL,
        copyLinkTextAndPageURL: copyLinkTextAndPageURL,
        copyAsPlainLink: copyAsPlainLink,
        openLinkHostname: openLinkHostname,
        stopLoadingImage: stopLoadingImage,
        copyFeedURL: copyFeedURL,
        pasteAndSubmit: pasteAndSubmit,
        showPageRank: showPageRank,
        ptextAndPtitleHotkey: getHotkey,
        copyPageURLHotkey: getHotkey,
        pasteAndSubmitHotKey: getHotkey
    };

    // Declaring necessary variables
    if(prefs.prefs['ptextAndPtitleHotkey'])	var plainTitleHotKey;
    if(prefs.prefs['copyPageURLHotkey']) var cPageurlHotKey;
    if(prefs.prefs['pasteAndSubmitHotKey']) var pasteSubmitHotKey;

    for(var i=0; i<prefList.length; i++) {
        prefs.on(prefList[i], functionDict[prefList[i]]);   //setting prefs listeners
        if(prefs.prefs[prefList[i]]) functionDict[prefList[i]](prefList[i]);    //initializing
    }

    // if (options.loadReason === 'upgrade') {
    //     tabs.open(data.url("changelog.html"));
    // }

}
