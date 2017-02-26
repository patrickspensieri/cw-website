sap.ui.define([
	'sap/ui/core/mvc/Controller',
	'ui/model/formatter',
	'sap/m/MessageToast',
	'sap/m/MessageBox'
], function (Controller, formatter, MessageToast, MessageBox) {
	return Controller.extend("ui.view.Product", {
		formatter : formatter,

		onInit : function () {
			var oComponent = this.getOwnerComponent();

			this._router = oComponent.getRouter();
			this._router.getRoute("product").attachPatternMatched(this._routePatternMatched, this);
			this._router.getRoute("cartProduct").attachPatternMatched(this._routePatternMatched, this);

			// register for events
			var oBus = sap.ui.getCore().getEventBus();
			oBus.subscribe("shoppingCart", "updateProduct", this.fnUpdateProduct, this);
            //set correct language
            this.getView().byId("languageMenuButton").setText(sap.ui.getCore().getConfiguration().getLanguage());
		},

        //herehereherehere
		_routePatternMatched: function(oEvent) {
			var sId = oEvent.getParameter("arguments").productId,
				oView = this.getView(),
				sPath = "/Products('" + sId + "')";

			var oModel = oView.getModel();
			var oData = oModel.getData(sPath);
			oView.bindElement({
				path: sPath,
				events: {
					dataRequested: function () {
						oView.setBusy(true);
					},
					dataReceived: function () {
						oView.setBusy(false);
					}
				}
			});
			//if there is no data the model has to request new data
			if (!oData) {
				oView.setBusyIndicatorDelay(0);
				oView.getElementBinding().attachEventOnce("dataReceived", function() {
					// reset to default
					oView.setBusyIndicatorDelay(null);
					this._checkIfProductAvailable(sPath, sId);
				}.bind(this));
			}
		},

		fnUpdateProduct: function(sChannel, sEvent, oData) {
			var sPath = "/Products('" + oData.productId + "')";
			this.getView().bindElement(sPath);
			this._checkIfProductAvailable(sPath, oData.productId);
		},

		_checkIfProductAvailable: function(sPath, sId) {
			var oModel = this.getView().getModel();
			var oData = oModel.getData(sPath);

			// show not found page
			if (!oData) {
				this._router.getTargets().display("notFound", sId);
			}
		},

		handleAddButtonPress : function () {
			var oBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
			var oProduct = this.getView().getBindingContext().getObject();
			var sProdStatus = oProduct.status;
			var that = this;

			switch (sProdStatus) {
				case "D":
					//show message dialog
					MessageBox.show(
						oBundle.getText("PRODUCT_STATUS_DISCONTINUED_MSG"),{
							icon: MessageBox.Icon.ERROR,
							titles: oBundle.getText("PRODUCT_STATUS_DISCONTINUED_TITLE"),
							actions: [MessageBox.Action.CLOSE]
						});
					break;
				case "O":
					// show message dialog
					MessageBox.show(
						oBundle.getText("PRODUCT_STATUS_OUT_OF_STOCK_MSG"), {
							icon: MessageBox.Icon.QUESTION,
							title: oBundle.getText("PRODUCT_STATUS_OUT_OF_STOCK_TITLE"),
							actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
							onClose: function (oAction) {
								// order
								if (MessageBox.Action.OK === oAction) {
									that._addProduct(oProduct);
								}
							}
						});
					break;
				case "A":
					this._addProduct(oProduct);
					break;
				default:
					this._addProduct(oProduct);
					break;
			}
		},

		_addProduct: function(oProduct) {
			var oCartModel = this.getView().getModel("cartProducts");
			var oCartData = oCartModel.getData();
			var aCartEntries = oCartData.entries;

			// find existing entry for product
			var oEntry = null;
			for (var i = 0 ; i < aCartEntries.length ; i ++) {
				if (aCartEntries[i].PropertyId === oProduct.PropertyId) {
					oEntry = aCartEntries[i];
					break;
				}
			}

			if (oEntry === null) {
				// create new entry
				oEntry = {
					Id : jQuery.sap.uid(),
					Quantity : 1,
					Name : oProduct.Name,
					PropertyId : oProduct.PropertyId,
					ProductName : oProduct.Name,
					Price : oProduct.Price,
					City : oProduct.City,
					Status : oProduct.status,
					sqft : oProduct.sqft,
					streetViewUrl : oProduct.streetViewUrl
				};
				oCartData.entries[oCartData.entries.length] = oEntry;

			} else {
				// update existing entry
				oEntry.Quantity += 1;
			}

			// recalculate total price
			oCartData.totalPrice = 0;
			for (var j = 0 ; j < oCartData.entries.length ; j ++) {
				oCartData.totalPrice += parseFloat(oCartData.entries[j].Price) * oCartData.entries[j].Quantity;
			}

			//if there is at least one entry, the edit button is shown
			oCartData.showEditAndProceedButton = true;

			// update model
			oCartModel.setData(oCartData);

			var oBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
			MessageToast.show(oBundle.getText("PRODUCT_MSG_ADDED_TO_CART"));
		},

		handleCartButtonPress :  function () {
			this._router.navTo("cart");
		},

		handleNavButtonPress : function () {
			this.getOwnerComponent().myNavBack();
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
         },
      
        onOpenPDF : function () {
//             var oView = this.getView();
//             var oDialog = oView.byId("pdfDialog");
//             // create dialog lazily
//             if (!oDialog) {
//                // create dialog via fragment factory
//                oDialog = sap.ui.xmlfragment(oView.getId(), "ui.view.fragment.PDF");
//                oView.addDependent(oDialog);
//             }
//         oDialog.open();
            var oProduct = this.getView().getBindingContext().getObject();
			var sPdf = oProduct.pdf;
            if(sPdf){
                 window.open(sPdf);
            }
      }
	});
});