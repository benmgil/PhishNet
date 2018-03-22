var messageVal = "$null";
var reportAlready = false;
var whiteAlready = false;
var reportSwitch = true;
var whiteSwitch = true;
var reportUrlHolder;
var whiteUrlHolder;
var reportAlready;
var whiteAlready;

var internetAlready = false;

var afterFunc = function(){}


function checkInternet() {
    $(document).ready(function () {
        $.ajax({
            url: "http://www.google.com/",
            context: document.body,
            error: function (jqXHR, exception) {

                askBox("You are not connected to the internet. Click OK to retry.", "$statement", "", 125, internetCallback);
                if (internetAlready) {
                    $("#alert-div").effect("shake", { times: 2, distance: 5 }, 250);
                }
                internetAlready = true;

            },
            success: function () {
                askBox("$clear");
            }
        })
    });

}

function internetCallback() {
    
    checkInternet();
}



function tabAlert(string) {
    var str = 'alert("' + string + '");';
    chrome.tabs.executeScript({
        code: str
    });
}


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

function checkURL(str) {
    var pattern = new RegExp('^(https?:\\/\\/)?' + 
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + 
    '((\\d{1,3}\\.){3}\\d{1,3}))' + 
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + 
    '(\\?[;&a-z\\d%_.~+=-]*)?' + 
    '(\\#[-a-z\\d_]*)?$', 'i'); 
    if (!pattern.test(str)) {
        return false;
    } else {
        return true;
    }
}

function getStorage() {
    chrome.storage.local.get(null, function (val) {
        console.log(val);
        console.log("BLACK: ");
        console.log(val.blacklist);
        console.log("WHITE: ");
        console.log(val.whitelist);
    });
}

function clearStorage() {
    chrome.storage.local.clear();
    chrome.storage.local.get(null, function (obj) {
        chrome.storage.local.set({ 'blacklist': new Array() });
        chrome.storage.local.set({ 'whitelist': new Array() });
    });
}
function helpMenu() {
    message("$blank");
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

function changeButton(button, val) {
    if (val == "disable") {
        button.disabled = true;
        var id = '#' + button.id;
        if (!(id == "#settingsButton" || id == "#helpButton")) {
            $(id).animate({ backgroundColor: "#3e4288" }, 250, function () {
                button.className = "noHover";
            });
        }
        else {
            button.className = "noHover";
        }
    }
    if (val == "enable") {
        button.disabled = false;
        var id = '#' + button.id;
        if (!(id == "#settingsButton" || id == "#helpButton")) {
            $(id).animate({ backgroundColor: "#5e62a8" }, 250, function () {
                button.className = "button";
            });
        }
    }
}

function askBox(message, option1, option2, height, callback) {
    if (option1 != "$statement") {
        if (message != "$clear") {
            $("#alert-div").height(height);
            $("#alert-div").show();

            $("#alertOption1").show();
            $("#divider").show();
            $("#alertOption2").show();

            $('#alert-div').animate({ right: '30px' }, 250);


            $('.form-text').attr('disabled', 'disabled');
            $('.button').attr('disabled', 'disabled');

            changeButton(document.getElementById("helpButton"), "disable");
            changeButton(document.getElementById("settingsButton"), "disable");
            changeButton(document.getElementById("reportButton"), "disable");
            changeButton(document.getElementById("reportCurrentButton"), "disable");
            changeButton(document.getElementById("whiteButton"), "disable");
            changeButton(document.getElementById("whiteCurrentButton"), "disable");

            document.getElementById("alertMessage").innerText = message;
            document.getElementById("alertOption1").innerText = option1;
            document.getElementById("alertOption2").innerText = option2;

            afterFunc = callback;

        }
        else {
            $("#alert-div").animate({ right: '-250px' }, 250, function () {
                $("#alert-div").hide();

                $("#alertOption1").hide();
                $("#divider").hide();
                $("#alertOption2").hide();
            });

            $('.form-text').removeAttr("disabled");
            var array = document.getElementsByClassName("button");


            changeButton(document.getElementById("helpButton"), "enable");
            changeButton(document.getElementById("settingsButton"), "enable");
            changeButton(document.getElementById("reportButton"), "enable");
            changeButton(document.getElementById("reportCurrentButton"), "enable");
            changeButton(document.getElementById("whiteButton"), "enable");
            changeButton(document.getElementById("whiteCurrentButton"), "enable");

        }
    }
    else {
        if (message != "$clear") {
            $("#alert-div").show();
            $("#alert-div").height(height);
            $("#alertOption1").show();
            $("#alertOption2").hide();
            $("#divider").hide();
            $('#alert-div').animate({ right: '30px' }, 250);

            option1 = "OK";

            $('.form-text').attr('disabled', 'disabled');
            $('.button').attr('disabled', 'disabled');

            changeButton(document.getElementById("helpButton"), "disable");
            changeButton(document.getElementById("settingsButton"), "disable");
            changeButton(document.getElementById("reportButton"), "disable");
            changeButton(document.getElementById("reportCurrentButton"), "disable");
            changeButton(document.getElementById("whiteButton"), "disable");
            changeButton(document.getElementById("whiteCurrentButton"), "disable");

            document.getElementById("alertMessage").innerText = message;
            document.getElementById("alertOption1").innerText = option1;
            document.getElementById("alertOption2").innerText = option2;

            afterFunc = callback;
        }
        else {
            $("#alert-div").animate({ right: '-250px' }, 250, function () {
                $("#alert-div").hide();
                $("#alertOption1").hide();
                $("#alertOption2").hide();
                $("#divider").hide();
            });

            $('.form-text').removeAttr("disabled");
            var array = document.getElementsByClassName("button");


            changeButton(document.getElementById("helpButton"), "enable");
            changeButton(document.getElementById("settingsButton"), "enable");
            changeButton(document.getElementById("reportButton"), "enable");
            changeButton(document.getElementById("reportCurrentButton"), "enable");
            changeButton(document.getElementById("whiteButton"), "enable");
            changeButton(document.getElementById("whiteCurrentButton"), "enable");
        }
    }
}
function messageCallback() {
    askBox("$clear");
}
function message(text, color, height) {
  

    if (text == "$blank") {
        askBox("$clear")
    }
    else {
        askBox(text, "$statement", "", height, messageCallback);
        
    }
    
}

function refreshSettings() {
    chrome.tabs.query({}, function (tabs) {
        for (var i = 0; i < tabs.length; i++) {
            if (tabs[i].url == chrome.extension.getURL("settings/settings.html")) {
                chrome.tabs.executeScript(tabs[i].id, {
                    code: 'window.location.reload();'
                });
            }
        }
        
        
    });
}
function messageChange() {
    chrome.runtime.sendMessage({
        event: "storage"
    },
    function (response) {
    });
}

function reportRecall(response) {
    if (response == "option1"){
        reportSwitch = true;
    }
    else{
        reportSwitch = false;
    }
    askBox("$clear");
    report(reportUrlHolder);
}

function report(url) {
    if (url != '$currenturl') {
        if (url == "$box") {
            url = document.getElementById("report-box").value;
        }
        if (checkURL(url)) {
            url = trimURL(url);
            reportUrlHolder = url;
            chrome.storage.local.get(null, function (obj) {
                for (var i = 0; i < obj.whitelist.length; i++) {
                    if (obj.whitelist[i] == url) {
                        if (!reportAlready) {
                            reportAlready = true;
                            askBox("That site is on your whitelist. Would you like to switch it?", "Yes", "No", 130, reportRecall);
                            return;
                        }
                        reportAlready = false;
                        if (reportSwitch){
                            var newWhite = new Array();
                            for (var j = 0; j < obj.whitelist.length; j++) {
                                if (j != i) {
                                    newWhite.push(obj.whitelist[j]);
                                }
                            }
                            newWhite.sort();
                            chrome.storage.local.set({ 'whitelist': newWhite });

                        }
                        else {
                            reportSwitch = true;
                            return;
                        }
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
                messageChange();
            });
        }
        else {
            message("Please enter a valid site.", "red", 95);
        }
    }
    else {
        chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
            var taburl = tabs[0].url;
            if (taburl.indexOf("chrome://") > -1) {
                message("You cannot report 'chrome://' pages.", "red", 110);
                return;
            }
            if (taburl == "chrome-extension://" + chrome.runtime.id + "/settings/settings.html") {
                message("You cannot report the settings page.", "red", 110);
                return;
            }
            else {
                report(taburl);
                return;
            }
        });
        return
    }
}

function whiteRecall(response) {
    if (response == "option1") {
        whiteSwitch = true;
    }
    else {
        whiteSwitch = false;
    }
    askBox("$clear");
    whiteList(whiteUrlHolder);
}
function whiteList(url) {
    if (url != '$currenturl') {
        if (url == "$box") {
            url = document.getElementById("white-box").value;
        }
        if (checkURL(url)) {
            url = trimURL(url);
            whiteUrlHolder = url;
            chrome.storage.local.get(null, function (obj) {
                for (var i = 0; i < obj.blacklist.length; i++) {
                    if (obj.blacklist[i] == url) {
                        if (!whiteAlready) {
                            whiteAlready = true;
                            askBox("That site is on your blacklist. Would you like to switch it?", "Yes", "No", 130, whiteRecall);
                            return;
                        }
                        whiteAlready = false;
                        if (whiteSwitch) {
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
                        else {
                            whiteSwitch = true;
                            return;
                        }
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
                    if (!already) {
                    }
                }
                messageChange();

            });
        }
        else {
            message("Please enter a valid site.", "red", 95);
        }
    }
    else {
        chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
            var taburl = tabs[0].url;
            if (taburl.indexOf("chrome://") > -1) {
                message("You cannot whitelist 'chrome://' pages.", "red", 110);
                return;
            }
            if (taburl == "chrome-extension://" + chrome.runtime.id + "/settings/settings.html") {
                message("You cannot whitelist the settings page.", "red", 110);
                return;
            }
            else {
                whiteList(taburl);
                return;
            }
        });
        return
    }
}


function after(response) {
    alert(response);
}



function dropDown() {


        $("#body-div").animate({ top: "150px" }, 225);   
        $("#logo").animate({ top: "-25px" }, 225);          
        $("#head").animate({ top: "-25px" }, 225);         
        $("#head-div").animate({ top: "-15px" }, 375);     
        $("#container").animate({ height: "575" }, 225);  

        checkInternet();
    

}

document.addEventListener('DOMContentLoaded', function () {

    $("#alert-div").hide();

    

    var reportButton = document.getElementById('reportButton');
    var reportCurrentButton = document.getElementById('reportCurrentButton');
    var whiteButton = document.getElementById('whiteButton');
    var whiteCurrentButton = document.getElementById('whiteCurrentButton');
    var settingsButton = document.getElementById('settingsButton');
    var logo = document.getElementById('logo');
    var help = document.getElementById('helpButton');
    var option1Button = document.getElementById('alertOption1');
    var option2Button = document.getElementById('alertOption2');

    
    
    option1Button.addEventListener('click', function () {
        messageVal = "option1";
        afterFunc(messageVal);
    });
    option2Button.addEventListener('click', function () {
        messageVal = "option2";
        afterFunc(messageVal);
    });

    document.getElementById('report-box').onkeypress = function (e) {
        if (!e) e = window.event;
        var keyCode = e.keyCode || e.which;
        if (keyCode == '13') {
            report(document.getElementById("report-box").value);
            document.getElementById("report-box").value = "";
            return false;
        }
    }
    document.getElementById('white-box').onkeypress = function (e) {
        if (!e) e = window.event;
        var keyCode = e.keyCode || e.which;
        if (keyCode == '13') {
            whiteList(document.getElementById("white-box").value);
            document.getElementById("white-box").value = "";
            return false;
        }
    }

    reportButton.addEventListener('click', function () {
        report(document.getElementById("report-box").value);
        document.getElementById("report-box").value = "";
    });
    reportCurrentButton.addEventListener('click', function () {
        report("$currenturl");
    });


    whiteButton.addEventListener('click', function () {
        whiteList(document.getElementById("white-box").value);
        document.getElementById("white-box").value = "";
    });
    whiteCurrentButton.addEventListener('click', function () {
        whiteList("$currenturl");
        
    });


    settingsButton.addEventListener('click', function () {
        chrome.tabs.create({ url: "settings/settings.html" });
    });
    help.addEventListener('click', function () {
        //getStorage();



        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, { action: "testPost"}, function (response) {
                
            });
        });


        
    })

    chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        
        if (request.event == "report") {
            tabAlert("GOT IT");
            reportSwitch = true;
            reportAlready = true;
            report(request.site);
        }
        else if (request.event == "white") {
            tabAlert("GOT IT");
            whiteSwitch = true;
            whiteAlready = true;
            whiteList(request.site);

        }
    }
);

    setTimeout(dropDown, 10);

});

