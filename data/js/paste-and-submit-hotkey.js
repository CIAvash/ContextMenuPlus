function getAncestorByTagName(node, tag){
    for(tag = tag.toUpperCase(); node && node.tagName !== tag; node = node.parentNode){}
    return node;
}
if(document.activeElement && ( (document.activeElement.tagName.toLowerCase() == "input" && (document.activeElement.type == "text" || document.activeElement.type == "password")) || document.activeElement.tagName.toLowerCase() == "textarea" ) ) {
    var node = document.activeElement;
    var form = getAncestorByTagName(node, "form");
    if(form) self.postMessage();
}
self.on("message", function(data) {
    var strPos = node.selectionStart;
        node.value = node.value.substring(0, strPos) + data + node.value.substring(node.selectionEnd, node.value.length);
        node.selectionStart = node.selectionEnd = strPos + data.length;
        node.focus();
        form.submit();
});
