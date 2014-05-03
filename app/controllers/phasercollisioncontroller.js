angular.module('MyModule')
    .controller('phasercollisioncontroller', function ($scope, $window, $timeout, UtilityService) {
        'use strict';
        $scope.myfps;
        
        $scope.windowWidth = function () {
            return $window.innerWidth;
        };
        
        $scope.$on('$locationChangeStart', function (event, next, current) {
            game.destroy();
            angular.element(document.querySelectorAll('canvas')).remove();
        });
        
        var game = new $window.Phaser.Game(800, 600, $window.Phaser.AUTO, '', { preload: preload, create: create, update: update });
        var fpsText;
        var avgFpsText;
        var ballCountText;
        var avgFps = 0;
        var ballCount = 0;
        var circles;
        var circleCollisionGroup;
        //var radius = 25;

        function preload() {
            game.load.image('agent', 'assets/circle.png');
        }

        function create() {
            
            game.time.advancedTiming = true;
            game.physics.startSystem(Phaser.Physics.P2JS);
            game.physics.p2.restitution = 0.0;

            circleCollisionGroup = game.physics.p2.createCollisionGroup();
            game.physics.p2.updateBoundsCollisionGroup();

            circles = game.add.group();
            circles.enableBody = true;
            circles.physicsBodyType = Phaser.Physics.P2JS;

            fpsText = game.add.text(16, 14, 'FPS: 0', { font: '12px', fill: '#ff0000' });
            avgFpsText = game.add.text(16, 28, 'AVG FPS: 0', { font: '12px', fill: '#ff0000' });
            ballCountText = game.add.text(16, 42, 'BALL COUNT: 0', { font: '12px', fill: '#ff0000' });

//            var spriteMaterial = game.physics.p2.createMaterial('spriteMaterial');

//            var worldMaterial = game.physics.p2.createMaterial('worldMaterial');
            //  4 trues = the 4 faces of the world in left, right, top, bottom order
            //game.physics.p2.setWorldMaterial(worldMaterial, true, true, true, true);

            //  Here is the contact material. It's a combination of 2 materials, so whenever shapes with
            //  those 2 materials collide it uses the following settings.
            //  A single material can be used by as many different sprites as you like.
//            var contactMaterial = game.physics.p2.createContactMaterial(spriteMaterial, worldMaterial);
//            contactMaterial.friction = 0.0;     // Friction to use in the contact of these two materials.
//            contactMaterial.restitution = 1000.0;  // Restitution (i.e. how bouncy it is!) to use in the contact of these two materials.
//            contactMaterial.stiffness = 1e7;    // Stiffness of the resulting ContactEquation that this ContactMaterial generate.
//            contactMaterial.relaxation = 3;     // Relaxation of the resulting ContactEquation that this ContactMaterial generate.
//            contactMaterial.frictionStiffness = 1e7;    // Stiffness of the resulting FrictionEquation that this ContactMaterial generate.
//            contactMaterial.frictionRelaxation = 3;     // Relaxation of the resulting FrictionEquation that this ContactMaterial generate.
//            contactMaterial.surfaceVelocity = 0;        // Will add surface velocity to this material. If bodyA rests on top if bodyB, and the surface velocity is positive, bodyA will slide to the right.

            for (var i = 0; i < 50; i++)
            {
                createCircle();
//                var radius = UtilityService.randomInt(8,10);
//                var circle = circles.create(game.world.randomX, game.world.randomY, 'agent');
//                if (i < 2) {
//                    circle.width = 120;
//                    circle.height = 120;
//                    circle.body.setCircle(60,0,0,0);
//                    circle.body.mass = 5000;
//
//                    //circle.body.setMaterial(spriteMaterial);
//                    //circle.body.setZeroDamping();
//                    circle.body.setCollisionGroup(circleCollisionGroup);
//                    circle.body.collides(circleCollisionGroup);
//                    circle.body.angle = UtilityService.randomInt(0,359);
//                    circle.body.moveForward(UtilityService.randomInt(500,750));
//                } else {
//                    circle.width = radius * 2;
//                    circle.height = circle.width;
//                    circle.body.setCircle(radius,0,0,0);
//
//                    //circle.body.setMaterial(spriteMaterial);
//                    circle.body.setCollisionGroup(circleCollisionGroup);
//                    circle.body.collides(circleCollisionGroup);
//                    circle.body.angle = UtilityService.randomInt(0,359);
//                    //circle.body.moveForward(UtilityService.randomInt(500,1000));
//                    circle.body.mass = radius;
//                }
            }
            
            //circle.body.moveForward(1000);
            
        }
        
        function createCircle() {
            ballCount++;
            var radius = UtilityService.randomInt(8,10);
            var circle = circles.create(0, 0, 'agent');
            if (circles.children.length <= 2) {
                circle.width = 120;
                circle.height = 120;
                circle.body.setCircle(60,0,0,0);
                circle.body.mass = 5000;

                //circle.body.setMaterial(spriteMaterial);
                //circle.body.setZeroDamping();
                circle.body.setCollisionGroup(circleCollisionGroup);
                circle.body.collides(circleCollisionGroup);
                circle.body.angle = UtilityService.randomInt(0,359);
                //circle.body.moveForward(UtilityService.randomInt(500,750));
            } else {
                circle.width = radius * 2;
                circle.height = circle.width;
                circle.body.setCircle(radius,0,0,0);

                //circle.body.setMaterial(spriteMaterial);
                circle.body.setCollisionGroup(circleCollisionGroup);
                circle.body.collides(circleCollisionGroup);
                circle.body.angle = UtilityService.randomInt(0,359);
                //circle.body.moveForward(UtilityService.randomInt(500,1000));
                circle.body.mass = radius;
            }
        }
        
        function destroyCircle() {
            var circle = circles.children[circles.children.length - 1];
            circle.body.destroy();
            circle.destroy();
            ballCount--;
        }

        var frameCount = 0;
        var totFps = 0;
        function update() {
            if (frameCount > 180) {
                frameCount = 0;
                totFps = 0;
            }
            
            frameCount++;
            totFps += game.time.fps;
            avgFps = totFps / frameCount;

            fpsText.text = 'FPS: ' + game.time.fps;
            avgFpsText.text = 'AVG FPS: ' + Math.round(avgFps);
            ballCountText.text = 'BALL COUNT: ' + ballCount;

            
            if (avgFps >= 60 && game.time.fps >= 60 && ballCount < 800) {
                createCircle();
            }
            
            if (avgFps <= 55 && game.time.fps <= 55 && ballCount > 50) {
                destroyCircle();
            }
            
            for (var i = 0; i < 2; i++)
            {
                var circle = circles.children[i];
                if (circle.body.velocity.x > -2.0 && circle.body.velocity.x < 2.0 && circle.body.velocity.y > -2.0 && circle.body.velocity.y < 2.0) {
                    circle.body.angle = UtilityService.randomInt(0,359);
                    circle.body.moveForward(UtilityService.randomInt(200,500));
                }
            }
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