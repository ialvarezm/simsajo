app.controller('clientController', ['$scope', 'QueryService', 'Notification', '$timeout',
    function productController($scope, QueryService, Notification, $timeout) {
        $scope.init = function (report) {
            $('.hide').removeClass('hide');
            Utils.checkUserRole();
            $('.tool').tooltip();
            if(report) getClients('getClientReport&v=user');
            else getClients('getUsers&v=user&role=2');
        };

        var getClients = function (url) {
            $scope.list = true;
            $scope.loading = true;
            QueryService.get(url, {},
            function(response) {
                $scope.clients = response;
                $scope.table = true;
                $scope.report = config.host + "exportClientReport&v=user";
                $timeout(function(){
                    $('.tool').tooltip();
                    $('.hide').removeClass('hide');
                    $scope.loading = false;
                }, 200);
            });
        };

        $scope.showForm = function(edit, client){
            $scope.edit = edit;
            if(edit) $scope.title = 'Editar Cliente';
            else $scope.title = 'Agregar Cliente';
            $scope.list = false;
            $scope.client = client;
        };

        $scope.save = function(){
            var url, message;
            if($scope.edit) {
                url = 'updateClient&v=user';
                message = 'Cliente actualizado';
            }else {
                url = 'addClient&v=user';
                message = 'Cliente guardado';
            }

            QueryService.post(url, $scope.client,
            function(response) {
                $scope.client =  {};
                $scope.cancel();
                Notification.success({message: message, delay: 2000, positionX: 'center'});
            });

        };

        $scope.cancel = function () {
            $scope.list = true;
            getClients();
        };

        $scope.remove = function (client) {
            if (confirm("Está seguro que desea eliminar a " + client.nombre + ' ' + client.apellidos + '?')) {
                QueryService.get('getUserOrders&v=order&user=' + client.id + '&start=0&limit=100', {},
                function (response) {
                    var openOrders = _.filter(response, function(item){
                        return item.status === 'Entrega Pendiente' ||
                               item.status === 'Pago Pendiente' ||
                               item.status === 'Comprobación Pendiente';
                    });
                    if(openOrders.length > 0) {
                        Notification.error({message: 'Este usuario cuenta con órdenes abiertas, no puede ser eliminado.', delay: 3000, positionX: 'center'});
                    } else {
                        QueryService.post('removeUser&v=user&id=' + client.id, {},
                        function (response) {
                            getClients('getUsers&v=user&role=2');
                        });
                    }
                });
            }
        };

    }
]);
