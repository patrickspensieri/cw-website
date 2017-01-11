sap.ui.controller("ui.view.Welcome", {

	onInit: function () {
//        this.getContactUsFragment().placeAt("contactUsSection");
	},

	onExit: function () {
		clearTimeout(this._iDelay);
	},
    
    _getVal: function(evt) {
			return sap.ui.getCore().byId(evt.getParameter('id')).getValue();
    },
    
    handleTelPress: function (evt) {
	   sap.m.URLHelper.triggerTel(this._getVal(evt));
    },
    
    handleTelPress: function (evt) {
        sap.m.URLHelper.triggerTel(this._getVal(evt));
    },

    handleSmsPress: function (evt) {
        sap.m.URLHelper.triggerSms(this._getVal(evt));
    },

    handleEmailPress: function (evt) {
        sap.m.URLHelper.triggerEmail(this._getVal(evt), "Info Request");
    },

    handleUrlPress: function (evt) {
        sap.m.URLHelper.redirect(this._getVal(evt), true);
    },
    
//    getContactUsFragment: function() {
//        var oView = this.getView();
//         var oFragment = oView.byId("contactUs");
//         // create dialog lazily
//         if (!oFragment) {
//            // create dialog via fragment factory
//            oFragment = sap.ui.xmlfragment(oView.getId(), "ui.view.fragment.ContactUs", this);
//		 // connect dialog to view (models, lifecycle)
//            oView.addDependent(oFragment);
//         }
//        return oFragment;
//    }
});