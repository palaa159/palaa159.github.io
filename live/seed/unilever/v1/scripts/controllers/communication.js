'use strict';

/**
 * @ngdoc function
 * @name v1App.controller:CommunicationCtrl
 * @description
 * # CommunicationCtrl
 * Controller of the v1App
 */
angular.module('v1App')
    .controller('CommunicationCtrl', function($scope, $rootScope) {
        $rootScope.isMenu = false;
        $rootScope.shouldShowMyProject = false;
        $scope.status = {};
        $scope.status.onGoing = {
            open: true
        };
        $scope.status.timeline = {
            open: true
        };
        $scope.status.performance = {
            open: true
        };
        $scope.status.feed = {
            open: true
        };
        $scope.status.messages = {
            open: true
        };
        $scope.status.calendar = {
            open: true
        };
        $scope.status.suggestions = {
            open: true
        };

        $scope.events = [{
            title: 'My event title', // The title of the event
            type: 'info', // The type of the event (determines its color). Can be important, warning, info, inverse, success or special
            starts_at: new Date(2015, 5, 1, 1), // A javascript date object for when the event starts
            ends_at: new Date(2016, 8, 26, 15), // A javascript date object for when the event ends
            editable: false, // If calendar-edit-event-html is set and this field is explicitly set to false then dont make it editable
            deletable: false // If calendar-delete-event-html is set and this field is explicitly set to false then dont make it deleteable
        }];
        $scope.calendarView = 'month';
        console.log('Communication Controller');
    });