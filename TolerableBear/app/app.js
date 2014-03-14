angular.module('MyModule', ['ngRoute', 'ui.bootstrap']);

angular.module('MyModule').config(function ($routeProvider) {
   $routeProvider.when("/", {
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

   $routeProvider.otherwise({ redirectTo: "/" });
});