angular.module('MyModule')
    .controller('circlecontroller', function ($scope, $window, $timeout, KineticService, UtilityService, AgentService) {
       'use strict';
       $scope.windowWidth = function () {
          return $window.innerWidth;
       }

       $scope.$watch($scope.windowWidth, function (newValue, oldValue) {
          stage.setWidth(newValue);
       });

       var stage = {};
       function init() {
          $scope.pageName = "CIRCLES";
          stage = KineticService.createStage('container', $scope.windowWidth(), 768);
          AgentService.clear();

          for (var i = 0; i < 80; i++) {
             var v1 = new Vec2(UtilityService.randomInt(-10, 10), UtilityService.randomInt(-10, 10));
             v1.normalize();
             AgentService.createAgent(stage, null, v1, UtilityService.randomInt(5, 30));
          }
       }

       init();

       $scope.onTimeout = function () {
          mytimeout = $timeout($scope.onTimeout, 40);

          AgentService.checkAllBoundaries(stage.getWidth(), stage.getHeight());

          AgentService.moveAllAgents();

          AgentService.drawAllLayers();
       };

       var mytimeout = $timeout($scope.onTimeout, 40);

       $scope.$on("$destroy", function () {

          $timeout.cancel(mytimeout);
       });

    });