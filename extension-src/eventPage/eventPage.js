var blacklist;
var whitelist;
var getCacheSite;
var postCacheSite;

function serverReport(site) {
    $.ajax({
        type: "POST",
        url: "http://vestrada.pw/phishnet/post.php",
        data: "Action=report&SiteName=" + site + "&User=" + chrome.runtime.id,
        success: function (html) {
            response = parseInt(html);
        },
        async: true
    });
}
function serverUnreport(site) {
    $.ajax({
        type: "POST",
        url: "http://vestrada.pw/phishnet/post.php",
        data: "Action=unreport&SiteName=" + site + "&User=" + chrome.runtime.id,
        success: function (html) {
            response = parseInt(html);

        },
        async: true
    });
}

function report(url) {
    
    chrome.storage.local.get(null, function (obj) {
        for (var i = 0; i < obj.whitelist.length; i++) {
            if (obj.whitelist[i] == url) {
                
                var newWhite = new Array();
                for (var j = 0; j < obj.whitelist.length; j++) {
                    if (j != i) {
                        newWhite.push(obj.whitelist[j]);
                    }
                }
                newWhite.sort();
                chrome.storage.local.set({ 'whitelist': newWhite });
                
            }
        }
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
            filtered.sort();
            chrome.storage.local.set({ 'blacklist': filtered });
            if (!already) {
                serverReport(url);
            }
        }
        updateHandler();
    });

    
    
}

function whiteList(url) {
        
    chrome.storage.local.get(null, function (obj) {
        for (var i = 0; i < obj.blacklist.length; i++) {
            if (obj.blacklist[i] == url) {
                
                var newBlack = new Array();
                for (var j = 0; j < obj.blacklist.length; j++) {
                    if (j != i) {
                        newBlack.push(obj.blacklist[j]);
                    }
                }
                newBlack.sort();
                chrome.storage.local.set({ 'blacklist': newBlack });
                serverUnreport(url);

            }
        }
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
            filtered.sort();
            chrome.storage.local.set({ 'whitelist': filtered });
            
        }
        updateHandler();

    });
        
   
}



function trimURL(url) {
    if (url.indexOf("http://") == -1 && url.indexOf("https://") == -1) {
        url = "http://" + url;
    }
    var a = document.createElement('a');
    a.href = url;
    url = a.hostname;
    return url.split(".").slice(-2).join("."); 
}

function pause(milliseconds) {
    var dt = new Date();
    while ((new Date()) - dt <= milliseconds) {
    }
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

function updateHandler() {
    postCacheSite = "";
    getCacheSite = "";
    
    chrome.tabs.query({}, function (tabs) {
        for (var i = 0; i < tabs.length; ++i) {
            chrome.tabs.sendMessage(tabs[i].id, {action: "updateSubmit" }, function (response) {


            });
        }
    });
    chrome.storage.local.get(null, function (storage) {
        blacklist = storage.blacklist;
        whitelist = storage.whitelist;
        number = storage.number;
        chrome.webRequest.onBeforeRequest.addListener(
            function (obj) {
                var method = obj.method;
                var url = trimURL(obj.url);
                var id = obj.requestId;

                

                

                
                if (method == "GET") {

                    if (url == getCacheSite) {
                        return { cancel: false };
                    }


                    /*var rand = getRandomInt(0, 20);
                    console.log(rand);
                    var badsites = [
                        "http://i25.photobucket.com/albums/c53/dsogmotha1223/gross.jpg",
                        "http://craftedstories.com/wp-content/uploads/2014/06/gross.jpg",
                        "http://path.upmc.edu/cases/case15/images/gross2.jpg",
                        "http://img3.rnkr-static.com/user_node_img/3682/73637092/870/flesh-eating-disease-diseases-and-medical-conditions-photo-u2.jpg"

                    ]
                    if (rand == 0) {
                        return { redirectUrl: badsites[getRandomInt(0,badsites.length)] }
                    }*/



                    for (var i = 0; i < blacklist.length; i++) {
                        if (blacklist[i] == url) {
                            return { cancel: true };
                        }
                    }
                    getCacheSite = url;
                    return { cancel: false } 
                }
                


                else if (method == "POST" && obj.requestBody != undefined && obj.requestBody.hasOwnProperty("formData")) {
                    
                    /*
                    if (postCacheSite == "facebook.com")
                        postCacheSite = "";
                    if (url == postCacheSite) {
                        return { cancel: false };
                    }

                    

                    var onList = false;



                    if (url == "vestrada.pw") {
                        return { cancel: false };
                    }
                    for (var i = 0; i < whitelist.length; i++) {
                        if (whitelist[i] == url) {
                            onList = true;
                            postCacheSite = url;
                            return { cancel: false };                                 
                        }
                    }

                    for (var i = 0; i < blacklist.length; i++) {
                        if (blacklist[i] == url) {
                            onList = true;
                            return { cancel: true };                               
                        }
                    }
                    

                    if (!onList) {
                        var numResponse = number;
                        $.ajax({                                                          
                            type: "POST",
                            url: "http://vestrada.pw/phishnet/post.php",
                            data: "Action=getnumber&SiteName="+url+"&User="+chrome.runtime.id,
                            success: function (html) {
                                numResponse = parseInt(html);
                            },
                            async: false
                        });

                        if (numResponse == -1 || numResponse < 0) {
                            postCacheSite = url;
                            return { cancel: false };
                        }
                        else if (numResponse > number && numResponse != -1) {
                            return { cancel: true };
                        }
                        else {

                            //chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                                //chrome.tabs.sendMessage(tabs[0].id, { action: "dialog", site: url }, function (response) {
                                    
                                //});
                            //});
                            var redirect = chrome.runtime.getURL("popup/popup.html");
                            return { redirectUrl: "javascript:" };
                            return { cancel: true };
                        }
                    }*/
                }
            },
            { urls: ["<all_urls>"] },
            ['blocking', 'requestBody']
        );
    });
}
chrome.runtime.onInstalled.addListener(function (details) {
    chrome.runtime.setUninstallURL("http://vestrada.pw/phishnet/uninstall.php?user=" + chrome.runtime.id, function () {
    })
    chrome.storage.local.set(
        { 'number': 250, 'whitelist': new Array(), 'blacklist': new Array() },
        function () {
            updateHandler();
        }
    );
});
chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.event == "getnum") {
            var numResponse;
            $.ajax({
                type: "POST",
                url: "http://vestrada.pw/phishnet/post.php",
                data: "Action=getnumber&SiteName=" + url + "&User=" + chrome.runtime.id,
                success: function (html) {
                    numResponse = parseInt(html);
                },
                async: false
            });
            sendResponse({
                number: numResponse
            });
        }
        else if (request.event == "storage") {
            updateHandler();
            sendResponse({
                msg: "goodbye!"
            });
        }
        else if (request.event == "report") {
            report(request.site);

        }
        else if (request.event == "white") {
            whiteList(request.site);
        }
    }
);

updateHandler();
