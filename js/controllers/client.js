app.controller('clientController', ['$scope', 'QueryService', 'Notification', '$timeout',
    function productController($scope, QueryService, Notification, $timeout) {
        $scope.init = function () {
            $('.hide').removeClass('hide');
            Utils.checkUserRole();
            $('.tool').tooltip();
            getClients();
        };

        var getClients = function () {
            $scope.list = true;
            $scope.loading = true;
            QueryService.get('getUsers&v=user&role=2', {},
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

        // $scope.excel = function () {
        //     QueryService.get('exportClientReport&v=user', {},
        //     function(response) {
        //         console.log(response);
        //     });
        // };

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
                QueryService.post('removeUser&v=user&id=' + client.id, {},
                function (response) {
                    getClients();
                });
            }
        };

    }
]);
