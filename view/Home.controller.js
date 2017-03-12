sap.ui.define([
	'sap/ui/core/mvc/Controller',
	'ui/model/formatter',
	'sap/ui/model/Filter',
	'sap/ui/model/FilterOperator',
    'sap/ui/model/resource/ResourceModel',
    'sap/m/MessageToast'
], function (Controller,
			 formatter,
			 Filter,
			 FilterOperator,
             ResourceModel,
             MessageToast) {
	"use strict";

	return Controller.extend("ui.view.Home", {
		formatter : formatter,

		onInit: function () {
            var oController = this;
            //set text for languageMenuButton
			var oComponent = this.getOwnerComponent();
			this._router = oComponent.getRouter();
			// trigger first search to set visibilities right
			this._search();
            //set the proper titles from i18n once list is rendered
            var list = this.getView().byId("welcomePageSectionList");
            list.onAfterRendering = function(){
                oController.setWelcomeSectionListTitle();
 		     };
            //subscribe to event bus, reset the text once language is changed
            // register for events
			var oBus = sap.ui.getCore().getEventBus();
			oBus.subscribe("home", "updateSection", this.setWelcomeSectionListTitle, this);

		},

		handleSearch: function () {
			this._search();
		},

		handleRefresh: function () {
			var that = this;

			// trigger search again and hide pullToRefresh when data ready
			var oProductList = this.getView().byId("productList");
			var oBinding = oProductList.getBinding("items");
			var fnHandler = function () {
				that.getView().byId("pullToRefresh").hide();
				oBinding.detachDataReceived(fnHandler);
			};
			oBinding.attachDataReceived(fnHandler);
			that._search();
		},

		_search: function () {
			var oView = this.getView();
			var oProductList = oView.byId("productList");
			var oCategoryList = oView.byId("categoryList");
			var oSearchField = oView.byId("searchField");

			// switch visibility of lists
			var bShowSearch = oSearchField.getValue().length !== 0;
			oProductList.toggleStyleClass("invisible", !bShowSearch);
			oCategoryList.toggleStyleClass("invisible", bShowSearch);

			if (bShowSearch) {
				this._changeNoDataTextToIndicateLoading(oProductList);
			}

			// filter product list
            // according to API, FilterOperator.Contains is not case sensitive, this is not the case
			var oBinding = oProductList.getBinding("items");
			if (oBinding) {
				if (bShowSearch) {
                    var oNameFilter = new Filter("Name", FilterOperator.Contains, oSearchField.getValue());
                    var oCityFilter = new Filter("City", FilterOperator.Contains, oSearchField.getValue());
                    var oFilter = new Filter([oNameFilter, oCityFilter]);
                    oBinding.filter(oFilter);
				} else {
					oBinding.filter([]);
				}
			}
		},
		_changeNoDataTextToIndicateLoading: function (oList) {
			var sOldNoDataText = oList.getNoDataText();
			oList.setNoDataText("Loading...");
			oList.attachEventOnce("updateFinished", function () {
				oList.setNoDataText(sOldNoDataText);
			});
		},
        
        handleWelcomeListItemPress: function(oEvent){
//            this._router.navTo("welcome"); 
            this._router.getTargets().display("welcomeView");
            //get the selected section
            var oBindContext = oEvent.getSource().getBindingContext();
			var oModel = oBindContext.getModel();
			var sSectionId = oModel.getData(oBindContext.getPath()).Section;
            //pass sSectionId to welcome page for automatic scrolling
            var oBus = sap.ui.getCore().getEventBus();
            oBus.publish("welcome", "scrollToSection", {"id" : sSectionId});

        },
        
        //draft
        handleHomePageListItemPress: function(oEvent){
            //if (not on home page)
            //  go to home page
            //always
            //  scroll to selected section
//			var oBindContext = oEvent.getSource().getBindingContext();
//			var oModel = oBindContext.getModel();
//			var sCategoryId = oModel.getData(oBindContext.getPath()).Category;
//			this._router.navTo("homePage", {id: sHomePageId}); 
        },

		handleCategoryListItemPress: function (oEvent) {
			var oBindContext = oEvent.getSource().getBindingContext();
			var oModel = oBindContext.getModel();
			var sCategoryId = oModel.getData(oBindContext.getPath()).Category;
			this._router.navTo("category", {id: sCategoryId});
		},

		handleProductListSelect: function (oEvent) {
			var oItem = oEvent.getParameter("listItem");
			this._showProduct(oItem);
		},

		handleProductListItemPress: function (oEvent) {
			var oItem = oEvent.getSource();
			this._showProduct(oItem);
		},

		_showProduct: function (oItem) {
			var oBindContext = oItem.getBindingContext();
			var oModel = oBindContext.getModel();
			var sId = oModel.getData(oBindContext.getPath()).PropertyId;
			this._router.navTo("cartProduct", {productId: sId}, !sap.ui.Device.system.phone);
		},

		handleCartButtonPress: function () {
			this._router.navTo("cart");
		},
        
        //draft
        setWelcomeSectionListTitle : function(){
            var oBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
            var list = this.getView().byId("welcomePageSectionList");
            var str = "";
            jQuery.each(list.getItems(), function(i, item) {
                str = item.getTitle();
                item.setTitle(oBundle.getText(str));           
            });
        }

	});
});