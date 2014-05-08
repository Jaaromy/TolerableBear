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
            agent.width = 15;
            agent.height = 15;
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
            
            for(var i = 0; i < 10; i++) {
                createAgent(UtilityService.randomInt(50, 550), UtilityService.randomInt(50, 550));
            }
            
//            var a1 = createAgent(100,100);
//            var a2 = createAgent(200,200);
//            var a3 = createAgent(300,300);
//            var a4 = createAgent(400,400);
        }
        
        var deltaTime = 0.016667;
        function move(agent) {
            var pi4 = (game.math.PI2 / 4)
            var angle = game.math.angleBetweenPoints(agent.position, target.position) + pi4;
            
            agent.body.moveForward(90);
            
            var p = new Vec2(target.position.x, target.position.y);
            var t = new Vec2(agent.position.x, agent.position.y);
            var h = new Vec2(agent.body.velocity.x, agent.body.velocity.y);
            var H = vMath.normalize(h);
            var tp = vMath.subV(p, t);
            var TP = vMath.normalize(tp);
            var dot = vMath.dot(TP, H);
            var theta = Math.acos(dot);
            
            agent.body.rotation = theta;
            
//            if (Math.abs(agent.body.rotation - theta) > agent.body.rotPerFrame ) {
//                if (agent.body.rotation < theta) {
//                    agent.body.rotation += agent.body.rotPerFrame;
//                } else {
//                    agent.body.rotation -= agent.body.rotPerFrame;
//                }
//
//                if (agent.body.rotation > game.math.PI2) {
//                    agent.body.rotation -= game.math.PI2;
//                } else if (agent.body.rotation < 0) {
//                    agent.body.rotation += game.math.PI2;
//                }
//            }
        }
        
        var wFrameCount = 120;
        var wSpeed = 100;

        function update() {
            for(var i = 0; i < agents.children.length; i++) {
                move(agents.children[i]);
            }
            
            wFrameCount++;
            
            if (wFrameCount >= 120) {
                wFrameCount = 0;
                var angle = game.rnd.integerInRange(0, 359);
                wSpeed = game.rnd.integerInRange(100,150);
                target.body.angle = angle;
                target.body.moveForward(wSpeed);
            }

        }
        
        function init() {
            $scope.pageName = "Flocking";
        }

        init();
    });