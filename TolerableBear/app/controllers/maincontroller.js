angular.module('MyModule')
    .controller('maincontroller', function ($scope, $timeout, TimeService) {
       'use strict';
       $scope.pageName = {};
       $scope.currentTime = TimeService.getNow();

       $scope.onTimeout = function () {
          mytimeout = $timeout($scope.onTimeout, 1000);
          $scope.currentTime = TimeService.getNow();
       };

       var mytimeout = $timeout($scope.onTimeout, 1000);

       $scope.$on("$destroy", function () {
          $timeout.cancel(mytimeout);
       });

       init();

       function init() {
          $scope.pageName = "Main";
       }
    });