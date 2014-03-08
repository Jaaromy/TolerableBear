angular.module('MyModule', ['ngRoute']);

angular.module('MyModule').config(function ($routeProvider) {
    $routeProvider.when("/", {
        controller: "maincontroller",
        templateUrl: "/app/views/main.html"
    });

    $routeProvider.when("/circle", {
        controller: "circlecontroller",
        templateUrl: "/app/views/shapes.html"
    });

    $routeProvider.when("/rectangle", {
        controller: "rectcontroller",
        templateUrl: "/app/views/shapes.html"
    });

    $routeProvider.otherwise({ redirectTo: "/" });
});