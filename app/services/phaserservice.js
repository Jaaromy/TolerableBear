angular.module('MyModule').factory('PhaserService', function ($window, UtilityService) {
    'use strict';
    var PhaserServiceFactory = {};

    var stages = [];

    PhaserServiceFactory.circle = function (x, y, radius) {
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

    PhaserServiceFactory.text = function (textVal, pos, fontSize, color) {
        var simpleText = new Kinetic.Text({
            x: pos.x,
            y: pos.y,
            text: textVal,
            fontSize: fontSize,
            fontFamily: 'Calibri',
            fill: color
        });

        simpleText.offsetX(simpleText.width() / 2);
        simpleText.offsetY(simpleText.height() / 2);

        return simpleText;
    };

    PhaserServiceFactory.rect = function (stage) {
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

    PhaserServiceFactory.layer = function () {
        var layer = new $window.Kinetic.Layer();

        return layer;
    };

    PhaserServiceFactory.createStage = function (container, width, height, preloadFn, createFn, updateFn) {
        var stage = new $window.Phaser.Game(width, height, Phaser.AUTO, '', { preload: preloadFn, create: createFn, update: updateFn });

        return stage;
    };

    return PhaserServiceFactory;
});