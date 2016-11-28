app.controller('userController', ['$scope', 'QueryService', 'Notification', '$timeout',
    function productController($scope, QueryService, Notification, $timeout) {
        $scope.init = function () {
            $('.hide').removeClass('hide');
            Utils.checkUserRole();
            $('.tool').tooltip();
            getUsers();
        };

        var getUsers = function () {
            $scope.list = true;
            $scope.loading = true;
            QueryService.get('getUsers&v=user&role=1', {},
            function(response) {
                $scope.users = response;
                $scope.table = true;
                $timeout(function(){
                    $('.tool').tooltip();
                    $('.hide').removeClass('hide');
                    $scope.loading = false;
                }, 200);
            });
        };

        $scope.showForm = function(edit, client){
            $scope.edit = edit;
            if(edit) $scope.title = 'Editar Usuario';
            else $scope.title = 'Agregar Usuario';
            $scope.list = false;
            $scope.user = client;
        };

        $scope.save = function(){
            var url, message;
            if($scope.edit) {
                url = 'updateUser&v=user';
                message = 'Usuario actualizado';
            }else {
                url = 'addAdmin&v=user&rol=1';
                message = 'Usuario guardado';
                var crypt = new Crypt();
                $scope.user.password = crypt.HASH.md5($scope.user.password).toString();
            }
            QueryService.get('getUserByName&v=user&name=' + $scope.user.nombre_usuario, {},
            function(response) {
                if(response.length && !$scope.edit){
                    Notification.error({message: "Ya existe un usuario con el nombre <b><u>" + $scope.user.nombre_usuario + "</u></b>. Por favor elija otro.", delay: 4000, positionX: 'center'});
                } else {
                    QueryService.post(url, $scope.user,
                    function(response) {
                        $scope.user =  {};
                        $scope.cancel();
                        Notification.success({message: message, delay: 2000, positionX: 'center'});
                    });
                }
            });
        };

        $scope.cancel = function () {
            $scope.list = true;
            getUsers();
            $scope.userForm.$setPristine();
        };

        $scope.remove = function (user) {
            if (confirm("Está seguro que desea eliminar a " + user.nombre_usuario + '?')) {
                QueryService.get('getUserOrders&v=order&user=' + user.id + '&start=0&limit=100', {},
                function (response) {
                    var openOrders = _.filter(response, function(item){
                        return item.status === 'Entrega Pendiente' ||
                               item.status === 'Pago Pendiente' ||
                               item.status === 'Comprobación Pendiente';
                    });
                    if(openOrders.length > 0) {
                        Notification.error({message: 'Este usuario cuenta con órdenes abiertas, no puede ser eliminado.', delay: 3000, positionX: 'center'});
                    } else {
                        QueryService.post('removeUser&v=user&id=' + user.id, {},
                        function (response) {
                            getUsers();
                        });
                    }
                });
            }
        };

    }
]);
