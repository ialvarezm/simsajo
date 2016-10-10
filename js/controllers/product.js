app.controller('productController', ['$scope', 'QueryService', 'Notification', '$timeout',
    function productController($scope, QueryService, Notification, $timeout) {
        $scope.init = function () {
            $('.tool').tooltip();
            getProducts();
            getCategories();
        };

        var getProducts = function () {
            $scope.list = true;
            $scope.loading = true;
            QueryService.get('getProducts', {},
            function(response) {
                $scope.products = response;
                $scope.table = true;
                $scope.loading = false;
                $timeout(function(){$('.tool').tooltip();}, 200);
            });
        };

        var getCategories = function () {
            QueryService.get('getCategories', {},
            function(response) {
                $scope.categories = response;
            });
        };

        $scope.showForm = function(edit, product){
            $scope.edit = edit;
            if(edit) $scope.title = 'Editar Producto';
            else $scope.title = 'Agregar Producto';
            $scope.list = false;
            $scope.product = product;
        };

        $scope.save = function(){
            var url, message;
            if($scope.edit) {
                url = 'updateProduct';
                message = 'Producto actualizado';
            }else {
                url = 'addProduct';
                message = 'Producto guardado';
            }
            QueryService.post(url, $scope.product,
            function(response) {
                $scope.product =  {};
                $scope.cancel();
            });

        };

        $scope.cancel = function () {
            $scope.list = true;
            getProducts();
        }

    }
]);
