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
            agent.width = 6;
            agent.height = 6;
            agent.anchor.setTo(0.5, 1.0);
            agent.body.rotPerFrame = (game.math.PI2 / UtilityService.randomInt(2,4)) * deltaTime;
            
            //TODO: custom property. Remove when flocking fixed.
            agent.speed = game.rnd.integerInRange(100,150);

            agent.body.setCollisionGroup(agentCollisionGroup);
            agent.body.collideWorldBounds = false;
            
            return agent;
        }
        
        function create() {
            game.physics.startSystem($window.Phaser.Physics.P2JS);
            agents = game.add.group();
            agents.enableBody = true;
            agents.physicsBodyType = $window.Phaser.Physics.P2JS;
            game.time.advancedTiming = true;
            
            agentCollisionGroup = game.physics.p2.createCollisionGroup();
            var targetCollisionGroup = game.physics.p2.createCollisionGroup();
            game.physics.p2.updateBoundsCollisionGroup();
            
            target = game.add.sprite(300,300,'target');
            target.width = 15;
            target.height = target.width;
            target.anchor.setTo(0.5, 0.5);
            target.tint = 0x00ffff;
            game.physics.p2.enable(target);
            target.body.setCollisionGroup(targetCollisionGroup);
        }
        
        var deltaTime = 0.016667;
        var twoPi = Math.PI * 2;

        function move(agent) {
            //Swap y position to correctly calculate in Quad I.
            var tmpp1 = new $window.Vec2(agent.position.x, target.position.y);
            var tmpp2 = new $window.Vec2(target.position.x, agent.position.y);
    
            var vecp1p2 = $window.vMath.normalize($window.vMath.subV(tmpp2, tmpp1));
            var angle = Math.atan2(vecp1p2.x, vecp1p2.y);
            
            if (angle < 0) {
                angle = twoPi + angle;
            }
            
            agent.body.moveForward(agent.speed);

            var diff = agent.body.rotation - angle;
            var absDiff = Math.abs(diff);
            
            if ((Math.abs(agent.body.rotation + twoPi - angle) < agent.body.rotPerFrame) ||
                (Math.abs(angle + twoPi - agent.body.rotation) < agent.body.rotPerFrame)) {
                return;
            }
            
            if (absDiff > Math.PI && diff < 0) {
                agent.body.rotation -= agent.body.rotPerFrame;
            } else if (absDiff > Math.PI && diff > 0) {
                agent.body.rotation += agent.body.rotPerFrame;
            } else if ((absDiff) > agent.body.rotPerFrame ) {
                if (agent.body.rotation < angle) {
                    agent.body.rotation += agent.body.rotPerFrame;
                } else {
                    agent.body.rotation -= agent.body.rotPerFrame;
                }
            }
            
            if (agent.body.rotation < 0) {
                agent.body.rotation += twoPi;
            } else if (agent.body.rotation > twoPi) {
                agent.body.rotation -= twoPi;
            }
        }
        
        function destroyAgent() {
            var agent;
            
            for (var i = 0; i < agents.children.length; i++) {
                agent = agents.children[i];
                if (!agent.body) {
                    continue;
                }
                
                var left = agents.children[i].x - agents.children[i].width / 2;
                var top = agents.children[i].y - agents.children[i].width / 2;
                var right = agents.children[i].x + agents.children[i].width / 2;
                var bot = agents.children[i].y + agents.children[i].width / 2;
                
                if (left <= 0) {
                    break;
                } else if (right >= game.world.width) {
                    break;
                } else if (top <= 0) {
                    break;
                } else if (bot >= game.world.height) {
                    break;
                }

                agent = null;
            }
            
            if (agent && agent.body) {
                agent.body.destroy();
                agent.body = null;
                agent.destroy();
            }
        }

        
        var wFrameCount = 60;
        var wSpeed = 50;
        var totFps = 0;
        var avgFps = 0;
        
        function moveTarget() {
            var angle = game.rnd.integerInRange(0, 359);
            wSpeed = game.rnd.integerInRange(60,130);
            target.body.angle = angle;
            target.body.moveForward(wSpeed);
        }

        function update() {
            for(var i = 0; i < agents.children.length; i++) {
                move(agents.children[i]);
            }
            
            wFrameCount++;
            totFps += game.time.fps;
            avgFps = totFps / wFrameCount;
            
            if (wFrameCount >= 60) {
                wFrameCount = 0;
                totFps = 0;
                moveTarget();
            }
            
            if ((target.position.x < 100) || 
                (target.position.x > game.width - 100) || 
                (target.position.y < 100) || 
                (target.position.y > game.height - 100)) {
                
                target.body.angle = target.body.angle - 180;
                target.body.moveForward(wSpeed);
            }
            
            if (avgFps <= 55 && game.time.fps <= 55 && agents.children.length > 150) {
                destroyAgent();
            }
            
            if (avgFps >= 60 && game.time.fps >= 60 && agents.children.length < 350) {
                switch(game.rnd.integerInRange(1,2))
                {
                    case 1:
                        createAgent(-20, game.world.randomY);
                        break;
                    case 2:
                        createAgent(game.width + 20, game.world.randomY);
                        break;
                }
            }
        }
        
        function init() {
            $scope.pageName = "Flocking";
        }

        init();
    });