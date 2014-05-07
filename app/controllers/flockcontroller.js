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
            game.load.image('target', 'assets/circle.png');
        }

        var agents;
        var target;
        var agentCollisionGroup;
        
        function createAgent(x, y) {
            var agent;
            agent = agents.create(x, y, 'agent');
            agent.width = 20;
            agent.height = 20;
            agent.anchor.setTo(0.5, 1.0);
            agent.body.rotPerFrame = (game.math.PI2 / UtilityService.randomInt(1,6)) * deltaTime;

            agent.body.setCollisionGroup(agentCollisionGroup);
//            agent.body.collides(circleCollisionGroup);
//            agent.body.angle = UtilityService.randomInt(0,359);
            
            return agent;
        }
        
        function create() {
            game.physics.startSystem(Phaser.Physics.P2JS);
            agents = game.add.group();
            agents.enableBody = true;
            agents.physicsBodyType = Phaser.Physics.P2JS;
            
            agentCollisionGroup = game.physics.p2.createCollisionGroup();
            
            target = game.add.sprite(300,300,'target');
            target.width = 15;
            target.height = target.width;
            target.anchor.setTo(0.5, 0.5);
            target.tint = 0x00ffff;
            game.physics.enable(target, Phaser.Physics.P2JS);
            
            var a1 = createAgent(100,100);
            var a2 = createAgent(200,200);
            var a3 = createAgent(300,300);
            var a4 = createAgent(400,400);
        }
        
        var deltaTime = 0.016667;
        function move(agent) {
            agent.body.moveForward(100);
            agent.body.rotation += agent.body.rotPerFrame;
            if (agent.body.rotation > game.math.PI2) {
                agent.body.rotation = agent.body.rotation - game.math.PI2;
            }
        }
        
        function update() {
            for(var i = 0; i < agents.children.length; i++) {
                move(agents.children[i]);
            }
        }
        
        function init() {
            $scope.pageName = "Flocking";
        }

        init();
    });