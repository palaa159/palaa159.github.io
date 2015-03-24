'use strict';

/**
 * @ngdoc function
 * @name v1App.controller:AdvisorsCtrl
 * @description
 * # AdvisorsCtrl
 * Controller of the v1App
 */
angular.module('v1App')
    .controller('AdvisorsCtrl', function($scope, $rootScope) {
        $rootScope.shouldShowNav = true;
        $rootScope.isMenu = false;
        $scope.image = 'advisors';
        $scope.imageLength = 3;
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