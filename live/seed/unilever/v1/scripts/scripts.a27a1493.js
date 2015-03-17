"use strict";angular.module("v1App",["ngAnimate","ngCookies","ngResource","ngRoute","ngSanitize","ngTouch","angularMoment","ngDragDrop","ngDialog","ui.bootstrap","ui.bootstrap-slider"]).config(["$routeProvider",function(a){a.when("/menu",{templateUrl:"views/menu.html",controller:"MenuCtrl"}).when("/teams/:tab",{templateUrl:"views/teams.html",controller:"TeamsCtrl"}).otherwise({redirectTo:"/menu"})}]),angular.module("v1App").controller("MenuCtrl",["$scope","$rootScope",function(a,b){b.isMenu=!0,a.date=new Date}]),angular.module("v1App").controller("TeamsCtrl",["$scope","$rootScope","ngDialog","$timeout","$routeParams",function(a,b,c,d,e){function f(a){for(var b=[],c=[{name:"Elaine Richards",img:"https://randomuser.me/api/portraits/med/women/86.jpg"},{name:"Aiden Washington",img:"https://randomuser.me/api/portraits/med/men/46.jpg"},{name:"Mathew Carpenter",img:"https://randomuser.me/api/portraits/med/men/61.jpg"},{name:"Susan Fisher",img:"https://randomuser.me/api/portraits/med/women/65.jpg"}],d=0;a>d;d++)b.push(c[Math.floor(4*Math.random())]);return b}a.viewTab=e.tab,b.isMenu=!1,a.something="",a.brandManagers=f(6),a.brandBuilders=f(8),a.brandMarketers1=f(7),a.brandMarketers2=f(9),a.brandMarketers3=f(5),a.openProfile=function(b,e){d(function(){console.log(e),a.dataToRender=e;var d=angular.element(b.currentTarget).hasClass("ui-draggable-dragging"),f=angular.element(b.currentTarget).hasClass("hidden");d||f||c.open({template:"views/profileModal.html",scope:a})},0)},a.openPreferencesModal=function(){console.log("open preferences modal"),d(function(){c.open({template:"views/preferencesModal.html",scope:a})},0)},a.onDropBrandManager=function(c,d){var e=JSON.parse(d.draggable.attr("data-model"));angular.element("#"+d.draggable.attr("id")).addClass("hidden"),b.droppedBrandManager=e.img,console.log("on drop"),a.randomTeamValue(),a.shouldReset=!1,a.hasDropped=!0},a.onDropBrandBuilder=function(c,d){var e=JSON.parse(d.draggable.attr("data-model"));angular.element("#"+d.draggable.attr("id")).addClass("hidden"),b.droppedBrandBuilder=e.img,console.log("on drop"),a.randomTeamValue(),a.shouldReset=!1,a.hasDropped=!0},a.onDropMarketer1=function(c,d){var e=JSON.parse(d.draggable.attr("data-model"));angular.element("#"+d.draggable.attr("id")).addClass("hidden"),b.droppedMarketer1=e.img,console.log("on drop"),a.randomTeamValue(),a.shouldReset=!1,a.hasDropped=!0},a.onDropMarketer2=function(c,d){var e=JSON.parse(d.draggable.attr("data-model"));angular.element("#"+d.draggable.attr("id")).addClass("hidden"),b.droppedMarketer2=e.img,console.log("on drop"),a.randomTeamValue(),a.shouldReset=!1,a.hasDropped=!0},a.onDropMarketer3=function(c,d){var e=JSON.parse(d.draggable.attr("data-model"));angular.element("#"+d.draggable.attr("id")).addClass("hidden"),b.droppedMarketer3=e.img,console.log("on drop"),a.randomTeamValue(),a.shouldReset=!1,a.hasDropped=!0},a.randomTeamValue=function(){var c=Math.floor(40*Math.random()+50),d=Math.floor(40*Math.random()+50),e=Math.floor(40*Math.random()+50),f=Math.floor(40*Math.random()+50);b.brandExperienceValue=c,b.innovationExterpiseValue=d,b.regionalExpertiseValue=e,b.collaborationValue=f,b.isChecked1=c>80?!0:!1,b.isChecked2=d>80?!0:!1,a.shouldReset=!0},a.resetTeamValue=function(){a.shouldReset&&!a.hasDropped&&(b.brandExperienceValue=0,b.innovationExterpiseValue=0,b.regionalExpertiseValue=0,b.collaborationValue=0,b.isChecked1=!1,b.isChecked2=!1)},a.generateRecommendedTeams=function(){a.recommendedTeams=[];for(var b=["TEAM A","TEAM B","TEAM C","TEAM D","TEAM E"],c=0;5>c;c++)a.recommendedTeams.push({teamName:b[c],teamMembers:a.generateTeamMembers(),brandExperienceValue:Math.floor(40*Math.random()+50),innovationExterpiseValue:Math.floor(40*Math.random()+50),regionalExpertiseValue:Math.floor(40*Math.random()+50),collaborationValue:Math.floor(40*Math.random()+50),isChecked1:!0,isChecked2:!0});console.log(a.recommendedTeams)},a.generateTeamMembers=function(){var a=[];return a.push({"Brand Manager":f(1)[0].img,"Brand Builder":f(1)[0].img,"Marketer I":f(1)[0].img,"Marketer II":f(1)[0].img,"Marketer III":f(1)[0].img}),a[0]},"recommend"==a.viewTab&&a.generateRecommendedTeams()}]);