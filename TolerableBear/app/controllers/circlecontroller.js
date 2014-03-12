angular.module('MyModule')
    .controller('circlecontroller', function ($scope, $window, $timeout, KineticService, UtilityService, AgentService) {
       'use strict';
       $scope.windowWidth = function () {
          return $window.innerWidth;
       };

       //$scope.windowHeight = function () {
       //   return $window.innerHeight;
       //}

       $scope.$watch($scope.windowWidth, function (newValue, oldValue) {
          stage.setWidth(newValue);
       });

       //$scope.$watch($scope.windowHeight, function (newValue, oldValue) {
       //   stage.setHeight(newValue < 300 ? 300 : newValue);
       //});

       var stage = {};
       function init() {
          $scope.pageName = "CIRCLES";
          stage = KineticService.createStage('container', $scope.windowWidth(), 700);
          AgentService.clear();

          for (var i = 0; i < 10; i++) {
             var v1 = new Vec2(UtilityService.randomInt( -10, 10), UtilityService.randomInt( -10, 10));
             v1.normalize();
             AgentService.createAgent(stage, null, v1, UtilityService.randomInt(5, 15));
          }
       }

       init();

       $scope.onTimeout = function () {
          mytimeout = $timeout($scope.onTimeout, 20);

          AgentService.checkAllBoundaries(stage.getWidth(), stage.getHeight());

          AgentService.checkAllCollisions();

          AgentService.moveAllAgents();

          AgentService.drawAllLayers();
       };

       var mytimeout = $timeout($scope.onTimeout, 20);

       $scope.$on("$destroy", function () {

          $timeout.cancel(mytimeout);
       });

    });