sap.ui.controller("ui.view.Welcome", {

	onInit: function () {
	},

	onExit: function () {
		clearTimeout(this._iDelay);
	}
});