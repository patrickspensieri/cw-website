sap.ui.define([
		'sap/ui/test/Opa5',
		'ui/test/arrangement/DeleteProductJourneyArrangement',
		'ui/test/arrangement/BuyProductJourneyArrangement',
		'ui/test/action/BuyProductJourneyAction',
		'ui/test/assertion/BuyProductJourneyAssertion'
	], function (Opa5, DeleteProductJourneyArrangement, BuyProductJourneyArrangement, BuyProductJourneyAction, BuyProductJourneyAssertion) {
		"use strict";

		return {

			buyProductConfig : function(){
				Opa5.extendConfig({
					arrangements : new BuyProductJourneyArrangement(),
					actions : new BuyProductJourneyAction(),
					assertions : new BuyProductJourneyAssertion(),
					viewNamespace : "ui.view."
				});
			},

			deleteProductConfig : function(){
				Opa5.extendConfig({
					arrangements : new DeleteProductJourneyArrangement(),
					viewNamespace : "ui.view."
				});
			}

		};

	}
);
