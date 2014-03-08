angular.module('MyModule').factory('TimeService', function ($window) {
    'use strict';
    var TimeServiceFactory = {};

    TimeServiceFactory.getNow = function () {
        return $window.moment().format("dddd, MMMM Do YYYY, h:mm:ss a");
    };

    return TimeServiceFactory;
});