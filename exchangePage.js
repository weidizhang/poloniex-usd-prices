/*
 * @author Weidi Zhang
 */

var tradeFrom = "btc";
var updateInProgress = false;

$(document).ready(function() {	
	setInterval(function() {
		updateCurrentCurrency();
		
		if (!updateInProgress) { // in case previous ticker fetch is still stuck
			updateTickerPrice();
		}
	}, 4000);
});

function updateTickerPrice() {	
	if (tradeFrom != "USDT") {
		updateInProgress = true;
		
		$.getJSON("https://poloniex.com/public?command=returnTicker", function (data) {
			var key = "USDT_" + tradeFrom;
			
			if (key in data) {
				var fromPrice = parseFloat(data[key]["last"]);
				
				updateUSDPrice(fromPrice);
			}
			else {
				udpateInProgress = false;
			}
		}).fail(function(jqXHR, textStatus, errorThrown) {
			updateInProgress = false;
		});
	}
	else {
		if ($("#hilights .row").length == 3) {
			$("#hilights .row:last").remove();
		}
	}
}

function updateCurrentCurrency() {
	var codes = $(".code").text().split("/");
	tradeFrom = codes[1];
}

function updateUSDPrice(fromPrice) {
	var currentPrice = parseFloat($(".lastPrice .info").text());
	var usdPrice = fromPrice * currentPrice;
	
	usdPrice = usdPrice.toFixed(8);
		
	if ($("#hilights .row").length < 3) {
		$("#hilights").append("<div class=\"row\"><div></div></div>");			
	}
		
	$("#hilights .row:last div").html("Last Price: <b>$" + usdPrice + "</b> USD");
	
	updateInProgress = false;
}