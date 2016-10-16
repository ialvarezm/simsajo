app.controller('loginController', ['$scope', 'QueryService', 'Notification',
    function loginController($scope, QueryService, Notification) {
        $scope.init = function() {
            $scope.loginError = false;
            if (localStorage.currentUser) {
                $scope.loggedIn = true;
                $scope.currentUser = JSON.parse(localStorage.currentUser);
                $scope.admin = $scope.currentUser.rol === "1";
            } else {
                $scope.loggedIn = false;
            }
        };

        $scope.login = function() {
            var crypt = new Crypt();
            var user = $scope.user.name;
            var pass = crypt.HASH.md5($scope.user.pass).toString();
            QueryService.get("login&user=" + user + "&pass=" + pass, {},
            function(response) {
                if (response.length > 0) {
                    $scope.loggedIn = true;
                    $scope.currentUser = response[0];
                    localStorage.currentUser = JSON.stringify($scope.currentUser);
                    $scope.admin = $scope.currentUser.rol === "1";

                    if(window.location.pathname !== config.redirect)
                        window.location.pathname = config.redirect;
                } else {
                    $scope.loggedIn = false;
                    $scope.currentUser = {};
                    $scope.user.pass = "";
                    $scope.loginError = true;
                    Notification.error({message: "El usuario y la contraseña no coinciden.", delay: 2000, positionX: 'center'});
                }
            });
        };

        $scope.logout = function() {
            $scope.loggedIn = false;
            $scope.admin = false;
            delete localStorage.currentUser;
            $scope.user = {};
            $scope.currentUser = {};
            window.location.pathname = config.redirect;
        }

        $scope.goToRegister = function() {
            window.location.pathname = config.register;
        };

        $scope.goToProduct = function() {
            window.location.pathname = config.product;
        };

        $scope.goToClient = function() {
            window.location.pathname = config.client;
        };

        $scope.goToUser = function() {
            window.location.pathname = config.user;
        };

        $scope.goHome = function() {
            window.location.pathname = config.redirect;
        };
    }
]);
