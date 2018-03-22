var url = window.location.hostname;
//message("$blank");
chrome.storage.local.get(null, function (obj) {
    if (obj.whitelist == undefined) {
        chrome.storage.local.set({ 'whitelist': new Array(url) });
    }
    else {
        var already = false;
        var array = obj.whitelist;
        array.push(url);
        var filtered = new Array();
        for (var i = 0; i < array.length; i++) {
            if (filtered.indexOf(array[i]) == -1) {
                filtered.push(array[i]);
            }
            else {
                if (array[i] == url) {
                    already = true;
                }
            }
        }
        chrome.storage.local.set({ 'whitelist': filtered });
        if (!already) {
            //send to server
        }
    }
});