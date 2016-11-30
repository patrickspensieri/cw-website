jQuery.sap.require("sap.ui.qunit.qunit-css");
jQuery.sap.require("sap.ui.thirdparty.qunit");
jQuery.sap.require("sap.ui.qunit.qunit-junit");
jQuery.sap.require("sap.ui.qunit.qunit-coverage");
jQuery.sap.require("sap.ui.thirdparty.sinon");
jQuery.sap.require("sap.ui.thirdparty.sinon-qunit");

/*
 global QUnit
 */
QUnit.config.autostart = false;

sap.ui.require([
		'sap/ui/test/Opa5',
		'sap/ui/test/opaQunit',
		'ui/test/AllJourneysConfig'
	], function (Opa5, opaTest, AllJourneysConfig) {
		"use strict"

		AllJourneysConfig.buyProductConfig();
		AllJourneysConfig.deleteProductConfig();

		sap.ui.require([
				'ui/test/BuyProductJourney',
				'ui/test/DeleteProductJourney'
			], function (BuyProductJourney, DeleteProductJourney) {


				BuyProductJourney.start(function (Given) {
						Given.iStartMyAppInAFrame('../index.html?responderOn=true');
					},
					function (Then) {
						Then.iTeardownMyAppFrame();
					}
				);

				DeleteProductJourney.start(
					function (Given) {
						Given.iStartMyAppInAFrame('../index.html?responderOn=true&sap-ui-language=en');
					},
					function (Then) {
						Then.iTeardownMyAppFrame();
					}
				);

				QUnit.start();

			}
		);

	}
);

