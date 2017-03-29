/*
 * @author Weidi Zhang
 */

var tradeFrom = "btc";

$(document).ready(function() {	
	disableIncompatibleFeatures();
	
	setInterval(function() {
		updateCurrentCurrency();
		updateUSDPrice();
	}, 2000);
});

function disableIncompatibleFeatures() {
	$(".settings").remove();
	$(".search").remove();
}

function updateCurrentCurrency() {
	var codes = $(".code").text().split("/");
	tradeFrom = codes[1].toLowerCase();
}

function updateUSDPrice() {
	if (tradeFrom != "usdt") {
		var fromPrice = parseFloat($("#marketRowusdt_" + tradeFrom + " .price").text());	
	
		var currentPrice = parseFloat($(".lastPrice .info").text());
		var usdPrice = fromPrice * currentPrice;
		
		usdPrice = usdPrice.toFixed(8);
		
		if ($("#hilights .row").length < 3) {
			$("#hilights").append("<div class=\"row\"><div></div></div>");			
		}
		
		$("#hilights .row:last div").html("Last Price: <b>$" + usdPrice + "</b> USD");
	}
	else {
		if ($("#hilights .row").length == 3) {
			$("#hilights .row:last").remove();
		}
	}
}