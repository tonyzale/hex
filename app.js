var hexApp = angular.module('hexApp', []);

hexApp.controller('HexController', function HexController($scope) {
  // setup scope here.
  $scope.viewbox = "-10 -10 1000 1000";
  $scope.hex = new Hex(200,100,43);
});