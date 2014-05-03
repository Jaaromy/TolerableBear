angular.module('MyModule', ['ngRoute', 'ui.bootstrap']);

angular.module('MyModule').config(function ($routeProvider) {
   $routeProvider.when("/main", {
      controller: "maincontroller",
      templateUrl: "app/views/main.html"
   });

   $routeProvider.when("/collisions", {
      controller: "collisioncontroller",
      templateUrl: "app/views/shapes.html"
   });

   $routeProvider.when("/velocity", {
       controller: "velocitycontroller",
       templateUrl: "app/views/shapes.html"
   });

   $routeProvider.when("/phasercol", {
       controller: "phasercollisioncontroller",
       templateUrl: "app/views/phaser.html"
   });

   $routeProvider.otherwise({ redirectTo: "/phasercol" });
});