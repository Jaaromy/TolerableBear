angular.module('MyModule')
    .controller('circlecontroller', function ($scope, $timeout, KineticService, UtilityService, AgentService) {
       'use strict';

       var stage = {};
       function init() {
          $scope.pageName = "CIRCLES";
          stage = KineticService.createStage('container', 1024, 768);

          for (var i = 0; i < 50; i++) {
             var v1 = new Vec2(UtilityService.randomInt( -10, 10), UtilityService.randomInt( -10, 10));
             v1.normalize();
             AgentService.createAgent(stage, null, v1, UtilityService.randomInt(4, 20));
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