angular.module("exampleApp", ["ngResource", "ngRoute"])
.constant("baseUrl", "http://localhost/angularjs/src/model/products.php")
.factory("productsResource", function($resource, baseUrl) {
	return $resource(baseUrl + "/" + ":id", {id: "@id"}, {create: {method: "POST"}, save: {method: "PUT"}});
})
.config(function($routeProvider, $locationProvider) {
	$locationProvider.html5Mode(true);

	$routeProvider.when("/list", {templateUrl: "/angularjs/tableView.html"});
	$routeProvider.when("/edit/:id", {templateUrl: "/angularjs/editorView.html", controller: "editCtrl"});
	$routeProvider.when("/edit/:id/:data*", {templateUrl: "/angularjs/editorView.html"});
	$routeProvider.when("/create", {templateUrl: "/angularjs/editorView.html", controller: "editCtrl"});
	$routeProvider.otherwise({templateUrl: "/angularjs/tableView.html", controller: "tableCtrl", resolve: {
		data: function(productsResource) {
			return productsResource.query();
		}
	}});
})
.controller("defaultCtrl", function($scope, $location, productsResource) {
	$scope.data = {};

	$scope.deleteProduct = function(product) {
		product.$delete().then(function() {
			$scope.data.products.splice($scope.data.products.indexOf(product), 1);
		});
		$location.path("/list");
	}

	$scope.createProduct = function(product) {
		new productsResource(product).$create().then(function(newProduct) {
			$scope.data.products.push(newProduct);
			$location.path("/list");
		});
	}
})
.controller("tableCtrl", function($scope, $location, $route, data) {
	$scope.data.products = data;

	$scope.refreshProducts = function() {
		$route.reload();
	}
})
.controller("editCtrl", function($scope, $routeParams, $location) {
	$scope.currentProduct = null;

	if ($location.path().indexOf("/edit/") == 0) {
		var id = $routeParams["id"];
		for (var i = 0; i < $scope.data.products.length; i++) {
			if ($scope.data.products[i].id == id) {
				$scope.currentProduct = $scope.data.products[i];
				break;
			}
		}
	}

	$scope.cancelEdit = function() {
		$scope.currentProduct = {};
		$location.path("/list");
	}

	$scope.updateProduct = function(product) {
		product.$save();
		$location.path("/list");
	}

	$scope.saveEdit = function(product) {
		if (angular.isDefined(product.id)) {
			$scope.updateProduct(product);
		} else {
			$scope.createProduct(product);
		}
		$scope.currentProduct = {};
	}
});