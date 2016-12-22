sap.ui.define([
	'sap/ui/core/mvc/Controller',
	'ui/model/formatter',
	'sap/ui/Device',
	'sap/ui/model/Filter',
	'sap/ui/model/FilterOperator'
], function (Controller,
			 formatter,
			 Device,
			 Filter,
			 FilterOperator) {
	"use strict";

	return Controller.extend("ui.view.Category", {
		formatter : formatter,

		onInit : function () {
			var oComponent = this.getOwnerComponent();
			this._router = oComponent.getRouter();
			this._router.getRoute("category").attachMatched(this._loadCategory, this);
		},

		_loadCategory : function(oEvent) {
			var oProductList = this.getView().byId("productList");
			this._changeNoDataTextToIndicateLoading(oProductList);
			var oBinding = oProductList.getBinding("items");
			oBinding.attachDataReceived(this.fnDataReceived, this);
			var sId = oEvent.getParameter("arguments").id;
			this._sPropertyId = oEvent.getParameter("arguments").productId;
			this.getView().byId("page").setTitle(sId);
			var oFilter = new Filter("Category", FilterOperator.EQ, sId);
			oBinding.filter([ oFilter ]);
		},

		_changeNoDataTextToIndicateLoading: function (oList) {
			var sOldNoDataText = oList.getNoDataText();
			oList.setNoDataText("Loading...");
			oList.attachEventOnce("updateFinished", function() {oList.setNoDataText(sOldNoDataText);});
		},

		fnDataReceived: function() {
			var that = this,
				oList = this.getView().byId("productList");
			var aListItems = oList.getItems();
			aListItems.some(function(oItem) {
				if (oItem.getBindingContext().sPath === "/Products('" + that._sPropertyId + "')") {
					oList.setSelectedItem(oItem);
					return true;
				}
			});
		},

		handleProductListSelect : function (oEvent) {
			this._showProduct(oEvent);
		},

		handleProductListItemPress : function (oEvent) {
			this._showProduct(oEvent);
		},

		_showProduct: function (oEvent) {
			var oBindContext;
			if (sap.ui.Device.system.phone) {
				oBindContext = oEvent.getSource().getBindingContext();
			} else {
				oBindContext = oEvent.getSource().getSelectedItem().getBindingContext();
			}
			var oModel = oBindContext.getModel();
			var sCategoryId = oModel.getData(oBindContext.getPath()).Category;
			var sPropertyId = oModel.getData(oBindContext.getPath()).PropertyId;
//            here original
			this._router.navTo("product", {id: sCategoryId, productId: sPropertyId}, !Device.system.phone);
		},

		handleNavButtonPress : function () {
			this.getOwnerComponent().myNavBack();
		},

		handleCartButtonPress :  function () {
			this._router.navTo("cart");
		}
	});
});
