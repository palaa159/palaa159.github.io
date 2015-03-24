'use strict';

/**
 * @ngdoc function
 * @name v1App.controller:MenuCtrl
 * @description
 * # MenuCtrl
 * Controller of the v1App
 */
angular.module('v1App')
    .controller('MenuCtrl', function($scope, $rootScope) {
        $rootScope.isMenu = true;
        $scope.date = new Date();

        // Notification
        if (!$rootScope.hasNotified) {
            new PNotify({
                title: 'Dove Focus Project',
                text: 'Complete Gate document for Dove brand extension. Deadline in 7 hours.',
                addclass: 'notification',
                hide: false
            });
            $rootScope.hasNotified = true;
        }


        CoolClock.findAndCreateClocks();
    });