app.controller('productController', ['$scope', 'QueryService', 'Notification', 'ModalService', '$timeout',
    function productController($scope, QueryService, Notification, ModalService, $timeout) {
        $scope.init = function () {
            $scope.loading = true;
            $scope.list = true;
            $('.tool').tooltip();
            getProducts();
        };

        var getProducts = function () {
            QueryService.get('getProducts', {},
            function(response) {
                $scope.products = response;
                $scope.table = true;
                $scope.loading = false;
                $timeout(function(){$('.tool').tooltip();}, 200);
            });
        };

        $scope.showForm = function(edit){
            $scope.list = false;
        };

    }
]);
