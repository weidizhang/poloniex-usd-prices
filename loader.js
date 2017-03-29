var script = document.createElement("script");
script.src = chrome.extension.getURL("main.js");
(document.head || document.documentElement).appendChild(script);

script.onload = function() {
	script.parentNode.removeChild(script);
};