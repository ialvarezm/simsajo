app.controller('contactController', ['$scope', 'QueryService', 'Notification',
    function contactController($scope, QueryService, Notification) {

        $scope.sendMsg = function(){
            $('#overlay-msg').show();
            QueryService.post('contact&v=order', $scope.contact, function(response) {
                $scope.contact = {};
                $scope.contactForm.$setPristine();
                Notification.success({message: "Sus comentarios han sido enviados.", delay: 2000, positionX: 'center'});
                $('#overlay-msg').hide();
            });
        }
    }
]);
