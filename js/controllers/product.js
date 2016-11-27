app.controller('productController', ['$scope', 'QueryService', 'Notification', '$timeout',
    function productController($scope, QueryService, Notification, $timeout) {
        $scope.init = function (slider) {
            $('.hide').removeClass('hide');
            Utils.checkUserRole();
            $('.tool').tooltip();
            $scope.button = 'Ver más';
            $scope.getProducts(slider);
            getCategories();
            // var sched = later.parse.recur().every(10).second(),
            //     t = later.setInterval(test, sched),
            //     count = 20;
            //
            // function test() {
            //     console.log(new Date());
            //     count--;
            //     if(count <= 0) {
            //         t.clear();
            //     }
            // }
        };

        $scope.initReport = function(){
            $('.hide').removeClass('hide');
            Utils.checkUserRole();
            $('.tool').tooltip();
            $scope.getProductReport();
        }

        function fileUpload() {
            var uploadfiles = document.getElementsByClassName('fileuploadbtn');
            for (var i = 0; i < uploadfiles.length; i++) {
                uploadfiles[i].addEventListener('change', changeEvent, true);
            }
        }

        function changeEvent() {
            var file = this.files[0];

            if(!_.includes($scope.product.photos, {'nombre': file.name})){
                uploadFile(file);
                $scope.product.photos.push({
                    'nombre': file.name,
                    'principal': _.includes(this.classList, 'main') ? '1' : '0',
                    'id': $scope.edit ? $(this).data('imageid') : ''
                });
            }
        }

        function uploadFile(file){
            var url = "server/fileUpload.php";
            var xhr = new XMLHttpRequest();
            var fd = new FormData();
            xhr.open("POST", url, true);
            xhr.onreadystatechange = function() {
                if (xhr.readyState == 4 && xhr.status == 200) {
                }
            };
            fd.append('uploaded_file', file);
            xhr.send(fd);
        }

        function random(min, max) {
            min = Math.ceil(min);
            max = Math.floor(max);
            return Math.floor(Math.random() * (max - min + 1)) + min;;
        }

        function assignImages(products) {
            QueryService.get('getAllProductImages&v=product', {},
            function(response) {
                var groupedImages = _.groupBy(response, 'producto');
                products.forEach(function(item){
                    var image = _.filter(groupedImages[item.id], {'principal': '1'})[0];
                    var images = groupedImages[item.id];
                    item['image'] = 'img/' + image.nombre;
                    item['imageArray'] = [];
                    images.forEach(function(value){
                        item['imageArray'].push('img/' + value.nombre);
                    });
                });
            });
            console.log(products);
            return products;
        }

        $scope.getProducts = function (slider) {
            $scope.list = true;
            $scope.loading = true;
            QueryService.get('getProducts&v=product', {},
            function(response) {
                $scope.products = assignImages(response);
                if(slider) {
                    setTimeout(function () {
                        bindPreview();
                    }, 500);
                }

                $scope.table = true;
                $timeout(function(){
                    $('.tool').tooltip();
                    $('.hide').removeClass('hide');
                    $scope.loading = false;
                }, 200);
            });
        };

        $scope.getProductReport = function () {
            $scope.list = true;
            $scope.loading = true;
            QueryService.get('getProductReport&v=product', {},
            function(response) {
                $scope.products = response;
                $scope.table = true;
                $scope.report = config.host + "getProductExcel&v=product";
                $timeout(function(){
                    $('.tool').tooltip();
                    $('.hide').removeClass('hide');
                    $scope.loading = false;
                }, 200);
            });
        };

        var getCategories = function () {
            QueryService.get('getCategories&v=product', {},
            function(response) {
                $scope.categories = _.sortBy(response, 'nombre');
            });
        };

        $scope.showForm = function(edit, product){
            $scope.edit = edit;
            if(edit) $scope.title = 'Editar Producto';
            else $scope.title = 'Agregar Producto';
            $scope.list = false;
            $scope.product = product;
        };

        $scope.next = function(){
            $(".fileinput").fileinput('clear');
            var category = _.filter($scope.categories, {'id': $scope.product.catId});
            $scope.product['categoria'] = category[0].nombre;
            $scope.savedProd = $scope.product;
            $scope.savedProd.photos = [];
            if($scope.edit) {
                $scope.title = "Editar Imágenes";
                loadImages($scope.product.id);
            } else {
                $scope.title = "Agregar Imágenes";
            }
            fileUpload();
        };

        function loadImages(id) {
            QueryService.get('getProductImages&v=product&id=' + id, {},
            function(response) {
                $scope.prodImages = response;
                response.forEach(function(photo){
                    if(photo.principal === "1") {
                        $("#mainPhoto .fileinput-preview").append('<img src="img/' + photo.nombre + '">');
                        $("#mainPhoto .fileuploadbtn").attr('data-imageid', photo.id);
                    }
                });
                var thumbs = $(".other");
                for (var i = 1; i < response.length; i++) {
                    $(thumbs[i-1]).find('.fileinput-preview').append('<img src="img/' + response[i].nombre + '">');
                    $(thumbs[i-1]).find(".fileuploadbtn").attr('data-imageid', response[i].id);
                }
            });
        }

        $scope.save = function(){
            if ($scope.savedProd.photos.length === 0 && !$scope.edit) {
                Notification.error({message: 'Por favor agregue al menos una imagen para el producto.', delay: 3000, positionX: 'center'});
                return;
            }
            var url, message;
            if($scope.edit) {
                url = 'updateProduct';
                message = 'Producto actualizado';
            }else {
                url = 'addProduct';
                message = 'Producto guardado';
            }
            QueryService.post(url + '&v=product', $scope.product,
            function(response) {
                $scope.product =  {};
                $scope.cancel();
                Notification.success({message: message, delay: 2000, positionX: 'center'});
            });
        };


        $scope.cancel = function () {
            $scope.list = true;
            $scope.getProducts();
            $scope.productForm.$setPristine();
            delete $scope.savedProd;
            $(".fileinput").fileinput('clear');
            $(".fileinput").fileinput('reset');
        };

        $scope.remove = function (product) {
            if (confirm("Está seguro que desea eliminar " + product.nombre + '?')) {
                QueryService.post('removeProduct&v=product&id=' + product.id, {},
                function (response) {
                    $scope.getProducts();
                });
            }
        };

        $scope.showHideproducts = function () {
            if($scope.button === 'Ver más') $scope.button = 'Ver menos';
            else {
                $scope.button = 'Ver más';
                $('#productos').click();
            }
        }

    }
]);
