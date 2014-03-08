angular.module('MyModule').factory('KineticService', function ($window) {
    'use strict';
    var KineticServiceFactory = {};

    KineticServiceFactory.random = function (min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    KineticServiceFactory.circle = function (stage) {
        var circle = new Kinetic.Circle({
            x: stage.getWidth() / 2,
            y: stage.getHeight() / 2,
            radius: 70,
            fill: 'red',
            stroke: 'black',
            strokeWidth: 4
        });

        return circle;
    };

    KineticServiceFactory.circle = function (stage) {
        var circle = new Kinetic.Circle({
            x: stage.getWidth() / 2,
            y: stage.getHeight() / 2,
            radius: 70,
            fill: 'red',
            stroke: 'black',
            strokeWidth: 4
        });

        return circle;
    };

    KineticServiceFactory.rect = function (stage) {
        var rect = new Kinetic.Rect({
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

    KineticServiceFactory.layer = function (shape) {
        var layer = new Kinetic.Layer();

        if (shape) {
            layer.add(shape);
        }

        return layer;
    };

    KineticServiceFactory.createStage = function (container, width, height) {
        var stage = new $window.Kinetic.Stage({
            container: container,
            width: width ? width : 400,
            height: height ? height : 300
        });

        return stage;
    };

    return KineticServiceFactory;
});