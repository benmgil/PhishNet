function trimURL(url) {
    if (url.indexOf("http://") == -1 && url.indexOf("https://") == -1) {
        url = "http://" + url;
    }
    var a = document.createElement('a');
    a.href = url;
    url = a.hostname;
    return url.split(".").slice(-2).join(".");
}

function makeBox(site) {
    console.log(site);
    console.log(site.split("$"))
    console.log(site.split("$")[1]);
    var d = new Date();
    
    if (site.split("$")[1] != "greater") {
        var newDiv = $(document.createElement('div'));
        newDiv.html("\
            <p style='margin: 10px; font-weight: bold'>Warning from PhishNet:</p>\
            <p class='site-p'>A site named '<span>"+ site + "</span>' is trying to get information from you.</p>\
            <p>Would you like to allow it?</p>\
            <p style='font-size: 60%'>(You may need to reload the page before after choosing)</p>\
        ");
        newDiv.addClass("dialogContainer");
        var siteAlready = false;
        for (var p = 0; p < alreadySites.length; p++) {
            if (alreadySites[p] == site) {
                siteAlready = true;
                break;
            }
        }
        if (!siteAlready) {
            alreadySites.push(site);
        }
        else {
        }
        if (!siteAlready) {
            newDiv.dialog({
                draggable: "false",
                dialogClass: "replacement-class",
                create: function (event) { $(event.target).parent().css({ 'position': 'fixed', 'top': '50%', 'margin-top': '-100px', 'left': '50%;', 'margin-left': '-235px' }); },
                buttons: [
                    {
                        text: "Allow", click: function () {

                            resp = "white";
                            chrome.runtime.sendMessage({ event: "white", site: site }, function (response) {
                            });


                            $(".replacement-class .ui-dialog-content").each(function (i, obj) {
                                var eachSite = $(this).find(".site-p span").html();
                                if (eachSite == site) {
                                    $(this).dialog("close");
                                }
                            });

                            $(this).dialog("close");
                        }
                    },
                    {
                        text: "Disallow", click: function () {

                            resp = "black";
                            chrome.runtime.sendMessage({ event: "report", site: site }, function (response) {
                            });


                            $(".replacement-class .ui-dialog-content").each(function (i, obj) {
                                var eachSite = $(this).find(".site-p span").html();
                                if (eachSite == site) {
                                    $(this).dialog("close");
                                }
                            });

                            $(this).dialog("close");
                        }
                    }
                ],
                closeOnEscape: false,
                modal: false,
                position: { my: "center", at: "center", of: window }


            });
            var id = d.getTime().toString();
            var contentId = id + "content";
            $(".replacement-class").each(function (i, obj) { $(this).removeClass(".replacement-class"); $(this).attr("id", id); });
            var id = "#" + id;
            $(id).addClass("customDialog");
            $(id + " .ui-dialog-titlebar").each(function (i, obj) { $(this).hide(); });

            $(id + " .ui-dialog-content").attr("id", contentId);



            $(id + " .ui-dialog-content").each(function (i, obj) { $(this).removeClass(".ui-dialog-content"); });

        }
    }
    else {
        site = site.split("$")[0];
        var newDiv = $(document.createElement('div'));
        newDiv.html("\
            <p style='margin: 10px; font-weight: bold'>Warning from PhishNet:</p>\
            <p class='site-p'>A site named '<span>"+ site + "</span>' is trying to get information from you.</p>\
            <p>It has been reported more times than your limit.</p>\
            <p>According to your criteria, this site is insecure.</p>\
        ");
        newDiv.addClass("dialogContainer");
        var siteAlready = false;
        for (var p = 0; p < alreadySites.length; p++) {
            if (alreadySites[p] == site) {
                siteAlready = true;
                break;
            }
        }
        if (!siteAlready) {
            alreadySites.push(site);
        }
        else {
        }
        if (!siteAlready) {
            newDiv.dialog({
                draggable: "false",
                dialogClass: "replacement-class",
                create: function (event) { $(event.target).parent().css({ 'position': 'fixed', 'top': '50%', 'margin-top': '-100px', 'left': '50%;', 'margin-left': '-235px' }); },
                buttons: [
                    
                    {
                        text: "OK", click: function () {

                            resp = "ok";
                           
                            console.log(alreadySites);
                            var newAlreadySites = [];
                            for (var x = 0; x < alreadySites.length; x++) {
                                if (alreadySites[x] != site) {
                                    newAlreadySites.push(alreadySites[x]);
                                }
                            }
                            alreadySites = newAlreadySites;
                            console.log(alreadySites);
                            $(".replacement-class .ui-dialog-content").each(function (i, obj) {
                                var eachSite = $(this).find(".site-p span").html();
                                if (eachSite == site) {
                                    $(this).dialog("close");
                                }
                            });

                            $(this).dialog("close");
                        }
                    }
                ],
                closeOnEscape: false,
                modal: false,
                position: { my: "center", at: "center", of: window }


            });
            var id = d.getTime().toString();
            var contentId = id + "content";
            $(".replacement-class").each(function (i, obj) { $(this).removeClass(".replacement-class"); $(this).attr("id", id); });
            var id = "#" + id;
            $(id).addClass("customDialog");
            $(id + " .ui-dialog-titlebar").each(function (i, obj) { $(this).hide(); });

            $(id + " .ui-dialog-content").attr("id", contentId);



            $(id + " .ui-dialog-content").each(function (i, obj) { $(this).removeClass(".ui-dialog-content"); });

        }
    }
}



var alreadySites = [];
document.addEventListener("post", function (e) {
});

function updateSubmit() {
    $(document).ready(function () {
        chrome.storage.local.get(null, function (storage) {
            blacklist = storage.blacklist;
            whitelist = storage.whitelist;
            number = storage.number;
            document.addEventListener("click", function (e) {
               
                if (e.target.tagName.toLowerCase() === 'a') {

                    var url = e.target.href;
                    if (url == "javascript:;") {
                        url = trimURL(window.location.toString());
                    }
                    else {
                        url = trimURL(e.target.href.toString());
                    }
                    var isForm = false;
                    $("form").each(function (i, obj) {
                        if ($(e.target).closest("form").is(this)) {
                            isForm = true;
                        }


                    });
                    if (isForm) {


                        var onList = false;


                        for (var i = 0; i < whitelist.length; i++) {
                            if (whitelist[i] == url) {
                                onList = true;
                                return true;
                            }
                        }

                        for (var i = 0; i < blacklist.length; i++) {
                            if (blacklist[i] == url) {
                                onList = true;
                                e.preventDefault(e);
                                location.reload();
                                return false;
                            }
                        }


                        if (!onList) {
                            var numResponse = number;
                            $.ajax({
                                type: "POST",
                                url: "https://vestrada.pw/phishnet/post.php",
                                data: "Action=getnumber&SiteName=" + url + "&User=" + chrome.runtime.id,
                                crossDomain: true,
                                success: function (html) {
                                    numResponse = parseInt(html);
                                },
                                async: false
                            });




                            /*chrome.runtime.sendMessage({ event: "getnum", site: url}, function (response) {
                                numResponse = response.number;
                            });*/
                            console.log(numResponse);


                            if (numResponse == -1 || numResponse < 0) {
                                return true;
                            }
                            else if (numResponse > number && numResponse != -1) {
                                console.log("woo");
                                e.preventDefault();
                                console.log("wee");
                                makeBox(url + "$greater");
                                return false;
                            }
                            else {
                                console.log("else");
                                makeBox(url);
                                e.stopImmediatePropagation()
                                return false;

                            }
                        }

                    }
                }
            });


            document.addEventListener("submit", function (e) {
                var url = trimURL(e.srcElement.action);

                console.log("SUBMIT");


                var onList = false;


                for (var i = 0; i < whitelist.length; i++) {
                    if (whitelist[i] == url) {
                        onList = true;
                        console.log("WHITE");
                        return true;
                    }
                }

                for (var i = 0; i < blacklist.length; i++) {
                    if (blacklist[i] == url) {
                        onList = true;
                        e.preventDefault(e);
                        console.log("BLACK");
                        location.reload();
                        return false;
                    }
                }


                if (!onList) {
                    var numResponse = number;
                    $.ajax({
                        type: "POST",
                        url: "https://vestrada.pw/phishnet/post.php",
                        crossDomain: true,
                        data: "Action=getnumber&SiteName=" + url + "&User=" + chrome.runtime.id,
                        success: function (html) {
                            numResponse = parseInt(html);
                        },
                        async: false
                    });


                    /*chrome.runtime.sendMessage({ event: "getnum", site: url }, function (response) {
                        console.log(response);
                        numResponse = response.number;
                    });*/
                    console.log(numResponse);

                    if (numResponse == -1 || numResponse < 0) {
                        console.log("-1");
                        return true;
                    }
                    else if (numResponse > number && numResponse != -1) {
                        e.preventDefault(e);
                        console.log("greater than");
                        makeBox(url+"$greater");
                        return false;
                    }
                    else {
                        console.log("else");
                        makeBox(url);
                        e.preventDefault(e);
                        e.stopPropagation(e);
                        return false;

                    }
                }



            }, false);
        });
    });
}
    
updateSubmit();

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.action == "updateSubmit") {
            updateSubmit();
        }
        
    }
);
        
