app.service('QueryService', function ($http) {
  var host = config.host;
    return{
      post: function(url, params, onSuccess, onFail){
        $http({
          method: 'POST',
          url: host + url,
          data: $.param({'data': params}),
          crossDomain: true,
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Access-Control-Allow-Origin': '*'
          }
        }).success(function (data, status, headers, config) {
          onSuccess(data, status, headers, config);
        }).error(function (data, status, headers, config) {
          onFail(data, status, headers, config);
        });
      },

      get: function(url, params, onSuccess, onFail){
        $http({
          method: 'GET',
          url: host + url,
          data: params,
          headers: {
            'Content-Type': 'application/json;charset=UTF-8'
          }
        }).success(function (data, status, headers, config) {
          onSuccess(data, status, headers, config);
        }).error(function (data, status, headers, config) {
          if(onFail) onFail(data, status, headers, config);
        });
      }
    }
});
