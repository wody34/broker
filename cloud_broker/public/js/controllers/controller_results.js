
app.controller('ResultsController', ['$scope', function($scope){
    $scope.vms = [{
        name: 'VM#1',
        id: 'vm1'
    },{
        name: 'VM#2',
        id: 'vm2'
    }];

    $scope.loads = [{
        name: 'load'
    },{
        name: 'load_user'
    },{
        name: 'load_system'
    },{
        name: 'load_nice'
    },{
        name: 'load_idle'
    },{
        name: 'load_irq'
    }];
}]);
