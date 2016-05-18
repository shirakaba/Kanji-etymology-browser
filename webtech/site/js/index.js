angular.module('kanjiApp', ['ngAnimate']) // [''] contains dependencies.
    // by default, angular animates every class, so we need to configure its selection.
    .config(['$animateProvider', function($animateProvider){
        $animateProvider.classNameFilter(/houdini/); // filter for any class containing the string 'houdini'
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
    })

    // The '$scope' directive is injected in as a dependency. By mutating the controller's $scope, you can mutate the webpage's view.
    .controller('kanjiListController', ["$scope", function(sc) {
        sc.search = "生";
        sc.output = "init";
        sc.currentRow = [];
        sc.kanjidicReadingResults = [];
        sc.hideMe = false;
        // We declare this one only because our ng-show interacts with it. It's more about being explicit for documentation.
        //sc.hkanjiIndexOnlyResult = undefined;

        // sc.changeAndSubmit = function(element){
        //     sc.search = element.value;
        //     // sc.submit();
        // };

        sc.submit = function() {

            $.ajax({
                    url        : "http://127.0.0.1:3000",
                    dataType   : 'json',
                    contentType: 'application/json; charset=UTF-8', // This is the money shot
                    data       : JSON.stringify({
                        "kanjiglyph": this.search
                    }),
                    type       : 'POST' // etc
                })
                .done(function(data, textStatus, jqXHR) {
                    console.log(data); // logs the incoming data as javascript objects
//					console.log(JSON.stringify(data, undefined, "  ")); // serialises the JSON to a string to emerge in Chrome console
                        sc.$apply(function() {
                            if(data.kanjidicReadingSearch.length){
                                sc.hideMe = false;
                                    sc.searchQuery = data.receivedsearch;
                                    sc.hkanjiPageOnlyResult = data.hkanjiPageSearch || "";
                                    sc.hkanjiIndexOnlyResult = data.hkanjiIndexSearch || "";
                                    sc.hkanjiCodePointOnlyResult = data.hkanjiCodePointSearch || "";
                                    //
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

                    // The original JQuery version we were using until replacement with AngularJS's slideDown() transitions
                    // if(sc.kanjidicReadingResults.length){
                    //     $(".panel").not(".copyright").slideDown("slow");
                    // }
                    // else{
                    //     $(".panel").not(".copyright").fadeOut("slow");
                    //     $(".panel").not(".copyright").hide();
                    // }
                })
                .fail(function(jqXHR, textStatus, errorThrown) {
                    console.error(arguments);
                });
        };
    }]);