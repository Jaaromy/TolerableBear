angular.module('MyModule')
    .controller('collisioncontroller', function ($scope, $window, $timeout, KineticService, UtilityService, AgentService) {
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
            $scope.pageName = "Basic Collisions";
            AgentService.updateFrequency = 5;
            AgentService.pixelsPerMeter = 100;
            stage = KineticService.createStage('container', $scope.windowWidth(), 700);
            AgentService.clear();
            var v1 = {};
            var radius = {};
            var startPos = {};
            var i = 0;

            for (i = 0; i < 8; i++) {
                radius = 15;
                startPos = new $window.Vec2(UtilityService.randomInt(radius * 2, stage.getWidth() - radius * 2), UtilityService.randomInt(radius * 2, stage.getHeight() - radius * 2));
                v1 = new $window.Vec2(UtilityService.randomInt( -10, 10), UtilityService.randomInt(-10, 10));
                v1 = $window.vMath.normalize(v1);
                v1 = $window.vMath.mulS(v1, UtilityService.randomInt(1, 4));
                AgentService.createAgent(stage, null, startPos, v1, radius);
            }

            for (i = 0; i < 8; i++) {
                radius = 20;
                startPos = new $window.Vec2(UtilityService.randomInt(radius * 2, stage.getWidth() - radius * 2), UtilityService.randomInt(radius * 2, stage.getHeight() - radius * 2));
                v1 = new $window.Vec2(UtilityService.randomInt( -10, 10), UtilityService.randomInt(-10, 10));
                v1 = $window.vMath.normalize(v1);
                v1 = $window.vMath.mulS(v1, UtilityService.randomInt(1, 4));
                AgentService.createAgent(stage, null, startPos, v1, radius);
            }

            for (i = 0; i < 8; i++) {
                radius = 25;
                startPos = new $window.Vec2(UtilityService.randomInt(radius * 2, stage.getWidth() - radius * 2), UtilityService.randomInt(radius * 2, stage.getHeight() - radius * 2));
                v1 = new $window.Vec2(UtilityService.randomInt(-10, 10), UtilityService.randomInt(-10, 10));
                v1 = $window.vMath.normalize(v1);
                v1 = $window.vMath.mulS(v1, UtilityService.randomInt(1, 4));
                AgentService.createAgent(stage, null, startPos, v1, radius);
            }

            for (i = 0; i < 3; i++) {
                radius = 70;
                startPos = new $window.Vec2(UtilityService.randomInt(radius * 2, stage.getWidth() - radius * 2), UtilityService.randomInt(radius * 2, stage.getHeight() - radius * 2));
                v1 = new $window.Vec2(UtilityService.randomInt(-10, 10), UtilityService.randomInt(-10, 10));
                v1 = $window.vMath.normalize(v1);
                v1 = $window.vMath.mulS(v1, UtilityService.randomInt(1, 2));
                AgentService.createAgent(stage, null, startPos, v1, 70);
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