// Define angular app and all modules
angular.module('app', [
  'ui.router'
])

.controller('AppCtrl', function AppCtrl($scope, $location) {
  $scope.pageTitle = 'Angular Boilerplate';
});
