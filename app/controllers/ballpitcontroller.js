angular.module('MyModule')
    .controller('ballpitcontroller', function ($scope, $window, $timeout, UtilityService) {
        'use strict';
        $scope.windowWidth = function () {
            return $window.innerWidth;
        };
        
        $scope.$on('$locationChangeStart', function () {
            game.destroy();
            angular.element(document.querySelectorAll('canvas')).remove();
        });
        
        var game = new $window.Phaser.Game(400, 400, $window.Phaser.AUTO, 'container', { preload: preload, create: create, update: update });
        var fpsText;
        var avgFpsText;
        var ballCountText;
        var whiteToggleText;
        var colorSwapText;
        var main1VelocityText;
        var main2VelocityText;
        
        var avgFps = 0;
        var ballCount = 0;
        var frameCount = 0;
        var totFps = 0;
        var circles;
        var circleCollisionGroup;
        var fpsToggle = false;
        var colorSwapToggle = true;
        var whiteToggle = false;
        var mainCircle1;
        var mainCircle2;

        function preload() {
            game.load.image('agent', 'assets/circle.png');
        }

        function create() {
            game.input.keyboard.onDownCallback = function(e) {
                // 'F' key pressed
                if (e.keyCode === 70) {
                    fpsToggle = !fpsToggle;
                // 'C' key pressed
                } else if (e.keyCode === 67) {
                    colorSwapToggle = !colorSwapToggle;
                // 'W' key pressed
                } else if (e.keyCode === 87) {
                    whiteToggle = !whiteToggle;
                }
            };
            
            game.input.touch.onTouchEnd = function() {
                fpsToggle = !fpsToggle;
            };
            
            game.time.advancedTiming = true;
            game.physics.startSystem($window.Phaser.Physics.P2JS);
            game.physics.p2.restitution = 0.0;

            circleCollisionGroup = game.physics.p2.createCollisionGroup();
            game.physics.p2.updateBoundsCollisionGroup();

            circles = game.add.group();
            circles.enableBody = true;
            circles.physicsBodyType = $window.Phaser.Physics.P2JS;
            
            mainCircle1 = createMainCircle(0, 0);
            mainCircle2 = createMainCircle(game.world.width, game.world.height);

            fpsText = game.add.text(16, 14, 'FPS: 0', { font: 'bold 14px Arial', fill: '#ff0000' });
            avgFpsText = game.add.text(16, 28, 'AVG FPS: 0', { font: 'bold 14px Arial', fill: '#ff0000' });
            ballCountText = game.add.text(16, 42, 'BALL COUNT: 0', { font: 'bold 14px Arial', fill: '#ff0000' });
            whiteToggleText = game.add.text(16, 56, 'WHITE MODE: FALSE', { font: 'bold 14px Arial', fill: '#ff0000' });
            colorSwapText = game.add.text(16, 70, 'COLOR SWAP: FALSE', { font: 'bold 14px Arial', fill: '#ff0000' });
            main1VelocityText = game.add.text(16, 84, '', { font: 'bold 14px Arial', fill: '#ff0000' });
            main2VelocityText = game.add.text(16, 98, '', { font: 'bold 14px Arial', fill: '#ff0000' });
        }
        
        function circleContact(a, b, c, d) {
            if (whiteToggle && c.collisionGroup === d.collisionGroup) {
                c.body.parent.sprite.tint = 0xffffff;
            } 
            else if (colorSwapToggle && 
                    c.collisionGroup === d.collisionGroup &&
                    c.body.parent.sprite.tint !== d.body.parent.sprite.tint &&
                    (d.body.id !== mainCircle1.body.id && 
                     c.body.id !== mainCircle1.body.id && 
                     d.body.id !== mainCircle2.body.id && 
                     c.body.id !== mainCircle2.body.id)) {
                var v1 = new $window.Vec2(c.body.velocity[0], c.body.velocity[1]);
                var v2 = new $window.Vec2(d.body.velocity[0], d.body.velocity[1]);
                var len1 = $window.vMath.length(v1);
                var len2 = $window.vMath.length(v2);
                if (len1 > len2 && len1 > 10) {
                    d.body.parent.sprite.tint = c.body.parent.sprite.tint;
                } else if (len2 > len1 && len2 > 10) {
                    c.body.parent.sprite.tint = d.body.parent.sprite.tint;
                }
            }
        }
        
        function createMainCircle(x, y) {
            var circle;
            ballCount++;
            circle = circles.create(x, y, 'agent');
            circle.width = 100;
            circle.height = 100;
            circle.body.setCircle(50,0,0,0);
            circle.body.mass = 5000;
            circle.tint = 0xffffff;

            circle.body.setCollisionGroup(circleCollisionGroup);
            circle.body.collides(circleCollisionGroup);
            circle.body.angle = UtilityService.randomInt(0,359);
            
            return circle;
        }
        
        function accelerateSlow(circle) {
            if (circle.body.velocity.x > -20.0 && 
                circle.body.velocity.x < 20.0 && 
                circle.body.velocity.y > -20.0 && 
                circle.body.velocity.y < 20.0) {
                circle.body.angle = UtilityService.randomInt(0,359);
                circle.body.moveForward(UtilityService.randomInt(200,500));
            }
        }
        
        function createCircle() {
            ballCount++;
            var radius = UtilityService.randomInt(6,8);
            var circle;
            
            var corner = UtilityService.randomInt(1,4);
            switch(corner)
            {
                case 1:
                  circle = circles.create(0, 0, 'agent');
                  circle.tint = whiteToggle ? 0xffffff : 0x0000ff;
                  break;
                case 2:
                  circle = circles.create(0, game.world.height, 'agent');
                  circle.tint = whiteToggle ? 0xffffff : 0xff00ff;
                  break;
                case 3:
                  circle = circles.create(game.world.width, game.world.height, 'agent');
                  circle.tint = whiteToggle ? 0xffffff : 0xffff00;
                  break;
                default:
                  circle = circles.create(game.world.width, 0, 'agent');
                  circle.tint = whiteToggle ? 0xffffff : 0xff0000;
            }
            
            circle.width = radius * 2;
            circle.height = circle.width;
            circle.body.setCircle(radius,0,0,0);

            circle.body.onBeginContact.add(circleContact, this);

            circle.body.setCollisionGroup(circleCollisionGroup);
            circle.body.collides(circleCollisionGroup);
            circle.body.angle = UtilityService.randomInt(0,359);
            circle.body.mass = radius;
        }
        
        function destroyCircle() {
            var circle;
            
            for (var i = 2; i < circles.children.length; i++) {
                circle = circles.children[i];
                if (!circle.body) {
                    continue;
                }
                
                var left = circles.children[i].x - circles.children[i].width / 2;
                var top = circles.children[i].y - circles.children[i].width / 2;
                var right = circles.children[i].x + circles.children[i].width / 2;
                var bot = circles.children[i].y + circles.children[i].width / 2;
                
                if (left <= 0) {
                    break;
                } else if (right >= game.world.width) {
                    break;
                } else if (top <= 0) {
                    break;
                } else if (bot >= game.world.height) {
                    break;
                }
                
                circle = null;
            }
            
            
            if (circle && circle.body && circle.body.id !== mainCircle1.body.id && circle.body.id !== mainCircle2.body.id) {
                circle.body.destroy();
                circle.body = null;
                circle.destroy();
                ballCount--;
            }
        }

        function update() {
            if (frameCount > 180) {
                frameCount = 0;
                totFps = 0;
            }
            
            frameCount++;
            totFps += game.time.fps;
            avgFps = totFps / frameCount;

            if (fpsToggle) {
                fpsText.text = 'FPS: ' + game.time.fps;
                avgFpsText.text = 'AVG FPS: ' + Math.round(avgFps);
                ballCountText.text = 'BALL COUNT: ' + ballCount;
                whiteToggleText.text = 'WHITE MODE: ' + (whiteToggle ? 'ON' : 'OFF');
                colorSwapText.text = 'COLOR SWAP: ' + (colorSwapToggle ? 'ON' : 'OFF');
                main1VelocityText.text = 'MAIN1VELOCITY x: ' +  Math.round(mainCircle1.body.velocity.x) + ' y: ' + Math.round(mainCircle1.body.velocity.y);
                main2VelocityText.text = 'MAIN2VELOCITY x: ' +  Math.round(mainCircle2.body.velocity.x) + ' y: ' + Math.round(mainCircle2.body.velocity.y);
            } else {
                fpsText.text = '';
                avgFpsText.text = '';
                ballCountText.text = '';
                whiteToggleText.text = '';
                colorSwapText.text = '';
                main1VelocityText.text = '';
                main2VelocityText.text = '';
            }
            
            if ((avgFps >= 60 && game.time.fps >= 60 && ballCount < 300) || ballCount < 20) {
                createCircle();
            }
            
            if (avgFps <= 45 && game.time.fps <= 45 && ballCount > 100) {
                destroyCircle();
            }

            accelerateSlow(mainCircle1);
            accelerateSlow(mainCircle2);
        }
        
        function init() {
            $scope.pageName = "Phaser.js Collisions";
        }

        init();
    });