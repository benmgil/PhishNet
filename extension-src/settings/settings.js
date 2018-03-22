var messageVal = "$null";
var reportAlready = false;
var whiteAlready = false;
var deleteAlready = false;
var moveAlready = false;
var moveMultipleAlready = false;
var deleteMultipleAlready = false;
var reportSwitch = true;
var whiteSwitch = true;
var deleteSwitch = true;
var moveSwitch = true;
var moveMultipleSwitch = true;
var deleteMultipleSwitch = true;
var reportUrlHolder;
var whiteUrlHolder;
var deleteSelectHolder;
var moveSelectHolder;
var moveMultipleIdHolder;
var moveMultipleArrayHolder;
var deleteMultipleIdHolder;
var deleteMultipleArrayHolder;

var prevDelete = true;

var afterFunc = function () { }




function checkInternet() {

    $.ajax({
        url: "http://www.google.com/",
        context: document.body,
        error: function (jqXHR, exception) {
            askBox("You are not connected to the internet. Click OK to retry.", "$statement", "", 2000, internetCallback);
            
        },
        success: function () {
            askBox("$clear");
        }
    })

}

function internetCallback() {
    
    checkInternet();
}



function serverReport(site) {
    $.ajax({                                                            
        type: "POST",
        url: "http://vestrada.pw/phishnet/post.php",
        data: "Action=report&SiteName="+site+"&User="+chrome.runtime.id,
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
        if (button.id != "number-box") {
            var id = '#' + button.id;
            if (!(id == "#settingsButton" || id == "#helpButton")) {
                $(id).animate({ backgroundColor: "#333333", color: "#666666" }, 250, function () {   
                    button.className = "noHover";

                    button.disabled = true;
                });
            }
        }
        else {
            $("#number-box").animate({ backgroundColor: "#333333", color: "#666666" }, 250, function () {

            });
        }
    }

    if (val == "enable") {
        if (button.id != "number-box") {
            var id = button.id;
            var defaultColor = "#5e62a8";
            var defaultText = "#000000";
            var white = "#ffffff";
            var black = "#000000";
        
            if (id == "whiteAddButton" || id == "whiteDeleteButton" || id == "blackMoveButton") {
                defaultColor = white;
            }
            if (id == "blackAddButton" || id == "blackDeleteButton" || id == "whiteMoveButton") {
                defaultColor = black;
                defaultText = white;
            }

      
        
            var id = '#' + button.id;
            if (!(id == "#settingsButton" || id == "#helpButton")) {
                $(id).animate({ backgroundColor: defaultColor, color: defaultText }, 250, function () {
                    button.className = "optionButton";

                    button.disabled = false;
                });
            }
        }
        else {
            $("#number-box").animate({ backgroundColor: "#0e2258", color: "#ffffff" }, 250, function () {
                
            });
        }
    }
}

function refreshLists() {
    chrome.storage.local.get(null, function (val) {
        var whiteSelect = document.getElementById("whiteList-select");
        var blackSelect = document.getElementById("blackList-select");
        var blackList = val.blacklist;
        var whiteList = val.whitelist;
        blackList = blackList.sort();
        whiteList = whiteList.sort();

       

        for (var i = whiteSelect.options.length - 1 ; i >= 0 ; i--) {
            whiteSelect.remove(i);
        }
        for (var i = blackSelect.options.length - 1 ; i >= 0 ; i--) {
            blackSelect.remove(i);
        }

        if (whiteList.length == 0) {
        }
        else {
            for (var i = 0; i < whiteList.length; i++) {
                var option = document.createElement("option");
                option.value = whiteList[i];
                option.text = whiteList[i];
                option.className = "option-hover";
                whiteSelect.appendChild(option);
            }
        }

        if (blackList.length == 0) {
        }
        else {
            for (var i = 0; i < blackList.length; i++) {
                var option = document.createElement("option");
                option.value = blackList[i];
                option.text = blackList[i];
                option.className = "option-hover";

                blackSelect.appendChild(option);
            }
        }
    });
}


function askBox(message, option1, option2, height, callback) {
    var time = 200;
    var length = message.length;
    lines = Math.ceil(length/60);
    height = 120 + (25 * (lines - 1));
    var width = 500;
    if (length < 60) {
        width = width * (length / 60);
    }

    if (option1 != "$statement") {
        if (message != "$clear") {
            $("#alert-div").height(height);
            $("#alert-div").width(width);
            $("#alert-div").show();

            $("#alertOption1").show();
            $("#divider").show();
            $("#alertOption2").show();

            $('#alert-div').animate({ left: "50%"}, time);

            document.getElementById("whiteList-select").disabled = true;
            document.getElementById("blackList-select").disabled = true;
            var array = document.getElementById("whiteList-select").options;
            for (var i = 0; i < array.length; i++) {
                array[i].className = "option-noHover";
            }
            array = document.getElementById("blackList-select").options;
            for (var i = 0; i < array.length; i++) {
                array[i].className = "option-noHover";
            }


            $('#number-box').attr('disabled', 'disabled');
            $('.addSite-form').attr('disabled', 'disabled');
            $('.button').attr('disabled', 'disabled');

            changeButton(document.getElementById("whiteAddButton"), "disable");
            changeButton(document.getElementById("whiteDeleteButton"), "disable");
            changeButton(document.getElementById("whiteMoveButton"), "disable");
            changeButton(document.getElementById("blackAddButton"), "disable");
            changeButton(document.getElementById("blackMoveButton"), "disable");
            changeButton(document.getElementById("blackDeleteButton"), "disable");
            changeButton(document.getElementById("number-box"), "disable");

            document.getElementById("alertMessage").innerText = message;
            document.getElementById("alertOption1").innerText = option1;
            document.getElementById("alertOption2").innerText = option2;

            afterFunc = callback;

        }
        else {

            $("#alert-div").animate({ left: "0%"}, time, function () {
                $("#alert-div").hide();

                $("#alertOption1").hide();
                $("#divider").hide();
                $("#alertOption2").hide();
            });
            $('#number-box').removeAttr("disabled");

            $('.addSite-form').removeAttr("disabled");
            document.getElementById("whiteList-select").disabled = false;
            document.getElementById("blackList-select").disabled = false;
            var array = document.getElementById("whiteList-select").options;
            for (var i = 0; i < array.length; i++) {
                array[i].className = "option-hover";
            }
            array = document.getElementById("blackList-select").options;
            for (var i = 0; i < array.length; i++) {
                array[i].className = "option-hover";
            }

            changeButton(document.getElementById("whiteAddButton"), "enable");
            changeButton(document.getElementById("whiteDeleteButton"), "enable");
            changeButton(document.getElementById("whiteMoveButton"), "enable");
            changeButton(document.getElementById("blackAddButton"), "enable");
            changeButton(document.getElementById("blackMoveButton"), "enable");
            changeButton(document.getElementById("blackDeleteButton"), "enable");
            changeButton(document.getElementById("number-box"), "enable");


        }
    }
    else {
        if (message != "$clear") {
            $("#alert-div").show();
            $("#alert-div").height(height);
            $("#alert-div").width(width);

            $("#alertOption1").show();
            $("#alertOption2").hide();
            $("#divider").hide();
            $('#alert-div').animate({ left: "50%"}, time);

            option1 = "OK";

            $('#number-box').attr('disabled', 'disabled');
            $('.addSite-form').attr('disabled', 'disabled');
            $('.button').attr('disabled', 'disabled');
            document.getElementById("whiteList-select").disabled = true;
            document.getElementById("blackList-select").disabled = true;
            var array = document.getElementById("whiteList-select").options;
            for (var i = 0; i < array.length; i++) {
                array[i].className = "option-noHover";
            }
            array = document.getElementById("blackList-select").options;
            for (var i = 0; i < array.length; i++) {
                array[i].className = "option-noHover";
            }

            changeButton(document.getElementById("whiteAddButton"), "disable");
            changeButton(document.getElementById("whiteDeleteButton"), "disable");
            changeButton(document.getElementById("whiteMoveButton"), "disable");
            changeButton(document.getElementById("blackAddButton"), "disable");
            changeButton(document.getElementById("blackMoveButton"), "disable");
            changeButton(document.getElementById("blackDeleteButton"), "disable");
            changeButton(document.getElementById("number-box"), "disable");


            document.getElementById("alertMessage").innerText = message;
            document.getElementById("alertOption1").innerText = option1;
            document.getElementById("alertOption2").innerText = option2;

            afterFunc = callback;
        }
        else {
            $("#alert-div").animate({ left: "0%" }, time, function () {
                $("#alert-div").hide();
                $("#alertOption1").hide();
                $("#alertOption2").hide();
                $("#divider").hide();
            });

            $('#number-box').removeAttr("disabled");
            document.getElementById("whiteList-select").disabled = false;
            document.getElementById("blackList-select").disabled = false;
            var array = document.getElementById("whiteList-select").options;
            for (var i = 0; i < array.length; i++) {
                array[i].className = "option-noHover";
            }
            array = document.getElementById("blackList-select").options;
            for (var i = 0; i < array.length; i++) {
                array[i].className = "option-noHover";
            }
            $('.addSite-form').removeAttr("disabled");
            var array = document.getElementsByClassName("button");


            changeButton(document.getElementById("whiteAddButton"), "enable");
            changeButton(document.getElementById("whiteDeleteButton"), "enable");
            changeButton(document.getElementById("whiteMoveButton"), "enable");
            changeButton(document.getElementById("blackAddButton"), "enable");
            changeButton(document.getElementById("blackMoveButton"), "enable");
            changeButton(document.getElementById("blackDeleteButton"), "enable");
            changeButton(document.getElementById("number-box"), "enable");

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
function report(url, moveCode) {
    

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
                            askBox("That site is on your whitelist. Would you like to switch it?", "Yes", "No", 175, reportRecall);
                            return;
                        }
                        reportAlready = false;
                        if (reportSwitch) {
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
                refreshLists();
                messageChange();

            });
        }
        else {
            message("Please enter a valid site.", "red", 130);
        }
    }
    else {
        message("$blank");
        chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
            report(tabs[0].url);
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
function whiteList(url, moveCode) {
    


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
                            askBox("That site is on your blacklist. Would you like to switch it?", "Yes", "No", 175, whiteRecall);
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
                refreshLists();
                messageChange();

            });
        }
        else {
            message("Please enter a valid site.", "red", 250);
        }
    }
    else {
        message("$blank");
        chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
            whiteList(tabs[0].url);
        });
        return
    }
}

function deleteMultipleRecall(response) {
    if (response == "option1") {
        deleteMultipleSwitch = true;
    }
    else {
        deleteMultipleSwitch = false;
    }
    askBox("$clear");
    deleteMultiple(deleteMultipleIdHolder, deleteMultipleArrayHolder);
}
function deleteMultiple(selectid, selected) {
    var select = document.getElementById(selectid);
    
    deleteMultipleIdHolder = selectid;
    deleteMultipleArrayHolder = selected;

    if (selectid == "blackList-select") {
        list = "blacklist";
    }
    else {
        list = "whitelist";
    }
    if (!deleteMultipleAlready) {
        deleteMultipleAlready = true;;
        askBox("Are you sure you would like to delete multiple sites from the "+list+"?", "Yes", "No", 175, deleteMultipleRecall);
        return;
    }
    deleteMultipleAlready = false;
    if (deleteMultipleSwitch) {
        deleteMultipleSwitch = false;

        if (select.id == "whiteList-select") {
            chrome.storage.local.get(null, function (obj) {
                var newWhite = new Array();
                for (var j = obj.whitelist.length - 1; j >= 0; j--) {
                    var listSite = obj.whitelist[j];
                    var inthere = false;
                    for (var i = 0; i < selected.length; i++) {
                        var selectedSite = selected[i]
                        if (selectedSite == listSite) {
                            inthere = true;
                            break;
                        }
                    }
                    if (!inthere) {
                        newWhite.push(obj.whitelist[j]);
                    }
                }
                newWhite.sort();
                chrome.storage.local.set({ 'whitelist': newWhite }, function () {
                });
                refreshLists();
            });
        }
        else if (select.id == "blackList-select") {
            chrome.storage.local.get(null, function (obj) {
                var newBlack = new Array();
                for (var j = obj.blacklist.length - 1; j >= 0; j--) {
                    var listSite = obj.blacklist[j];
                    var inthere = false;
                    for (var i = 0; i < selected.length; i++) {
                        var selectedSite = selected[i]
                        if (selectedSite == listSite) {
                            inthere = true;
                            serverUnreport(listSite);
                            break;
                        }
                    }
                    if (!inthere) {
                        newBlack.push(obj.blacklist[j]);
                    }
                }
                newBlack.sort();
                chrome.storage.local.set({ 'blacklist': newBlack }, function () {

                });
                refreshLists();
            });
        }

        messageChange();
    }
}

function deleteRecall(response) {
    if (response == "option1") {
        deleteSwitch = true;
    }
    else {
        deleteSwitch = false;
    }
    askBox("$clear");
    deleteOption(deleteSelectHolder);
}

function deleteOption(selectid) {
    var select = document.getElementById(selectid);
    var selected = [];
    var numberSelected = 0;
    for (var i = 0; i < select.options.length; i++) {
        if (select.options[i].selected) {
            numberSelected += 1;
            selected.push(select.options[i].text);
        }
    }
    if (numberSelected > 1) {
        deleteMultiple(selectid, selected);
    }
    else {
        deleteSelectHolder = selectid;
        var option = select.options[select.selectedIndex];
        if (option != undefined) {
            var site = option.text;
            if (!deleteAlready) {
                deleteAlready = true;
                askBox("Are you sure you would like to delete '" + site + "'?", "Yes", "No", 175, deleteRecall);
                return;
            }
            deleteAlready = false;
            if (deleteSwitch) {
                if (select.id == "whiteList-select") {
                    chrome.storage.local.get(null, function (obj) {
                        var newWhite = new Array();
                        for (var j = 0; j < obj.whitelist.length; j++) {
                            if (obj.whitelist[j] != site) {
                                newWhite.push(obj.whitelist[j]);
                            }
                        }
                        newWhite.sort();
                        chrome.storage.local.set({ 'whitelist': newWhite }, function () {
                            refreshLists();
                            messageChange();
                        });
                    });
                }
                else if (select.id == "blackList-select") {
                    chrome.storage.local.get(null, function (obj) {
                        var newBlack = new Array();
                        for (var j = 0; j < obj.blacklist.length; j++) {
                            if (obj.blacklist[j] != site) {
                                newBlack.push(obj.blacklist[j]);
                            }
                        }
                        newBlack.sort();
                        chrome.storage.local.set({ 'blacklist': newBlack }, function () {
                            refreshLists();
                            messageChange();
                            serverUnreport(site);
                        });
                    });
                }
            }

        }
        else {
            message("Please click a site to delete before deleting.", "red", 130);
        }
    }
}
function moveMultipleRecall(response) {
    if (response == "option1") {
        moveMultipleSwitch = true;
    }
    else {
        moveMultipleSwitch = false;
    }
    askBox("$clear");
    moveMultiple(moveMultipleIdHolder, moveMultipleArrayHolder);
}
function moveMultiple(selectid, selected) {
    moveMultipleArrayHolder = selected;
    moveMultipleIdHolder = selectid;
    var list;
    if (selectid == "blackList-select") {
        list = "whitelist";
    }
    else {
        list = "blacklist";
    }
    if (!moveMultipleAlready) {
        moveMultipleAlready = true;;
        askBox("Are you sure you would like to move multiple sites to the "+list+"?", "Yes", "No", 175, moveMultipleRecall);
        return;
    }
    moveMultipleAlready = false;
    if (moveMultipleSwitch) {
        moveMultipleSwitch = false;
        if (selectid == "blackList-select") {
            chrome.storage.local.get(null, function (obj) {
                var newBlack = new Array();
                for (var i = 0; i < obj.blacklist.length; i++) {
                    var inthere = false;
                    for (var j = 0; j < selected.length; j++) {
                        if (selected[j] == obj.blacklist[i]) {
                            serverUnreport(selected[j]);
                            inthere = true;
                        }
                    }
                    if (!inthere) {
                        newBlack.push(obj.blacklist[i]);
                    }
                }
                newBlack.sort();
                chrome.storage.local.set({ "blacklist": newBlack });
                if (obj.whitelist == undefined) {
                    chrome.storage.local.set({ 'blacklist': selected });
                }
                else {
                    var already = false;
                    var array = obj.whitelist;
                    for (var i = 0; i < selected.length; i++) {
                        array.push(selected[i]);
                    }
                    var filtered = new Array();
                    
                    for (var i = 0; i < array.length; i++) {
                        if (filtered.indexOf(array[i]) == -1) {
                            filtered.push(array[i]);
                            for (var j = 0; j < selected.length; j++) {
                                if (selected[j] == array[i]) {
                                }
                            }
                        }
                    }
                    filtered.sort();
                    chrome.storage.local.set({ 'whitelist': filtered });
                }
                refreshLists();
                messageChange();
            });
        }


        else if (selectid == "whiteList-select") {
            chrome.storage.local.get(null, function (obj) {

                var newWhite = new Array();
                for (var i = 0; i < obj.whitelist.length; i++) {
                    var inthere = false;
                    for (var j = 0; j < selected.length; j++) {
                        if (selected[j] == obj.whitelist[i]) {
                            inthere = true;
                        }
                    }
                    if (!inthere) {
                        newWhite.push(obj.whitelist[i]);
                    }
                }
                newWhite.sort();
                chrome.storage.local.set({ "whitelist": newWhite });


                if (obj.blacklist == undefined) {
                    chrome.storage.local.set({ 'blacklist': selected });
                }
                else {
                    var already = false;
                    var array = obj.blacklist;
                    for (var i = 0; i < selected.length; i++) {
                        array.push(selected[i]);
                    }
                    var filtered = new Array();

                    for (var i = 0; i < array.length; i++) {
                        if (filtered.indexOf(array[i]) == -1) {
                            filtered.push(array[i]);
                            for (var j = 0; j < selected.length; j++) {
                                if (selected[j] == array[i]) {
                                    serverReport(selected[j]);
                                }
                            }
                        }
                    }

                    filtered.sort();
                    chrome.storage.local.set({ 'blacklist': filtered });

                }
                refreshLists();
                messageChange();

            });
        }

    }

}

function moveRecall(response) {
    if (response == "option1") {
        moveSwitch = true;
    }
    else {
        moveSwitch = false;
    }
    askBox("$clear");
    moveOption(moveSelectHolder);
}
function moveOption(selectid) {
    var select = document.getElementById(selectid);
    var selected = [];
    var numberSelected = 0;
    for (var i = 0; i < select.options.length; i++) {
        if (select.options[i].selected) {
            numberSelected += 1;
            selected.push(select.options[i].text);
        }
    }
    if (numberSelected > 1) {
        moveMultiple(selectid, selected);
    }
    else {

        moveSelectHolder = selectid;
        var listName;
        if (selectid == "whiteList-select") {
            listName = "blacklist";
        }
        if (selectid == "blackList-select") {
            listName = "whitelist";
        }
        var option = select.options[select.selectedIndex];
        if (option != undefined) {
            var site = option.text;
            if (!moveAlready) {
                moveAlready = true;
                askBox("Are you sure you would like to move '" + site + "' to the " + listName + "?", "Yes", "No", 175, moveRecall);
                return;
            }
            moveAlready = false;
            if (moveSwitch) {

                if (select.id == "whiteList-select") {
                    


                    reportSwitch = true;
                    reportAlready = true;
                    report(site);
                }
                else if (select.id == "blackList-select") {
                    


                    whiteSwitch = true;
                    whiteAlready = true;
                    whiteList(site);
                }
            }

        }
        else {
            message("Please click a site to move before you click the button.", "red", 130);
        }
    }
}


document.addEventListener('DOMContentLoaded', function () {
    $("#alert-div").hide();
    
    
    
    
    refreshLists();
    chrome.storage.local.get(null, function (obj) {
        var number = obj.number;
        if (number == "") {
            number = 0;
        }
        document.getElementById("number-box").value = number;
    });

    document.getElementById("alertOption1").addEventListener('click', function () {
        messageVal = "option1";
        afterFunc(messageVal);
    });
    document.getElementById("alertOption2").addEventListener('click', function () {
        messageVal = "option2";
        afterFunc(messageVal);
    });


    var whiteAddButton = document.getElementById("whiteAddButton");
    var whiteMoveButton = document.getElementById("whiteMoveButton");
    var whiteDeleteButton = document.getElementById("whiteDeleteButton");
    var blackAddButton = document.getElementById("blackAddButton");
    var blackMoveButton = document.getElementById("blackMoveButton");
    var blackDeleteButton = document.getElementById("blackDeleteButton");
    
    whiteAddButton.addEventListener('click', function () {
        whiteList(document.getElementById("whitelist-add").value);
        document.getElementById("whitelist-add").value = "";
    });

    blackAddButton.addEventListener('click', function () {
        report(document.getElementById("blacklist-add").value);
        document.getElementById("blacklist-add").value = "";
    });
    
    whiteDeleteButton.addEventListener('click', function () {
        var select = document.getElementById("whiteList-select");
        deleteOption("whiteList-select");
    });
    blackDeleteButton.addEventListener('click', function () {
        var select = document.getElementById("blackList-select");
        deleteOption("blackList-select");
    });
    whiteMoveButton.addEventListener('click', function () {
        moveOption("whiteList-select");
    });
    blackMoveButton.addEventListener('click', function () {
        moveOption("blackList-select");
    });

    document.getElementById('whitelist-add').onkeypress = function (e) {
        if (!e) e = window.event;
        var keyCode = e.keyCode || e.which;
        if (keyCode == '13') {
            whiteList(document.getElementById("whitelist-add").value);
            document.getElementById("whitelist-add").value = "";
            return false;
        }
    }
    document.getElementById('blacklist-add').onkeypress = function (e) {
        if (!e) e = window.event;
        var keyCode = e.keyCode || e.which;
        if (keyCode == '13') {
            report(document.getElementById("blacklist-add").value);
            document.getElementById("blacklist-add").value = "";
            return false;
        }
    }
    $("#number-box").bind('keyup mouseup', function () {
        var number = document.getElementById("number-box").value;
        chrome.storage.local.set({ 'number': number }, function () { messageChange(); });
    });

    document.getElementById("number-box").addEventListener("blur", function () {
        if (document.getElementById("number-box").value == "") {
            document.getElementById("number-box").value = 0;
        }
    });

    $("#number-box").keydown(function (e) {
        var key = e.which;
        var allowedKeys = [48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 8, 9, 37, 39]
        var allow = false;
        for (var i = 0; i < allowedKeys.length; i++) {
            if (key == allowedKeys[i]) {
                allow = true;
                break;
            }
        }
        if (!allow) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }
       
    });
    

   
    checkInternet();

});