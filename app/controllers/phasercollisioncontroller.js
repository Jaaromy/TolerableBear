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
        
        var game = new $window.Phaser.Game(1000, 600, $window.Phaser.AUTO, '', { preload: preload, create: create, update: update });
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
//            updatedText = game.add.text(16, 16, 'updated: 0', { fontSize: '32px', fill: '#FFF' });
//            game.time.advancedTiming = true;
//            fpsText = game.add.text(16, 50, 'fps: 0', { fontSize: '32px', fill: '#FFF' });
            
            circles = game.add.group();
            
            var spriteMaterial = game.physics.p2.createMaterial('spriteMaterial');

            var worldMaterial = game.physics.p2.createMaterial('worldMaterial');
            //  4 trues = the 4 faces of the world in left, right, top, bottom order
            //game.physics.p2.setWorldMaterial(worldMaterial, true, true, true, true);

            //  Here is the contact material. It's a combination of 2 materials, so whenever shapes with
            //  those 2 materials collide it uses the following settings.
            //  A single material can be used by as many different sprites as you like.
            var contactMaterial = game.physics.p2.createContactMaterial(spriteMaterial, worldMaterial);
            contactMaterial.friction = 0.0;     // Friction to use in the contact of these two materials.
            contactMaterial.restitution = 1000.0;  // Restitution (i.e. how bouncy it is!) to use in the contact of these two materials.
            contactMaterial.stiffness = 1e7;    // Stiffness of the resulting ContactEquation that this ContactMaterial generate.
            contactMaterial.relaxation = 3;     // Relaxation of the resulting ContactEquation that this ContactMaterial generate.
            contactMaterial.frictionStiffness = 1e7;    // Stiffness of the resulting FrictionEquation that this ContactMaterial generate.
            contactMaterial.frictionRelaxation = 3;     // Relaxation of the resulting FrictionEquation that this ContactMaterial generate.
            contactMaterial.surfaceVelocity = 0;        // Will add surface velocity to this material. If bodyA rests on top if bodyB, and the surface velocity is positive, bodyA will slide to the right.

            for (var i = 0; i < 75; i++)
            {
                var radius = UtilityService.randomInt(10,50);
                var circle = circles.create(UtilityService.randomInt(50,950), UtilityService.randomInt(50,550), 'agent');
                circle.width = radius * 2;
                circle.height = circle.width;
                game.physics.p2.enable(circle);

                //circle.body.setMaterial(spriteMaterial);
                circle.body.setCircle(radius,0,0,0);
                circle.body.angle = UtilityService.randomInt(0,359);
                circle.body.moveForward(UtilityService.randomInt(500,1000));
                circle.body.mass = radius;
            }

            //circle.body.moveForward(1000);
            
        }

        function update() {
//            updatedText.text = 'updated: ' + updatedCount++;
//            fpsText.text = 'fps: ' + game.time.fps;
            
//            for (var i = 0; i < circles.children.length; i++)
//            {
//                circles.children[i].body.moveForward(50);
//            }
            //circle.body.moveForward(50);
            
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