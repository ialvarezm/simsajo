app.controller('productController', ['$scope', 'QueryService', 'Notification', '$timeout',
    function productController($scope, QueryService, Notification, $timeout) {
        $scope.init = function () {
            $scope.loading = true;
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
        }
    }
]);
