angular.module('MyModule')
    .controller('facingcontroller', function ($scope, $window, $timeout, UtilityService) {
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
            game.load.image('waypoint', 'assets/circle.png');
            game.load.image('agent', 'assets/triangle.png');
            
        }

        var agent;
        var waypoint;
        var statsText;
        
        function create() {
            game.physics.startSystem(Phaser.Physics.P2JS);
            agent = game.add.sprite(game.world.width / 2, game.world.height / 2, 'agent');
            agent.anchor.setTo(0.5, 1.0);
            agent.width = 40;
            agent.height = 40;
            
            waypoint = game.add.sprite(400, 50, 'waypoint');
            waypoint.width = 40;
            waypoint.height = 40;
            waypoint.tint = 0xff00ff;
            
            game.physics.enable(agent, Phaser.Physics.P2JS);
            game.physics.enable(waypoint, Phaser.Physics.P2JS);
            //statsText = game.add.text(16, 14, 'ANGLE: 0', { font: 'bold 14px Arial', fill: '#ff0000' });
        }

        
        function getRandomDirection() {
            var direction = UtilityService.randomInt(1,4);
 
        }
        
        var wFrameCount = 120;
        var aFrameCount = 170;
        var wSpeed = 100;
        var aSpeed = 100;
        
        function update() {
            var pi4 = (game.math.PI2 / 4)
            var angle = game.math.angleBetweenPoints(agent.position, waypoint.position);
            agent.body.rotation = angle + pi4;
            
            aFrameCount++;
            wFrameCount++;
            
            if (wFrameCount >= 120) {
                wFrameCount = 0;
                angle = game.rnd.integerInRange(0, 359);
                wSpeed = game.rnd.integerInRange(200,300);
                waypoint.body.angle = angle;
                waypoint.body.moveForward(wSpeed);
            }
            
            if (aFrameCount >= 170) {
                aFrameCount = 0;
                aSpeed = game.rnd.integerInRange(150,350);
                agent.body.moveForward(aSpeed);
            }
            

            //statsText.text = 'ANGLE: ' + Math.round(agent.body.angle);
            
        }
        
        function init() {
            $scope.pageName = "Facing";
        }

        init();
    });