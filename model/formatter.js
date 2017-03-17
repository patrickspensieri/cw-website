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
        
        productCategory: function(categoryName){
          var oBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();

			var mCategoryName = {
				"Industrial": oBundle.getText("PROPERTY_CATEGORY_INDUSTRIAL"),
				"Retail": oBundle.getText("PROPERTY_CATEGORY_RETAIL"),
				"Office": oBundle.getText("PROPERTY_CATEGORY_OFFICE"),
                "_office": oBundle.getText("PROPERTY_CATEGORY_OFFICE"),
                "_retail": oBundle.getText("PROPERTY_CATEGORY_RETAIL"),
                "_industrial": oBundle.getText("PROPERTY_CATEGORY_INDUSTRIAL")
			};

			return mCategoryName[categoryName] || categoryName;
        },

        productType: function(type){
            var oBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
            
            var aTypeName = {
                "Multi-Residential": oBundle.getText("PROPERTY_TYPE_MULTI_RESIDENTIAL"), 
                "Investment": oBundle.getText("PROPERTY_TYPE_INVESTMENT"),
                "Redevelopment": oBundle.getText("PROPERTY_TYPE_REDEVELOPMENT"),
            };
            
            return aTypeName[type] || type;
        },
        
		statusState: function (status) {
			return mStatusState[status] || "None";
		},

		streetViewUrl: function (sUrl) {
			return jQuery.sap.getResourcePath("ui/" + sUrl);
		},
        
        visible: function(value){
            return (value != null);
        }
	};

	return formatter;
});
