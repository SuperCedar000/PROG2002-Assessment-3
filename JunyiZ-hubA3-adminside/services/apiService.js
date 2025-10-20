app.factory('apiService', function($http, API_BASE_URL) {
  const service = {};

  service.getEvents = function() {
    return $http.get(API_BASE_URL)
      .then(function(response) {
        if (response.data && response.data.success) {
          return response.data.data;
        } else {
          return [];
        }
      })
      .catch(function() {
        return [];
      });
  };

  service.getEventById = function(id) {
    return $http.get(`${API_BASE_URL}/${id}`)
      .then(function(response) {
        if (response.data && response.data.success) {
          return response.data.data;
        } else {
          return null;
        }
      })
      .catch(function() {
        return null;
      });
  };

  service.addEvent = function(event) {
    return $http.post(API_BASE_URL, event)
      .then(function(response) {
        return response.data;
      })
      .catch(function(error) {
        throw error;
      });
  };

  service.updateEvent = function(id, event) {
    return $http.put(`${API_BASE_URL}/${id}`, event)
      .then(function(response) {
        return response.data;
      })
      .catch(function(error) {
        throw error;
      });
  };

  service.deleteEvent = function(id) {
    return $http.delete(`${API_BASE_URL}/${id}`)
      .then(function(response) {
        return response.data;
      })
      .catch(function(error) {
        throw error;
      });
  };

  service.searchEvents = function(params) {
    return $http.get(`${API_BASE_URL}/search`, { params })
      .then(function(response) {
        if (response.data && response.data.success) {
          return response.data.data;
        } else {
          return [];
        }
      })
      .catch(function() {
        return [];
      });
  };

  return service;
});
