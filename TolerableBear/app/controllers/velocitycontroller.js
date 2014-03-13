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
            $scope.pageName = "VELOCITY";
            stage = KineticService.createStage('container', $scope.windowWidth(), 700);
            AgentService.clear();
            var radius = 30;

            var v1 = new Vec2(1, 0);
            v1 = vMath.normalize(v1);
            v1 = vMath.mulS(v1, 1);
            AgentService.createAgent(stage, null, new Vec2(radius, stage.getHeight() / 2), v1, radius);

            var v2 = new Vec2(-1, 0);
            v2 = vMath.normalize(v2);
            v2 = vMath.mulS(v2, 1);
            AgentService.createAgent(stage, null, new Vec2(stage.getWidth() - radius, stage.getHeight() / 2), v2, radius);
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