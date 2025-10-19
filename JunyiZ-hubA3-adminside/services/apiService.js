app.service('apiService', ['$http', 'API_BASE_URL', function($http, API_BASE_URL) {
  const base = API_BASE_URL;

  this.getEvents = function() {
    return $http.get(base);
  };

  this.getEvent = function(id) {
    return $http.get(base + '/' + id);
  };

  this.addEvent = function(eventData) {
    return $http.post(base, eventData);
  };

  this.updateEvent = function(id, eventData) {
    return $http.put(base + '/' + id, eventData);
  };

  this.deleteEvent = function(id) {
    return $http.delete(base + '/' + id);
  };
}]);
