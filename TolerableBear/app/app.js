angular.module('MyModule', ['ngRoute']);

angular.module('MyModule').config(function ($routeProvider) {
    $routeProvider.when("/", {
        controller: "maincontroller",
        templateUrl: "/app/views/main.html"
    });

    $routeProvider.when("/test", {
        controller: "testcontroller",
        templateUrl: "/app/views/main.html"
    });


    $routeProvider.otherwise({ redirectTo: "/" });
});