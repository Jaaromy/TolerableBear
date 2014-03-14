angular.module('MyModule')
    .controller('navcontroller', function ($scope, $location) {
        'use strict';

        $scope.navModel = 'main';

        $scope.$watch('navModel', function (newValue, oldValue) {
            $location.path('/' + newValue);
        });
    });