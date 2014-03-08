angular.module('MyModule')
    .controller('rectcontroller', function ($scope, $timeout, KineticService) {
       'use strict';

       init();

       function init() {
          $scope.pageName = "RECTANGLES";
          $scope.stage = KineticService.createStage('container', 400, 300);
          make();
       }

       $scope.onTimeout = function () {
          mytimeout = $timeout($scope.onTimeout, 1000);
       };

       var mytimeout = $timeout($scope.onTimeout, 1000);

       $scope.$on("$destroy", function () {
          $timeout.cancel(mytimeout);
       });

       function make() {
          var rect = KineticService.rect($scope.stage);
          var layer = KineticService.layer(rect);
          $scope.stage.add(layer);
       }

    });