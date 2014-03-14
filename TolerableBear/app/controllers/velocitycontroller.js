angular.module('MyModule')
    .controller('velocitycontroller', function ($scope, $window, $timeout, KineticService, UtilityService, AgentService) {
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
            $scope.pageName = "Velocity";
            AgentService.updateFrequency = 20;
            AgentService.pixelsPerMeter = 100;
            stage = KineticService.createStage('container', $scope.windowWidth(), 500);
            AgentService.clear();
            var radius = 25;
            var diam = radius * 2;
            var v1 = {};
            var count = 0;

            while (diam * count < stage.getHeight() - diam) {
                count++;
                v1 = new Vec2(1, 0);
                v1 = vMath.normalize(v1);
                v1 = vMath.mulS(v1, count * 2);
                AgentService.createAgent(stage, null, new Vec2(radius, diam * count), v1, radius);
            }
        }

        init();

        $scope.selected = {};

        $scope.onTimeout = function () {
            mytimeout = $timeout($scope.onTimeout, AgentService.updateFrequency);

            AgentService.checkAllBoundaries(stage.getWidth(), stage.getHeight());

            AgentService.checkAllCollisions();

            AgentService.moveAllAgents();

            AgentService.drawAllLayers();

            $scope.selected = AgentService.getSelected();
        };

        var mytimeout = $timeout($scope.onTimeout, AgentService.updateFrequency);

        $scope.$on("$destroy", function () {

            $timeout.cancel(mytimeout);
        });

    });