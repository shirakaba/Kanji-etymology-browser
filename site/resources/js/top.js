angular.module('kanjiApp', [])
    // Each module can have multiple controllers (ie, to do different actions for different submission forms).
    .controller('myCtrl', ['$scope', function($scope) {
     $scope.firstName = "john";
     $scope.lastName = "doe";
     }])

    // The '$scope' directive is injected in as a dependency. By mutating the controller's $scope, you can mutate the webpage's view.
    .controller('kanjiListController', ["$scope", function(sc) {
        sc.search = "生";
        sc.output = "init";
        sc.currentRow = [];
        sc.kanjidicReadingResults = [];
        // We declare this one only because our ng-show interacts with it. It's more about being explicit for documentation.
        //sc.hkanjiIndexOnlyResult = undefined;

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
                        sc.searchQuery = data.receivedsearch;
                        sc.hkanjiPageOnlyResult = data.hkanjiPageSearch || "";
                        sc.hkanjiIndexOnlyResult = data.hkanjiIndexSearch || "";
                        sc.hkanjiCodePointOnlyResult = data.hkanjiCodePointSearch || "";
                        //
                        sc.kanjidicReadingResults = data.kanjidicReadingSearch;
                        sc.kanjidicDefinitionResults = data.kanjidicDefinitionSearch;
                        sc.kanjidicFrequencyResults = data.kanjidicFrequencySearch|| "";
                    });
                })
                .fail(function(jqXHR, textStatus, errorThrown) {
                    console.error(arguments);
                });
        };
    }]);
