sap.ui.define(['sap/ui/test/Opa5'], function (Opa5) {
	return Opa5.extend("ui.test.arrangement.DeleteProductJourneyArrangement", {
		iStartMyApp : function () {
			return this.iStartMyAppInAFrame('../index.html?sap-ui-language=en');
		}
	});
});

