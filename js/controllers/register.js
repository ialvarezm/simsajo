app.controller('registerController', ['$scope', 'QueryService', 'Notification',
    function registerController($scope, QueryService, Notification) {
        $scope.register = function() {
            var crypt = new Crypt();
            $scope.user.password = crypt.HASH.md5($scope.user.password).toString();
            QueryService.post('addUser', $scope.user, function(response) {
                $scope.user = {};
                Notification.success({message: "Registro exitoso, por favor inicie sesión.", delay: 2000, positionX: 'center'});
            });
        };

        $scope.cancel = function() {
            window.location.pathname = "/muebleria/www/index.html";
        };
    }
]);
