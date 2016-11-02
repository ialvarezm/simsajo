app.controller('orderController', ['$scope', 'QueryService', 'Notification', '$timeout',
    function orderController($scope, QueryService, Notification, $timeout) {
        $scope.init = function () {
            $scope.range = Array.apply(null, Array(5)).map(function (_, i) {return i+1;});
            $scope.getProducts();
        };

        $scope.getProducts = function () {
            $scope.loading = true;
            QueryService.get('getProducts&v=product', {},
            function(response) {
                $scope.products = response;
                $scope.loading = false;
            });
        };

        $scope.calculateTotals = function(){
            $scope.total = 0;
            $scope.products.forEach(function(item){
                if(item.total) {
                    $scope.total += item.total;
                }
            });
        };

        $scope.placeOrder = function(){
            if(localStorage.currentUser) {
                $('#overlay').show();
                var user = JSON.parse(localStorage.currentUser);
                var order = {'usuario': user.id,
                             'cliente': user.nombre + ' ' + user.apellidos,
                             'fecha': Date.today().toString("yyyy-MM-dd"),
                             'montoTotal': $scope.total,
                             'userEmail': user.email};
                var order_details = [];
                $scope.products.forEach(function(item){
                    if(item.total && item.cantidad){
                        order_details.push({'producto': item.id,
                                            'monto': item.total,
                                            'cantidad': item.cantidad,
                                            'nombreProd': item.nombre,
                                            'precio': item.precio});
                    }
                });
                var data = {'order': order, 'order_details': order_details};
                if(order_details.length > 0) {
                    if(confirm("¿Está seguro(a) que desea realizar la orden?")){
                        QueryService.post('saveOrder&v=order', data,
                        function(response) {
                            Notification.success({message: 'El pedido se realizó exitosamente, recibirá un email de confirmación.', delay: 4000, positionX: 'center'});
                            $scope.products.forEach(function(item){
                                if(item.total) {
                                    delete item.total;
                                    delete item.cantidad;
                                }
                                $scope.total = '';
                            });
                            $('#overlay').hide();
                        });
                    } else {
                        $('#overlay').hide();
                    }
                } else  {
                    $('#overlay').hide();
                    Notification.error({message: "Por favor agregue algún producto a la orden.", delay: 2000, positionX: 'center'});
                }
            } else {
                Notification.error({message: "Debe iniciar sesión o registrarse para realizar la orden.", delay: 2000, positionX: 'center'});
            }
        };
    }
]);
