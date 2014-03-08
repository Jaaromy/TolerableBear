angular.module('MyModule').factory('UtilityService', function ($window) {
   'use strict';
   var UtilityServiceFactory = {};

   UtilityServiceFactory.random = function (min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
   };

   return UtilityServiceFactory;
});