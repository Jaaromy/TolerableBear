angular.module('MyModule').factory('KineticService', function ($window, UtilityService) {
    'use strict';
    var KineticServiceFactory = {};

    var stages = [];

    KineticServiceFactory.circle = function (x, y, radius) {
        var circle = new $window.Kinetic.Circle({
            x: x,
            y: y,
            radius: radius,
            fill: 'rgb({0},{1},{2})'.format(UtilityService.randomInt(0, 255), UtilityService.randomInt(0, 120), UtilityService.randomInt(120, 255)),
            stroke: 'black',
            strokeWidth: 2
        });

        return circle;
    };

    KineticServiceFactory.rect = function (stage) {
        var rect = new $window.Kinetic.Rect({
            x: 239,
            y: 75,
            width: 100,
            height: 50,
            fill: 'green',
            stroke: 'black',
            strokeWidth: 4
        });

        return rect;
    };

    KineticServiceFactory.layer = function () {
        var layer = new $window.Kinetic.Layer();

        return layer;
    };

    KineticServiceFactory.createStage = function (container, width, height) {
        $window.Kinetic.pixelRatio = 1;
        var stage = new $window.Kinetic.Stage({
            container: container,
            width: width ? width : 400,
            height: height ? height : 300
        });

        return stage;
    };

    return KineticServiceFactory;
});