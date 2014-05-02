angular.module('MyModule')
    .controller('navcontroller', function ($scope, $location) {
        'use strict';

        $scope.navModel = $location.path();

        $scope.$on('$routeChangeStart', function () {
            $scope.navModel = $location.path();
        });

        $scope.$watch('navModel', function (newValue, oldValue) {
            $location.path(newValue);
        });
    });