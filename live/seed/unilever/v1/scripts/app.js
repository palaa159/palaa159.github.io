'use strict';

/**
 * @ngdoc overview
 * @name v1App
 * @description
 * # v1App
 *
 * Main module of the application.
 */
angular
    .module('v1App', [
        'ngAnimate',
        'ngCookies',
        'ngResource',
        'ngRoute',
        'ngSanitize',
        'ngTouch',
        'angularMoment',
        'ngDragDrop',
        'ngDialog',
        'ui.bootstrap',
        'ui.bootstrap-slider',
        'mwl.calendar'
    ])

    .run(function($rootScope) {
        $rootScope.user = 'Jane';
        $rootScope.hasNotified = false;
    })
    .config(function($routeProvider) {
    $routeProvider
        .when('/menu', {
            templateUrl: 'views/menu.html',
            controller: 'MenuCtrl'
        })
        .when('/teams/:tab', {
            templateUrl: 'views/teams.html',
            controller: 'TeamsCtrl'
        })
        .when('/communication', {
            templateUrl: 'views/communication.html',
            controller: 'CommunicationCtrl'
        })
        .when('/advisors', {
            templateUrl: 'views/advisors.html',
            controller: 'AdvisorsCtrl'
        })
        .when('/projects', {
            templateUrl: 'views/projects.html',
            controller: 'ProjectsCtrl'
        })
        .when('/applications', {
            templateUrl: 'views/applications.html',
            controller: 'ApplicationsCtrl'
        })
        .otherwise({
            redirectTo: '/menu'
        });
});