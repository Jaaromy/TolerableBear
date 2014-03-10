angular.module('MyModule')
    .controller('circlecontroller', function ($scope, $timeout, $window, KineticService, UtilityService, AgentService) {
       'use strict';

       var stage = {};

       function init() {
          $scope.pageName = "CIRCLES";
          stage = KineticService.createStage('container', 640, 480);
          AgentService.createAgent(stage, 'circle1');
          var v1 = new Vec2(4, 5);
          var v2 = new Vec2(1, 0);
          v1.normalize();
          var dt = v1.dot(v2);
       }

       init();

       var up = true;
       $scope.onTimeout = function () {
          mytimeout = $timeout($scope.onTimeout, 20);
          //var randX = UtilityService.random(100, AgentService.getCanvasWidth() - AgentService.getAgent('circle1').getWidth() / 2);
          //var randY = UtilityService.random(100, AgentService.getCanvasHeight() - AgentService.getAgent('circle1').getHeight() / 2);

          if (AgentService.getAgent('circle1').getX() > stage.getWidth() || AgentService.getAgent('circle1').getY() > stage.getHeight()) {
             up = false;
          } else if (AgentService.getAgent('circle1').getX() < 0 || AgentService.getAgent('circle1').getY() < 0) {
             up = true;
          }

          if (up) {
             AgentService.moveAgent( 3, 3, 'circle1');
          } else {
             AgentService.moveAgent( -3, -3, 'circle1');
          }

          AgentService.drawAllLayers();
       };

       var mytimeout = $timeout($scope.onTimeout, 20);

       $scope.$on("$destroy", function () {
          $timeout.cancel(mytimeout);
       });

    });