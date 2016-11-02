app.controller('productController', ['$scope', 'QueryService', 'Notification', '$timeout',
    function productController($scope, QueryService, Notification, $timeout) {
        $scope.init = function (slider) {
            Utils.checkUserRole();
            $('.tool').tooltip();
            $scope.button = 'Ver más';
            $scope.getProducts(slider);
            getCategories();
            // var sched = later.parse.recur().every(10).second(),
            //     t = later.setInterval(test, sched),
            //     count = 20;
            //
            // function test() {
            //     console.log(new Date());
            //     count--;
            //     if(count <= 0) {
            //         t.clear();
            //     }
            // }
        };

        function random(min, max) {
            min = Math.ceil(min);
            max = Math.floor(max);
            return Math.floor(Math.random() * (max - min + 1)) + min;;
        }

        function assignImages(products) {
            products.forEach(function(item){
                item['image'] = 'img/product' + random(1,3) + '.jpg';
                item['imageArray'] = 'img/' + random(1,12) + '.jpg,img/' + random(1,12) + '.jpg,img/' + random(1,12) + '.jpg,img/' + random(1,12) + '.jpg,img/' + random(1,12) + '.jpg';
            });
            return products;
        }

        $scope.getProducts = function (slider) {
            $scope.list = true;
            $scope.loading = true;
            QueryService.get('getProducts&v=product', {},
            function(response) {
                $scope.products = assignImages(response);
                if(slider) {
                    setTimeout(function () {
                        bindPreview();
                    }, 500);
                }

                $scope.table = true;
                $scope.loading = false;
                $timeout(function(){$('.tool').tooltip();}, 200);
            });
        };

        var getCategories = function () {
            QueryService.get('getCategories&v=product', {},
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
            QueryService.post(url + '&v=product', $scope.product,
            function(response) {
                $scope.product =  {};
                $scope.cancel();
                Notification.success({message: message, delay: 2000, positionX: 'center'});
            });

        };

        $scope.cancel = function () {
            $scope.list = true;
            $scope.getProducts();
        };

        $scope.remove = function (product) {
            if (confirm("Está seguro que desea eliminar " + product.nombre + '?')) {
                QueryService.post('removeProduct&v=product&id=' + product.id, {},
                function (response) {
                    $scope.getProducts();
                });
            }
        };

        $scope.showHideproducts = function () {
            if($scope.button === 'Ver más') $scope.button = 'Ver menos';
            else {
                $scope.button = 'Ver más';
                $('#productos').click();
            }
        }

    }
]);
