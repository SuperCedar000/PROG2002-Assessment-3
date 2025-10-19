var app = angular.module('adminApp', ['ngRoute']);

app.constant('API_BASE_URL', 'http://localhost:3000/api/events'); 
app.config(['$routeProvider', function($routeProvider) {
  $routeProvider
    .when('/events', {
      templateUrl: 'partials/event-list.html',
      controller: 'listController'
    })
    .when('/add', {
      templateUrl: 'partials/event-add.html',
      controller: 'addController'
    })
    .when('/edit/:id', {
      templateUrl: 'partials/event-edit.html',
      controller: 'editController'
    })
    .otherwise({
      redirectTo: '/events'
    });
}]);
