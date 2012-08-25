self.on("context", function (node) {
    var links = document.getElementsByTagName("link");
    var feeds = new Array;
    var i, feedCount = 0;
    for(i=0; i<links.length; i++)
	if(links[i].type === "application/rss+xml" || links[i].type === "application/atom+xml") {
	    feeds[feedCount] = { title: links[i].title, href: links[i].href };
	    feedCount++;
	}
    if(feeds.length > 0) {
	self.postMessage({feeds:feeds,type:"Feed"});
	return true;
    }
});
self.on("click", function (node, data) {
    self.postMessage({URL:data,type:"Feed URL"});
});
