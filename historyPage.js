var tickerData = null;
var btcUSDPrice = 0;

$(document).ready(function() {
	if (!onAnalysisPage()) {
		updateTickerData();
	}
});

$(window).bind("hashchange", function() {
	// to-do: functionality/support for analyzation pages for specific coins
	// for now: remove additional USD table heading
	if (onAnalysisPage()) {
		$("#total-usd").remove();
	}
	else {
		$("#tradeHistoryTable th:last").before("<th id=\"total-usd\">Total (USD)</th>");
		setTimeout(updateTotalUSD, 1000);
	}
});

function updateTotalUSD() {
	if ($("#loadingDiv").text() == "") {
		$("#tradeHistoryTableBody tr").each(function(i, element) {
			var totalElement = $($(element).children(".currency")[3]);
			var totalPriceArgs = totalElement.text().split(" ");
			
			var totalPrice = parseFloat(totalPriceArgs[0]);
			var totalCurrency = totalPriceArgs[1];
			
			var totalPriceUSD = totalPrice * btcUSDPrice;
			if (totalCurrency != "BTC") {
				var conversionRate = parseFloat(tickerData["BTC_" + totalCurrency]["last"]);
				totalPriceUSD *= conversionRate;
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
	$("#tradeHistoryTable th:last").before("<th id=\"total-usd\">Total (USD)</th>");
		
	setTimeout(updateTotalUSD, 1000);
	
	// changePage hook
	var origChangePage = changePage;
	changePage = function(page) {
		origChangePage(page);
		setTimeout(updateTotalUSD, 1000);
	}
}