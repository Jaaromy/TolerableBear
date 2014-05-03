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
        var circles;
        //var radius = 25;

        function preload() {
            game.load.image('agent', 'assets/circle.png');
        }

        function create() {
            game.physics.startSystem(Phaser.Physics.P2JS);
            game.physics.p2.restitution = 0.0;

            var circleCollisionGroup = game.physics.p2.createCollisionGroup();
            game.physics.p2.updateBoundsCollisionGroup();

            circles = game.add.group();
            circles.enableBody = true;
            circles.physicsBodyType = Phaser.Physics.P2JS;
            
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

            for (var i = 0; i < 200; i++)
            {
                var radius = UtilityService.randomInt(12,20);
                var circle = circles.create(game.world.randomX, game.world.randomY, 'agent');
                if (i < 2) {
                    circle.width = 150;
                    circle.height = 150;
                    circle.body.setCircle(74,0,0,0);
                    circle.body.mass = 5000;

                    //circle.body.setMaterial(spriteMaterial);
                    //circle.body.setZeroDamping();
                    circle.body.setCollisionGroup(circleCollisionGroup);
                    circle.body.collides(circleCollisionGroup);
                    circle.body.angle = UtilityService.randomInt(0,359);
                    circle.body.moveForward(UtilityService.randomInt(500,750));
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
            
            //circle.body.moveForward(1000);
            
        }

        function update() {
//            updatedText.text = 'updated: ' + updatedCount++;
//            fpsText.text = 'fps: ' + game.time.fps;
            
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