angular.module('MyModule').factory('KineticService', function ($window) {
   'use strict';
   var KineticServiceFactory = {};

   var stages = [];

   KineticServiceFactory.circle = function (x, y, radius) {
      var circle = new $window.Kinetic.Circle({
         x: x,
         y: y,
         radius: radius,
         fill: 'red',
         stroke: 'black',
         strokeWidth: 2
      });

      return circle;
   };

   //KineticServiceFactory.circle = function (stage) {
   //   var circle = new $window.Kinetic.Circle({
   //      x: stage.getWidth() / 2,
   //      y: stage.getHeight() / 2,
   //      radius: 70,
   //      fill: 'red',
   //      stroke: 'black',
   //      strokeWidth: 4
   //   });

   //   return circle;
   //};

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

   KineticServiceFactory.layer = function (shape) {
      var layer = new $window.Kinetic.Layer();

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