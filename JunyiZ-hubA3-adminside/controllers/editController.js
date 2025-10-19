app.controller('editController', ['$scope', '$routeParams', '$location', 'apiService',
  function($scope, $routeParams, $location, apiService) {
    var id = $routeParams.id;
    $scope.event = {};
    $scope.loading = true;

    apiService.getEvent(id).then(function(res) {
      $scope.event = res.data;
    }).catch(function(err) {
      console.error(err);
      alert('Failed to load event.');
    }).finally(function() {
      $scope.loading = false;
    });

    $scope.save = function() {
      if (!$scope.event.event_name || !$scope.event.event_date) {
        alert('Please fill in the event name and date.');
        return;
      }

      apiService.updateEvent(id, $scope.event).then(function() {
        alert('Updated successfully.');
        $location.path('/events');
      }).catch(function(err) {
        console.error(err);
        alert('Failed to update, please check the console.');
      });
    };
}]);
