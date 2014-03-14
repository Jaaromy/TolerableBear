angular.module('MyModule')
    .controller('velocitycontroller', function ($scope, $window, $timeout, KineticService, UtilityService, AgentService) {
        'use strict';
        $scope.windowWidth = function () {
            return 1000;
        };

        //$scope.windowHeight = function () {
        //   return $window.innerHeight;
        //}

        //$scope.$watch($scope.windowWidth, function (newValue, oldValue) {
        //    stage.setWidth(newValue);
        //});

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

            v1 = new Vec2(1, 0);
            v1 = vMath.normalize(v1);
            v1 = vMath.mulS(v1, 1);
            AgentService.createAgent(stage, null, new Vec2(radius, diam), v1, radius);

            v1 = new Vec2(1, 0);
            v1 = vMath.normalize(v1);
            v1 = vMath.mulS(v1, 5);
            AgentService.createAgent(stage, null, new Vec2(radius, diam * 2), v1, radius);

            v1 = new Vec2(1, 0);
            v1 = vMath.normalize(v1);
            v1 = vMath.mulS(v1, 10);
            AgentService.createAgent(stage, null, new Vec2(radius, diam * 3), v1, radius);

            v1 = new Vec2(1, 0);
            v1 = vMath.normalize(v1);
            v1 = vMath.mulS(v1, 20);
            AgentService.createAgent(stage, null, new Vec2(radius, diam * 4), v1, radius);

            v1 = new Vec2(1, 0);
            v1 = vMath.normalize(v1);
            v1 = vMath.mulS(v1, 15);
            AgentService.createAgent(stage, null, new Vec2(radius, diam * 5), v1, radius);

            v1 = new Vec2(1, 0);
            v1 = vMath.normalize(v1);
            v1 = vMath.mulS(v1, 7);
            AgentService.createAgent(stage, null, new Vec2(radius, diam * 6), v1, radius);
        }

        init();

        $scope.onTimeout = function () {
            mytimeout = $timeout($scope.onTimeout, AgentService.updateFrequency);

            AgentService.checkAllBoundaries(stage.getWidth(), stage.getHeight());

            AgentService.checkAllCollisions();

            AgentService.moveAllAgents();

            AgentService.drawAllLayers();
        };

        var mytimeout = $timeout($scope.onTimeout, AgentService.updateFrequency);

        $scope.$on("$destroy", function () {

            $timeout.cancel(mytimeout);
        });

    });