sap.ui.controller("ui.view.About", {

	onInit : function () {
		this._router = sap.ui.core.UIComponent.getRouterFor(this);
		this._router.getTargets().getTarget("about").attachDisplay(this._handleDisplay, this);
	},

	_msg : "<div class='titlesNotFound'>About page.</div>",

	_handleDisplay : function (oEvent) {
		var oData = oEvent.getParameter("data");
		var html = this._msg;
		this.getView().byId("msgHtml").setContent(html);
	},

	handleNavBack : function () {
		this._router._myNavBack();
	}
});