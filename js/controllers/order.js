app.controller('orderController', ['$scope', 'QueryService', 'Notification', '$timeout',
    function orderController($scope, QueryService, Notification, $timeout) {
        $scope.init = function () {
            $scope.range = Array.apply(null, Array(5)).map(function (_, i) {return i+1;});
            $scope.getProducts();
            setShippingPrice();
        };

        $scope.initOrders = function () {
            $scope.user = JSON.parse(localStorage.currentUser).id;
		  	$scope.startIndex = 0;
			$scope.limit = 8;
            $scope.getOrders('getUserOrders&v=order&user=' + $scope.user + '&start=' + $scope.startIndex + '&limit=' + $scope.limit);
        };

        $scope.initAdminOrders = function () {
		  	$scope.startIndex = 0;
			$scope.limit = 8;
            $scope.getOrders('getPendingOrders&v=order&start=' + $scope.startIndex + '&limit=' + $scope.limit);
        };

        $scope.pag = function(dir, admin){
            var url;
            if($scope.right && dir === 'next') return;
            if($scope.startIndex == 0 && dir === 'prev') return;
            if(dir === 'prev') $scope.startIndex -= 8;
            else $scope.startIndex += 8;
            if(admin) url = 'getPendingOrders&v=order&start=' + $scope.startIndex + '&limit=' + $scope.limit;
            else url = 'getUserOrders&v=order&user=' + $scope.user + '&start=' + $scope.startIndex + '&limit=' + $scope.limit;

            $scope.getOrders(url);
        };

        var setShippingPrice = function (){
            if(localStorage.currentUser) {
                var user = JSON.parse(localStorage.currentUser);
                $scope.shippingPrice = user.gam === "0" ? 20 : 0;
            } else $scope.shippingPrice = 0;
        }

        $scope.getOrders = function (url) {
            var user = JSON.parse(localStorage.currentUser).id;
            QueryService.get(url, {},
            function(response) {
                $scope.orders = response;
                $scope.right = $scope.orders.length < 8;
                $timeout(function(){
                    $('.tool').tooltip();
                    $('.hide').removeClass('hide');
                    $scope.loading = false;
                }, 200);
            });
        }

        $scope.getOrderDetails = function (order) {
            if(!order.details) {
                QueryService.get('getOrderDetails&v=order&id=' + order.numeroOrden, {},
                function(response) {
                    order.details = response;
                    order.shown = true;
                });
            } else {
                order.shown = true;
            }
        }

        $scope.changeOrderStatus = function(status, order){
            if(confirm("¿Está seguro(a) que desea cambiar el status de la orden?")){
                order.status = status;
                QueryService.post('changeOrderStatus&v=order&status=' + status + '&id=' + order.numeroOrden, {},
                function(response) {
                    Notification.success({message: 'El status de la orden se actualizó correctamente.', delay: 2000, positionX: 'center'});
                });
            }
        };

        $scope.confirmPayment = function(order){
            var transferencia = prompt("Número de transferencia bancaria:", "");
            order.status = 'Comprobación Pendiente';
            QueryService.post('confirmPayment&v=order&transferencia=' + transferencia + '&id=' + order.numeroOrden, {},
            function(response) {
                Notification.success({message: 'El status de la orden se actualizó correctamente.', delay: 2000, positionX: 'center'});
            });
        };

        var formatOrders = function(orders){
            var formattedOrders = [],
                savedOrders = [],
                groupedOrders = _.groupBy(orders, 'numeroOrden');
            _.each(orders, function(order){
                if(!_.includes(savedOrders, order.numeroOrden)){
                    var new_order = {
                        'numero': order.numeroOrden,
                        'total': order.montoTotal,
                        'fecha': order.fecha,
                        'status': order.status,
                        'shipping': order.shipping,
                        'fechaObj': new Date(order.fecha),
                        'details': groupedOrders[order.numeroOrden],
                        'usuario' : order.usuario ? order.usuario + ' ' + order.apellidos : ''
                    };
                    formattedOrders.push(new_order);
                    savedOrders.push(order.numeroOrden);
                }
            });

            return _.orderBy(formattedOrders, ['fechaObj'], ['desc']);
        }

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
            setShippingPrice();
            $scope.total += $scope.shippingPrice;
        };

        $scope.placeOrder = function(){
            if(localStorage.currentUser) {
                $('#overlay').show();
                var user = JSON.parse(localStorage.currentUser);
                var order = {'usuario': user.id,
                             'cliente': user.nombre + ' ' + user.apellidos,
                             'fecha': new Date().toString("yyyy-MM-dd H:mm:ss"),
                             'montoTotal': $scope.total,
                             'userEmail': user.email,
                             'envio': $scope.shippingPrice};
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
