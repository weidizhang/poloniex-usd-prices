var path = window.location.pathname;
var scriptUrl;

if (path == "/exchange" || path == "/marginTrading") {
	scriptUrl = "exchangePage.js";
}
else if (path == "/tradeHistory") {
	scriptUrl = "historyPage.js";
}

var script = document.createElement("script");
script.src = chrome.extension.getURL(scriptUrl);
(document.head || document.documentElement).appendChild(script);

script.onload = function() {
	script.parentNode.removeChild(script);
};