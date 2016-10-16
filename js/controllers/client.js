app.controller('clientController', ['$scope', 'QueryService', 'Notification', '$timeout',
    function productController($scope, QueryService, Notification, $timeout) {
        $scope.init = function () {
            Utils.checkUserRole();
            $('.tool').tooltip();
            getClients();
        };

        var getClients = function () {
            $scope.list = true;
            $scope.loading = true;
            QueryService.get('getClients', {},
            function(response) {
                $scope.clients = response;
                $scope.table = true;
                $scope.loading = false;
                $timeout(function(){$('.tool').tooltip();}, 200);
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
                url = 'updateClient';
                message = 'Cliente actualizado';
            }else {
                url = 'addClient';
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
                QueryService.post('removeClient&id=' + client.id, {},
                function (response) {
                    getClients();
                });
            }
        };

    }
]);
