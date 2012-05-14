function getAncestorByTagName(node, tag){
    for(tag = tag.toUpperCase(); node && node.tagName !== tag; node = node.parentNode){}
    return node;
}
self.on("context", function(node) {
    form = getAncestorByTagName(node, "form");
    if(!form) return false;
    self.postMessage();
    return true;
});
self.on("click", function (node, data) {
    var strPos = node.selectionStart;
    node.value = node.value.substring(0, strPos) + data + node.value.substring(node.selectionEnd, node.value.length);
    node.selectionStart = node.selectionEnd = strPos + data.length;
    node.focus();
    form.submit();
});
