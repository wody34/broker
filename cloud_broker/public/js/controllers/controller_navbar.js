app.controller('NavbarController', ['$scope', function($scope){
	$scope.title = 'Cloud Broker System';
	$scope.menuitems = [{
		type : 'normal',
		name : 'Home',
		ref : '/index.html'
	}];
}]);