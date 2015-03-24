'use strict';

/**
 * @ngdoc function
 * @name v1App.controller:ProjectsCtrl
 * @description
 * # ProjectsCtrl
 * Controller of the v1App
 */
angular.module('v1App')
    .controller('ProjectsCtrl', function($scope, $rootScope) {
        $rootScope.shouldShowNav = true;
        $rootScope.isMenu = false;
        $scope.image = 'projects';
        $scope.imageLength = 5;
        $scope.currentOrder = 0;
        $scope.currentImage = $scope.image + '-0' + ($scope.currentOrder + 1).toString() + '.png';

        // < >
        $scope.nextPage = function() {
            console.log('next page');
            if ($scope.currentOrder < $scope.imageLength) {
                $scope.currentOrder++;
            } else {
                $scope.currentOrder = 0;
            }
            // console.log($scope.currentOrder);
            $scope.currentImage = $scope.image + '-0' + ($scope.currentOrder + 1).toString() + '.png';
        };

        $scope.prevPage = function() {
            console.log('previous page');
            if ($scope.currentOrder < 0) {
                $scope.currentOrder = $scope.imageLength;
            } else {
                $scope.currentOrder--;
            }
            // console.log($scope.currentImage);
            $scope.currentImage = $scope.image + '-0' + ($scope.currentOrder + 1).toString() + '.png';
        };
    });