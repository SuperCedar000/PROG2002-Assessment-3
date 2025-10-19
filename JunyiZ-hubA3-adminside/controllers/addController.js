app.controller('addController', ['$scope', '$location', 'apiService', function($scope, $location, apiService) {
  $scope.event = {
    event_name: '',
    event_date: '',
    location: '',
    description: '',
    category_id: null
  };

  $scope.save = function() {
    if (!$scope.event.event_name || !$scope.event.event_date) {
      alert('Please fill in the event name and date');
      return;
    }

    apiService.addEvent($scope.event).then(function() {
      alert('Added successfully');
      $location.path('/events');
    }).catch(function(err) {
      console.error(err);
      alert('Failed to add, please check the console');
    });
  };
}]);
