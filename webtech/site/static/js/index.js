"use strict";

angular.module('kanjiApp', ['ngAnimate', 'ui.router']) // [''] contains dependencies.
    // by default, angular animates every class, so we need to configure its selection.
    .config(['$animateProvider', '$stateProvider', '$urlRouterProvider',
        function($animateProvider, $stateProvider, $urlRouterProvider){
            $urlRouterProvider.otherwise("/search");
            $animateProvider.classNameFilter(/houdini/); // filter for any class containing the string 'houdini'

            $stateProvider
            .state({
                name: 'search',
                url: "/search",
                templateUrl: "partials/search.html",
                // // The '$scope' directive is injected in as a dependency. By mutating the controller's $scope, you can mutate the webpage's view.
                controller: ["$scope", function(sc) {
                    sc.mySearch = "生"; // the input field's value is bound to the value of this variable.
                    sc.currentRow = [];
                    sc.kanjidicReadingResults = [];
                    sc.hideMe = false; // We declare this one only because our ng-show interacts with it. It's more about being explicit for documentation.

                    sc.submit = function(query) {
                        sc.mySearch = query;

                        $.ajax({
                                url        : "http://127.0.0.1:3000",
                                dataType   : 'json',
                                contentType: 'application/json; charset=UTF-8',
                                data       : JSON.stringify({
                                    "kanjiglyph": query
                                }),
                                type       : 'POST'
                            })
                            .done(function(data, textStatus, jqXHR) {
                                console.log(data); // logs the incoming data as javascript objects
            //                  console.log(JSON.stringify(data, undefined, "  ")); // serialises the JSON to a string to emerge in Chrome console
                                    sc.$apply(function() {
                                        if(data.kanjidicReadingSearch.length){
                                            sc.hideMe = false;
                                                sc.searchQuery = data.receivedsearch;
                                                sc.hkanjiPageOnlyResult = data.hkanjiPageSearch || "";
                                                sc.hkanjiIndexOnlyResult = data.hkanjiIndexSearch || "";
                                                sc.hkanjiCodePointOnlyResult = data.hkanjiCodePointSearch || "";

                                                sc.kanjidicReadingResults = data.kanjidicReadingSearch;
                                                sc.kanjidicDefinitionResults = data.kanjidicDefinitionSearch;
                                                sc.kanjidicFrequencyResults = data.kanjidicFrequencySearch|| "";
                                                sc.kanjidicStrokeResults = data.kanjidicStrokeSearch|| "";
                                                sc.kanjidicJlptResults = data.kanjidicJlptSearch|| "";
                                                sc.kanjidicGradeResults = data.kanjidicGradeSearch|| "";
                                        }
                                        else{
                                            sc.hideMe = true;

                                        }

                                    });
                            })
                            .fail(function(jqXHR, textStatus, errorThrown) {
                                console.error(arguments);
                            });
                    };
                }]
            })
            .state({
                name: 'about',
                url: "/about",
                templateUrl: "partials/about.html"
            });
        }])
    .controller('navController', ['$scope', '$state', function($scope, $state) {
        $scope.$state = $state;
    }])

    // angularJS version of JQuery's slideDown() from http://stackoverflow.com/questions/22659729/modifying-dom-slidedown-slideup-with-angularjs-and-jquery
    .animation('.houdini', function() {
        var NG_HIDE_CLASS = 'ng-hide';
        return {
            beforeAddClass: function(element, className, done) {
                if(className === NG_HIDE_CLASS) {
                    element.slideUp(done);
                }
            },
            removeClass: function(element, className, done) {
                if(className === NG_HIDE_CLASS) {
                    element.hide().slideDown(done);
                }
            }
        }
    });
