angular.module('kanjiApp', [])
    // Each module can have multiple controllers (ie, to do different actions for different submission forms).
    .controller('myCtrl', ['$scope', function($scope) {
     $scope.firstName = "john";
     $scope.lastName = "doe";
     }])

    // The '$scope' directive is injected in as a dependency. By mutating the controller's $scope, you can mutate the webpage's view.
    .controller('kanjiListController', ["$scope", function(sc) {
        sc.searchresult = "default";
        sc.searchresultfn = { text: sc.searchresult };
        sc.search = "中";
        sc.output = "init";
        sc.currentRow = [];

        sc.submit = function() {

            $.ajax({
                    url        : "http://127.0.0.1:3000",
                    dataType   : 'json',
                    contentType: 'application/json; charset=UTF-8', // This is the money shot
                    data       : JSON.stringify({
                        "oursearch": this.search
                    }),
                    type       : 'POST' // etc
                })
                .done(function(data, textStatus, jqXHR) {
                    console.log(data); // logs the incoming data as javascript objects
//					console.log(JSON.stringify(data, undefined, "  ")); // serialises the JSON to a string to emerge in Chrome console
                    sc.$apply(function() {
                        //sc.output = JSON.stringify(data, undefined, "  ");
                        sc.output = data.entries[0].hkanji;
                        sc.currentRow = data.entries;
                    });
                })
                .fail(function(jqXHR, textStatus, errorThrown) {
                    console.error(arguments);
                });
        };
    }]);