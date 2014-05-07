angular.module('MyModule')
    .controller('flockcontroller', function ($scope, $window, $timeout, UtilityService) {
        'use strict';
        $scope.windowWidth = function () {
            return $window.innerWidth;
        };
        
        $scope.$on('$locationChangeStart', function (event, next, current) {
            game.destroy();
            angular.element(document.querySelectorAll('canvas')).remove();
        });
        
        var game = new $window.Phaser.Game(600, 600, $window.Phaser.AUTO, 'container', { preload: preload, create: create, update: update });

        function preload() {
            game.load.image('agent', 'assets/triangle.png');
        }

        var agent;
        var statsText;
        
        function create() {
            game.physics.startSystem(Phaser.Physics.P2JS);
            agent = game.add.sprite(game.world.width / 2, game.world.height / 2, 'agent');
            agent.anchor.setTo(0.5, 1.0);
            agent.width = 20;
            agent.height = 20;
            
            game.physics.enable(agent, Phaser.Physics.P2JS);
            agent.body.moveForward(500);
        }
        
        function update() {
        }
        
        function init() {
            $scope.pageName = "Flocking";
        }

        init();
    });