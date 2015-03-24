'use strict';

/**
 * @ngdoc function
 * @name v1App.controller:TeamsCtrl
 * @description
 * # TeamsCtrl
 * Controller of the v1App
 */
angular.module('v1App')
    .controller('TeamsCtrl', function($scope, $rootScope, ngDialog, $timeout, $routeParams) {
        $scope.viewTab = $routeParams.tab;

        $rootScope.isMenu = false;
        $scope.something = '';

        $scope.sampleValue1 = 8;
        $scope.sampleValue2 = 7;
        $scope.sampleValue3 = 9;
        $scope.sampleValue4 = 7;

        function addRandomUsers(n) {
            var usersToReturn = [];
            var randomUsers = [{
                name: 'Elaine Richards',
                img: 'https://randomuser.me/api/portraits/med/women/86.jpg'
            }, {
                name: 'Aiden Washington',
                img: 'https://randomuser.me/api/portraits/med/men/46.jpg'
            }, {
                name: 'Mathew Carpenter',
                img: 'https://randomuser.me/api/portraits/med/men/61.jpg'
            }, {
                name: 'Susan Fisher',
                img: 'https://randomuser.me/api/portraits/med/women/65.jpg'
            }];
            for (var i = 0; i < n; i++) {
                usersToReturn.push(randomUsers[Math.floor((Math.random() * 4))]);
            }
            // console.log(usersToReturn);
            return usersToReturn;
        }

        $scope.brandManagers = addRandomUsers(6);
        $scope.brandBuilders = addRandomUsers(8);
        $scope.brandMarketers1 = addRandomUsers(7);
        $scope.brandMarketers2 = addRandomUsers(9);
        $scope.brandMarketers3 = addRandomUsers(5);

        // Modal box via ngDialog
        $scope.openProfile = function($event, user) {
            $timeout(function() {
                console.log(user);
                $scope.dataToRender = user;
                var isDragging = angular.element($event.currentTarget).hasClass('ui-draggable-dragging');
                var isHidden = angular.element($event.currentTarget).hasClass('hidden');
                // console.log(that);
                if (!isDragging && !isHidden) {
                    ngDialog.open({
                        template: 'views/profileModal.html',
                        scope: $scope
                    });
                }
            }, 0);
        };

        $scope.openPreferencesModal = function() {
            console.log('open preferences modal');
            $timeout(function() {
                ngDialog.open({
                    template: 'views/preferencesModal.html',
                    scope: $scope
                });
            }, 0);
        };

        $scope.onDropBrandManager = function(event, ui) {
            var model = JSON.parse(ui.draggable.attr('data-model'));
            // $scope.hideDrag[0] = true;
            angular.element('#' + ui.draggable.attr('id')).addClass('hidden');
            $rootScope.droppedBrandManager = model.img;
            console.log('on drop');
            $scope.randomTeamValue();
            $scope.shouldReset = false;
            $scope.hasDropped = true;
        };

        $scope.onDropBrandBuilder = function(event, ui) {
            var model = JSON.parse(ui.draggable.attr('data-model'));
            // $scope.hideDrag[0] = true;
            angular.element('#' + ui.draggable.attr('id')).addClass('hidden');
            $rootScope.droppedBrandBuilder = model.img;
            console.log('on drop');
            $scope.randomTeamValue();
            $scope.shouldReset = false;
            $scope.hasDropped = true;
        };

        $scope.onDropMarketer1 = function(event, ui) {
            var model = JSON.parse(ui.draggable.attr('data-model'));
            // $scope.hideDrag[0] = true;
            angular.element('#' + ui.draggable.attr('id')).addClass('hidden');
            $rootScope.droppedMarketer1 = model.img;
            console.log('on drop');
            $scope.randomTeamValue();
            $scope.shouldReset = false;
            $scope.hasDropped = true;
        };

        $scope.onDropMarketer2 = function(event, ui) {
            var model = JSON.parse(ui.draggable.attr('data-model'));
            // $scope.hideDrag[0] = true;
            angular.element('#' + ui.draggable.attr('id')).addClass('hidden');
            $rootScope.droppedMarketer2 = model.img;
            console.log('on drop');
            $scope.randomTeamValue();
            $scope.shouldReset = false;
            $scope.hasDropped = true;
        };

        $scope.onDropMarketer3 = function(event, ui) {
            var model = JSON.parse(ui.draggable.attr('data-model'));
            // $scope.hideDrag[0] = true;
            angular.element('#' + ui.draggable.attr('id')).addClass('hidden');
            $rootScope.droppedMarketer3 = model.img;
            console.log('on drop');
            $scope.randomTeamValue();
            $scope.shouldReset = false;
            $scope.hasDropped = true;
        };

        // Helpers
        $scope.randomTeamValue = function() {
            var rand1 = Math.floor(Math.random() * 40 + 50);
            var rand2 = Math.floor(Math.random() * 40 + 50);
            var rand3 = Math.floor(Math.random() * 40 + 50);
            var rand4 = Math.floor(Math.random() * 40 + 50);
            $rootScope.brandExperienceValue = rand1;
            $rootScope.innovationExterpiseValue = rand2;
            $rootScope.regionalExpertiseValue = rand3;
            $rootScope.collaborationValue = rand4;

            $rootScope.isChecked1 = (rand1 > 80) ? true : false;
            $rootScope.isChecked2 = (rand2 > 80) ? true : false;

            $scope.shouldReset = true;
        };

        $scope.resetTeamValue = function() {
            if ($scope.shouldReset && !$scope.hasDropped) {
                $rootScope.brandExperienceValue = 0;
                $rootScope.innovationExterpiseValue = 0;
                $rootScope.regionalExpertiseValue = 0;
                $rootScope.collaborationValue = 0;
                $rootScope.isChecked1 = false;
                $rootScope.isChecked2 = false;
            }
        };

        $scope.generateRecommendedTeams = function() {
            $scope.recommendedTeams = [];
            var tmpTeamName = ['TEAM A', 'TEAM B', 'TEAM C', 'TEAM D', 'TEAM E'];
            for (var i = 0; i < 5; i++) {
                $scope.recommendedTeams.push({
                    teamName: tmpTeamName[i],
                    teamMembers: $scope.generateTeamMembers(),
                    brandExperienceValue: Math.floor(Math.random() * 40 + 50),
                    innovationExterpiseValue: Math.floor(Math.random() * 40 + 50),
                    regionalExpertiseValue: Math.floor(Math.random() * 40 + 50),
                    collaborationValue: Math.floor(Math.random() * 40 + 50),
                    isChecked1: true,
                    isChecked2: true

                });
            }
            console.log($scope.recommendedTeams);
        };

        $scope.generateTeamMembers = function() {
            var membersToReturn = [];
            membersToReturn.push({
                'Brand Manager': addRandomUsers(1)[0].img,
                'Brand Builder': addRandomUsers(1)[0].img,
                'Marketer I': addRandomUsers(1)[0].img,
                'Marketer II': addRandomUsers(1)[0].img,
                'Marketer III': addRandomUsers(1)[0].img
            });
            return membersToReturn[0];
        };
        if ($scope.viewTab == 'recommend') {
            $scope.generateRecommendedTeams();
        }

    });