var tickerData = null;
var btcUSDPrice = 0;

$(document).ready(function() {
	updateTickerData();
});

$(window).bind("hashchange", function() {
	setTimeout(updateTotalUSD, 1000);
});

function updateTotalUSD() {
	if ($("#loadingDiv").text() == "") {
		$("#tradeHistoryTable tbody tr").each(function(i, element) {
			var totalElement = $($(element).children()[7]);
			var totalPriceArgs = totalElement.text().split(" ");
			
			var totalPrice = parseFloat(totalPriceArgs[0]);
			var totalCurrency = totalPriceArgs[1];
			
			if (totalCurrency == "USDT") {
				totalPriceUSD = totalPrice;
			}
			else {
				var totalPriceUSD = totalPrice * btcUSDPrice;
				if (totalCurrency != "BTC") {
					var conversionRate = parseFloat(tickerData["BTC_" + totalCurrency]["last"]);
					totalPriceUSD *= conversionRate;
				}
			}
			
			totalPriceUSD = totalPriceUSD.toFixed(8);
			
			$(element).children("td:last").before("<td class=\"currency\">$" + totalPriceUSD + "</td>");
		});
	}
	else {
		setTimeout(updateTotalUSD, 1000);
	}
}

function onAnalysisPage() {
	return $(".profitLoss").is(":visible") || (window.location.hash != "");
}

function updateTickerData() {
	$.getJSON("https://poloniex.com/public?command=returnTicker", function (data) {
		var btcKey = "USDT_BTC";
		
		if (btcKey in data) {
			tickerData = data;
			
			btcUSDPrice = parseFloat(data[btcKey]["last"]);			
			
			updatePage();
		}
		else {
			setTimeout(updateTickerData, 1000);
		}
	}).fail(function(jqXHR, textStatus, errorThrown) {
		setTimeout(updateTickerData, 1000);
	});
}

function updatePage() {
	if ($("#total-usd").length == 0) {
		$("#tradeHistoryTable th:last").before("<th id=\"total-usd\">Total (USD)</th>");
	}
	
	setTimeout(updateTotalUSD, 1000);
	
	// changePage hook
	var origChangePage = changePage;
	changePage = function(page) {
		origChangePage(page);
		setTimeout(updateTotalUSD, 1000);
	}
}