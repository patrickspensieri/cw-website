sap.ui.define([
	'sap/ui/core/mvc/Controller',
	'ui/model/formatter',
	'sap/m/MessageToast',
	'sap/m/MessageBox'
], function (Controller, formatter, MessageToast, MessageBox) {
	return Controller.extend("ui.view.Welcome", {
		formatter : formatter,

	onInit: function () {
        //set correct language
        this.getView().byId("languageMenuButton").setText(sap.ui.getCore().getConfiguration().getLanguage());
//        this.getContactUsFragment().placeAt("contactUsSection");
        //subscribe to eventbus for auto scrolling to selected section
        var oBus = sap.ui.getCore().getEventBus();
		oBus.subscribe("welcome", "scrollToSection", this.scrollToSection, this);
	},
        
    scrollToSection: function(sChannel, sEvent, data){
        var sSectionId = data.id;
        this.oObjectPageLayout = this.getView().byId("WelcomeObjectPageLayout");
        this.oTargetSubSection = this.getView().byId(sSectionId);
        //make a delayed call, looks better
        jQuery.sap.delayedCall(500, this.oObjectPageLayout, this.oObjectPageLayout.scrollToSection, [this.oTargetSubSection.getId()]);
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
        
    onLanguageMenuAction: function(oEvent) {
        //get selected language and pass param
        var oItem = oEvent.getParameter("item");
        if(oItem instanceof sap.m.MenuItem){
            sap.ui.getCore().getConfiguration().setLanguage(oItem.getText());
            this.getView().byId("languageMenuButton").setText(sap.ui.getCore().getConfiguration().getLanguage());
            // show message toast
            var oBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
            MessageToast.show(oBundle.getText("LANGUAGE_CHANGED"));
            //eventBus used as a test
            var oBus = sap.ui.getCore().getEventBus();
            oBus.publish("home", "updateSection");
        }
     }
    
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
});