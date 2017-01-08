sap.ui.define([
	'sap/ui/core/UIComponent',
	'sap/m/routing/Router',
	'sap/ui/model/resource/ResourceModel',
	'sap/ui/model/odata/ODataModel',
	'sap/ui/model/json/JSONModel'
], function (UIComponent,
			Router,
			ResourceModel,
			ODataModel,
			JSONModel) {

	return UIComponent.extend("ui.Component", {

		metadata: {
			includes : ["css/style.css"],
			routing: {
				config: {
					routerClass: Router,
					viewType: "XML",
					viewPath: "ui.view",
					controlId: "splitApp",
					transition: "slide",
					bypassed: {
						target: ["home" , "notFound"]
					}
				},
				routes: [
					{
						pattern: "",
						name: "home",
						target: "home"
					},
                    {
                        pattern: "welcome",
                        name: "welcome",
                        target: ["home", "welcomeView"]
                    },
					{
						pattern: "category/{id}",
						name: "category",
						target: "categoryView"
					},
					{
						pattern: "category/{id}/product/{productId}",
						name: "product",
						target: ["categoryView", "productView"]
					},
					{
						pattern: "cart",
						name: "cart",
						target: "cart"
					},
                    {
						pattern: "product/{productId}",
						name: "cartProduct",
						target: ["home" , "productView"]
					}
				],
				targets: {
					productView: {
						viewName: "Product",
						viewLevel: 3,
						controlAggregation: "detailPages"
					},
					categoryView: {
						viewName: "Category",
						viewLevel: 2,
						controlAggregation: "masterPages"
					},
					notFound: {
						viewName: "NotFound",
						viewLevel: 3,
						controlAggregation: "detailPages"
					},
					welcomeView: {
						viewName: "Welcome",
						viewLevel: 3,
						controlAggregation: "detailPages"
					},
					home: {
						viewName: "Home",
						viewLevel: 1,
						controlAggregation: "masterPages"
					},
					cart: {
						viewName: "Cart",
						controlAggregation: "masterPages"
					}
				}
			}
		},

		init: function () {            
            sap.ui.getCore().loadLibrary("openui5.googlemaps")
            openui5.googlemaps.ScriptsUtil.setApiKey('AIzaSyB_HBiJ0FxG1JlgD9KwlDNKYZTJ-ulQm_o');
            
			// call overwritten init (calls createContent)
			UIComponent.prototype.init.apply(this, arguments);

			// set i18n model
			this.setLanguageB("EN");

			var oModel = new ODataModel("/sap/opu/odata/IWBEP/EPM_DEVELOPER_SCENARIO_SRV/", true);
			oModel.setDefaultCountMode("None");

			this.setModel(oModel);

			//create and set cart model
			var oCartModel = new JSONModel({
				entries: [],
				totalPrice: "0",
				showEditAndProceedButton: false
			});
			this.setModel(oCartModel, "cartProducts");


			// set device model
			var oDeviceModel = new JSONModel({
				isTouch: sap.ui.Device.support.touch,
				isNoTouch: !sap.ui.Device.support.touch,
				isPhone: sap.ui.Device.system.phone,
				isNoPhone: !sap.ui.Device.system.phone,
				listMode: (sap.ui.Device.system.phone) ? "None" : "SingleSelectMaster",
				listItemType: (sap.ui.Device.system.phone) ? "Active" : "Inactive"
			});
			oDeviceModel.setDefaultBindingMode("OneWay");
			this.setModel(oDeviceModel, "device");

			this._router = this.getRouter();

			//navigate to initial page for !phone
			if (!sap.ui.Device.system.phone) {
				this._router.getTargets().display("welcomeView");
			}

			// initialize the router
			this._router.initialize();
		},

		myNavBack : function () {
			var oHistory = sap.ui.core.routing.History.getInstance();
			var oPrevHash = oHistory.getPreviousHash();
			if (oPrevHash !== undefined) {
				window.history.go(-1);
			} else {
				this._router.navTo("home", {}, true);
			}
		},
        
        setLanguageB : function(lan) {
            // set i18n model
			var i18n = new ResourceModel({
				bundleName: "ui.i18n.i18n"
			});
            //using the CORE throws an error at the moment
//            sap.ui.getCore().setModel(i18n, "i18n");
            sap.ui.getCore().getConfiguration().setLanguage(lan);
            this.setModel(i18n, "i18n");
        },

		createContent: function () {
			// create root view
			return sap.ui.view({
				viewName: "ui.view.App",
				type: "XML"
			});
		}
	});

});
