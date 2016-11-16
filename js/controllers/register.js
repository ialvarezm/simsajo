app.controller('registerController', ['$scope', 'QueryService', 'Notification',
    function registerController($scope, QueryService, Notification) {
        $scope.init = function(){
            $('.help-block').removeClass('hide');
        }

        $scope.register = function() {
            if ($scope.registerForm.$valid) {
                var crypt = new Crypt();
                $scope.user.password = crypt.HASH.md5($scope.user.password).toString();
                $scope.user.rol = 2;
                $scope.user.gam = $scope.user.gam ? 1 : 0;
                $scope.user.phone2  = $scope.user.phone2 ? $scope.user.phone2 : '';
                QueryService.post('addUser&v=user', $scope.user, function(response) {
                    $scope.user = {};
                    $scope.registerForm.$setPristine();
                    Notification.success({message: "Registro exitoso, por favor inicie sesión.", delay: 2000, positionX: 'center'});
                });
            }
        };

        $scope.cancel = function() {
            window.location.pathname = config.redirect;
        };

        $scope.scrollBottom = function() {
            setTimeout(function () {
                $(".text-modal").scrollTop(1000);
            }, 500);
        }
    }
]);
