app.controller('listController', ['$scope', 'apiService', function($scope, apiService) {
  $scope.loading = true;
  $scope.events = [];

  function loadEvents() {
    $scope.loading = true;
    apiService.getEvents().then(function(res) {
      $scope.events = res.data;
    }).catch(function(err) {
      console.error(err);
      alert('Error loading events. See console.');
    }).finally(function() {
      $scope.loading = false;
    });
  }

  $scope.deleteEvent = function(id) {
    if (!confirm('Are you sure to delete this event?')) return;
    apiService.deleteEvent(id).then(function() {
      alert('Deleted successfully');
      loadEvents();
    }).catch(function(err) {
      console.error(err);
      var msg = (err.data && err.data.message) ? err.data.message : 'Failed to delete, there may be existing registrations.';
      alert(msg);
    });
  };

  loadEvents();
}]);
