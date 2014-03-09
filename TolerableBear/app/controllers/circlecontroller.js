angular.module('MyModule')
    .controller('circlecontroller', function ($scope, $timeout, KineticService, UtilityService, AgentService) {
       'use strict';

       init();

       var stage =    KineticService.createStage('container', 640, 480);

       function init() {
          $scope.pageName = "CIRCLES";
          AgentService.createAgent('circle1');
       }
       var up = true;
       $scope.onTimeout = function () {
          mytimeout = $timeout($scope.onTimeout, 20);
          //var randX = UtilityService.random(100, AgentService.getCanvasWidth() - AgentService.getAgent('circle1').getWidth() / 2);
          //var randY = UtilityService.random(100, AgentService.getCanvasHeight() - AgentService.getAgent('circle1').getHeight() / 2);

          if (AgentService.getAgent('circle1').getX() > AgentService.getCanvasWidth() || AgentService.getAgent('circle1').getY() > AgentService.getCanvasHeight()) {
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