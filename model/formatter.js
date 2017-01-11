 sap.ui.define(["sap/ui/core/format/NumberFormat"], function (NumberFormat) {
	"use strict";

	var mStatusState = {
		"L": "Success",
		"S": "Success",
		"O": "Warning"
	};

	var formatter = {
		price: function (value) {
			var numberFormat = NumberFormat.getFloatInstance({
				maxFractionDigits: 2,
				minFractionDigits: 2,
				groupingEnabled: true,
				groupingSeparator: ".",
				decimalSeparator: ","
			});
			return numberFormat.format(value);
		},

		totalPrice: function (value) {
			return this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("CART_TOTAL_PRICE") + ": " + formatter.price(value);
		},

		statusText: function (status) {
			var oBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();

			var mStatusText = {
				"L": oBundle.getText("STATUS_L"),
				"S": oBundle.getText("STATUS_S"),
				"O": oBundle.getText("STATUS_O")
			};

			return mStatusText[status] || status;
		},

		statusState: function (status) {
			return mStatusState[status] || "None";
		},

		streetViewUrl: function (sUrl) {
			return jQuery.sap.getResourcePath("ui/" + sUrl);
		}
	};

	return formatter;
});
