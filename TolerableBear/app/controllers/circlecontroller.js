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
            AgentService.updateFrequency = 20;
            AgentService.pixelsPerMeter = 100;
            stage = KineticService.createStage('container', $scope.windowWidth(), 700);
            AgentService.clear();

            for (var i = 0; i < 8; i++) {
                var radius = 15;
                var startPos = new Vec2(UtilityService.randomInt(radius * 2, stage.getWidth() - radius * 2), UtilityService.randomInt(radius * 2, stage.getHeight() - radius * 2));
                var v1 = new Vec2(UtilityService.randomInt(-10, 10), UtilityService.randomInt(-10, 10));
                v1 = vMath.normalize(v1);
                v1 = vMath.mulS(v1, UtilityService.randomInt(1, 8));
                AgentService.createAgent(stage, null, startPos, v1, radius);
            }

            for (var i = 0; i < 8; i++) {
                var radius = 20;
                var startPos = new Vec2(UtilityService.randomInt(radius * 2, stage.getWidth() - radius * 2), UtilityService.randomInt(radius * 2, stage.getHeight() - radius * 2));
                var v1 = new Vec2(UtilityService.randomInt(-10, 10), UtilityService.randomInt(-10, 10));
                v1 = vMath.normalize(v1);
                v1 = vMath.mulS(v1, UtilityService.randomInt(1, 8));
                AgentService.createAgent(stage, null, startPos, v1, radius);
            }

            for (var i = 0; i < 8; i++) {
                var radius = 25;
                var startPos = new Vec2(UtilityService.randomInt(radius * 2, stage.getWidth() - radius * 2), UtilityService.randomInt(radius * 2, stage.getHeight() - radius * 2));
                var v1 = new Vec2(UtilityService.randomInt(-10, 10), UtilityService.randomInt(-10, 10));
                v1 = vMath.normalize(v1);
                v1 = vMath.mulS(v1, UtilityService.randomInt(1, 8));
                AgentService.createAgent(stage, null, startPos, v1, radius);
            }

            for (var i = 0; i < 3; i++) {
                var radius = 70;
                var startPos = new Vec2(UtilityService.randomInt(radius * 2, stage.getWidth() - radius * 2), UtilityService.randomInt(radius * 2, stage.getHeight() - radius * 2));
                var v1 = new Vec2(UtilityService.randomInt(-10, 10), UtilityService.randomInt(-10, 10));
                v1 = vMath.normalize(v1);
                v1 = vMath.mulS(v1, UtilityService.randomInt(1, 2));
                AgentService.createAgent(stage, null, startPos, v1, 70);
            }
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