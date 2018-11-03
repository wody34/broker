
app.controller('MainController', ['$scope', '$http', function($scope, $http){
    $scope.createVM = function() {
        console.log('Test')
        $http.get('/createVM').then(function success(response) {
        }, function error(response) {
        });
    }

}]);
