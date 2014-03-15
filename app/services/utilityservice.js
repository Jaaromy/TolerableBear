angular.module('MyModule').factory('UtilityService', function ($window) {
   'use strict';
   var UtilityServiceFactory = {};

   UtilityServiceFactory.randomInt = function (min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
   };

   UtilityServiceFactory.random = function (min, max) {
      return Math.random() * (max - min) + min;
   };

   return UtilityServiceFactory;
});