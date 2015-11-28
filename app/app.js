/// <reference path="../typings/angularjs/angular.d.ts"/>
angular.module('MyModule', ['ngRoute']);

angular.module('MyModule').config(function ($routeProvider) {
   $routeProvider.when("/main", {
      controller: "maincontroller",
      templateUrl: "app/views/main.html"
   });

//   $routeProvider.when("/collisions", {
//      controller: "collisioncontroller",
//      templateUrl: "app/views/shapes.html"
//   });
//
//   $routeProvider.when("/velocity", {
//       controller: "velocitycontroller",
//       templateUrl: "app/views/shapes.html"
//   });

   $routeProvider.when("/ballpit", {
       controller: "ballpitcontroller",
       templateUrl: "app/views/ballpit.html"
   });
    
   $routeProvider.when("/facing", {
       controller: "facingcontroller",
       templateUrl: "app/views/facing.html"
   });

   $routeProvider.when("/follow", {
       controller: "followcontroller",
       templateUrl: "app/views/follow.html"
   });

   $routeProvider.when("/flock", {
       controller: "flockcontroller",
       templateUrl: "app/views/flock.html"
   });


   $routeProvider.otherwise({ redirectTo: "/follow" });
});
