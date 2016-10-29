app.controller('userController', ['$scope', 'QueryService', 'Notification', '$timeout',
    function productController($scope, QueryService, Notification, $timeout) {
        $scope.init = function () {
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
                $scope.loading = false;
                $timeout(function(){$('.tool').tooltip();}, 200);
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
            }
            QueryService.post(url, $scope.user,
            function(response) {
                $scope.user =  {};
                $scope.cancel();
                Notification.success({message: message, delay: 2000, positionX: 'center'});
            });

        };

        $scope.cancel = function () {
            $scope.list = true;
            getUsers();
        };

        $scope.remove = function (user) {
            if (confirm("Está seguro que desea eliminar a " + user.nombre_usuario + '?')) {
                QueryService.post('removeUser&v=user&id=' + user.id, {},
                function (response) {
                    getUsers();
                });
            }
        };

    }
]);
