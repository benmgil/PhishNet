var url = window.location.hostname;
//message("$blank");
chrome.storage.local.get(null, function (obj) {
    if (obj.blacklist == undefined) {
        chrome.storage.local.set({ 'blacklist': new Array(url) });
    }
    else {
        var already = false;
        var array = obj.blacklist;
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
        chrome.storage.local.set({ 'blacklist': filtered });
        if(!already){
            //send to server
        }
    }
});

