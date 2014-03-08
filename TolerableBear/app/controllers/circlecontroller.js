angular.module('MyModule')
    .controller('circlecontroller', function ($scope, $timeout, KineticService, UtilityService) {
       'use strict';

       init();

       function init() {
          $scope.pageName = "CIRCLES";
          $scope.stage = KineticService.createStage('container', 1024, 768);
          $scope.circle = KineticService.circle($scope.stage);
          $scope.layer = KineticService.layer($scope.circle);
          $scope.stage.add($scope.layer);
       }

       $scope.onTimeout = function () {
          mytimeout = $timeout($scope.onTimeout, 100);
          var randX = UtilityService.random($scope.circle.getWidth() / 2, $scope.stage.getWidth() - $scope.circle.getWidth() / 2);
          var randY = UtilityService.random($scope.circle.getHeight() / 2, $scope.stage.getHeight() - $scope.circle.getHeight() / 2);

          $scope.circle.setX(randX);
          $scope.circle.setY(randY);

          $scope.layer.draw();
       };

       var mytimeout = $timeout($scope.onTimeout, 100);

       $scope.$on("$destroy", function () {
          $timeout.cancel(mytimeout);
       });

    });