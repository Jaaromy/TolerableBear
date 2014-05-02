angular.module('MyModule')
    .controller('phasercollisioncontroller', function ($scope, $window, $timeout, PhaserService, UtilityService) {
        'use strict';
        $scope.windowWidth = function () {
            return $window.innerWidth;
        };

        function init() {
            $scope.pageName = "Phaser.js Collisions";
            var v1 = {};
            var radius = {};
            var startPos = {};
            var i = 0;
        }

        init();
    });