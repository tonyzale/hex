var hexApp = angular.module('hexApp', []);

hexApp.controller('HexController', function HexController($scope) {
  // setup scope here.
  $scope.viewbox = "-10 -10 2000 2000";
  $scope.hexgame = new HexGame.Gameboard(11);
});