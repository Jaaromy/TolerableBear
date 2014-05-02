angular.module('MyModule')
    .controller('phasercollisioncontroller', function ($scope, $window, $timeout, UtilityService) {
        'use strict';
        $scope.windowWidth = function () {
            return $window.innerWidth;
        };
        
        $scope.$on('$locationChangeStart', function (event, next, current) {
            game.destroy();
            angular.element(document.querySelectorAll('canvas')).remove();
        });
        
        var game = new $window.Phaser.Game(800, 600, $window.Phaser.AUTO, '', { preload: preload, create: create, update: update });
        var updatedText;
        var fpsText;
        var updatedCount = 0;
        var time;

        function preload() {
        }

        function create() {
            updatedText = game.add.text(16, 16, 'updated: 0', { fontSize: '32px', fill: '#FFF' });
            game.time.advancedTiming = true;
            fpsText = game.add.text(16, 50, 'fps: 0', { fontSize: '32px', fill: '#FFF' });
        }

        function update() {
            updatedText.text = 'updated: ' + updatedCount++;
            fpsText.text = 'fps: ' + game.time.fps;
            
        }
        
        function init() {
            $scope.pageName = "Phaser.js Collisions";
            var v1 = {};
            var radius = {};
            var startPos = {};
            var i = 0;
        }

        init();
    });