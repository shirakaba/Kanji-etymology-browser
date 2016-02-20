/* npm init [makes package.json]
 * npm install express --save
 * npm install sqlite3 --save
 * npm install body-parser --save
 * [installs the sqlite3 module (confusingly also called sqlite3) and adds it into the package.json as a required install]
 * [creates node_modules folder if necessary, then adds express to node_modules folder;]
 * [--save adds the installed dependency to the package.json as a required install for use by 'npm install'] */


// npm install [would install everything specified by the package.json, if a package.json were present]
var util = require('util') // a part of node or npm.
, express = require('express') // this makes the JS VM look for 'express' in the node_modules folder, upon having it run index.js.
, bodyParser = require('body-parser')
, sqlite3 = require('sqlite3').verbose() // require('sqlite3') is an object with a property, 'verbose()', that is a callable function.
, cors = require('cors')
, Promise = require('bluebird')
, async = require('async')
, _ = require('lodash');

var app = express(); // call the mysterious function that we just stored in the variable 'express'.

app.use(cors());
app.use(bodyParser.json()); // gives our application support for JSON-formatted PUT or POST requests.
// This app.use line needs to be early in the .js file so that the request.body object gets created.

var db = new sqlite3.Database('../databases/dicts.db', sqlite3.OPEN_READONLY); // gets the file pointer for the database.

// if you browse to the root of the web server (localhost:3000), it'll shout "hello world!".
// **app.get describes what the user will see (what response is made) when visiting a specified URL.**

//app.get('/', function(request, response){
//    db.all("SELECT * FROM henshall_page LIMIT 10", function(err, entries){
//    //db.each("SELECT * FROM henshall_page LIMIT 10", function(err, entries){
//        if(err){
//            console.error(err);
//            return;
//        }
//        /* to write rows into console
//         * console.log(entries);
//         * Note: can only send one request to webpage at a time (not LIMIT 10), so need a way to collect them into one
//         * request for display.
//         *  and can only have one response.send. Originally had response.send(entries);
//         * var data = JSON.stringify(entries, null, "\t");
//         *  formats the data to be sent as code with <pre>
//         * var formatted = util.format("<pre>%s</pre>", data);
//         * response.send(formatted);
//
//         * response.setHeader('Content-Type', 'application/json'); */
//        response.json(entries);
//    });
//});

// Good tutorial if we ditch the HTML button: https://scotch.io/tutorials/use-expressjs-to-get-url-and-post-parameters
// Creating and handling from start to finish: http://www.sitepoint.com/creating-and-handling-forms-in-node-js/
/*app.get('/html/kanjisearch', function(request, response){
        db.each("SELECT * FROM henshall_page LIMIT 10", function(err, entries){
            if(err){
                console.error(err);
                return;
            }
            response.json(entries);
        });
});*/


// mysql not imported. Ref: http://www.hacksparrow.com/using-mysql-with-node-js.html
// sqlite3 nodejs documentation: https://github.com/mapbox/node-sqlite3/wiki/API or https://www.npmjs.com/package/sqlite3

// Following this guide: www.expressjs.com/en/guide/routing.html
app.post('/', function(request, response){
	console.log(request.body.kanjiglyph);

    async.parallel(
        [
            //hkanjiPageSearch
            function(callback) {
                db.prepare("SELECT page FROM henshall_page WHERE hkanji = (?) LIMIT 1", request.body.kanjiglyph)
                //.get returns a single object, for when only one result is expected.
                .get(callback);
            },
            //hkanjiIndexSearch
            function(callback) {
                db.prepare("SELECT ref FROM henshall_ref WHERE hkanji = (?) LIMIT 1", request.body.kanjiglyph)
                .get(callback);
            },
            //hkanjiCodePointSearch
            function(callback) {
                db.prepare("SELECT jis,unicode FROM henshall_codepoint WHERE hkanji = (?) LIMIT 1", request.body.kanjiglyph)
                .get(callback);
            },
            //kanjidicReadingSearch
            function(callback) {
                db.prepare("SELECT data FROM kanjidic_reading WHERE id = (?)", request.body.kanjiglyph)
                //.all returns an array of objects, for when multiple results may be expected.
                .all(callback);
            }
        ],
        function(errs, allResults) {
            if(errs){
                console.error(err);
                return;
            }

            console.log(allResults[0]);
            console.log(allResults[1]);
            console.log(allResults[2]);

            // allResults is an array holding an object (or array of objects) for each function performed.
            response.json({
                "receivedsearch": request.body.kanjiglyph,
                "hkanjiPageSearch": (allResults[0] || {}).page,
                "hkanjiIndexSearch": (allResults[1] || {}).ref,
                "hkanjiCodePointSearch": allResults[2] || {},
                "kanjidicReadingSearch": _.map(allResults[3], 'data')
            });
        }
    );



    //db.prepare("SELECT * FROM henshall_page WHERE hkanji = (?) LIMIT 10", request.body.kanjiglyph)
	////db.prepare("SELECT * FROM henshall_page LIMIT 10")
	//.all(function(err, results2){
     //   //db.each("SELECT " + "\"request.body.kanjiglyph\"" + "FROM henshall_page LIMIT 10", function(err, row){
     //       if(err){
     //           console.error(err);
     //           return;
     //       }
    //
     //       response.json({
   	//			"receivedsearch": request.body.kanjiglyph, "entries":results2
   	//		});
     //   });
});


// Listens continuously on port 3000
app.listen(3000, function (){
   console.log('yo');
});

/* Creates a mapping between your filesystem, and the filesystem you pretend exists.
 * If you ask for the first parameter to be just '', then no extra folder is inserted in front of the 'images' in the URL presented to the user.
 * In this case: We can access file://...site/images/index.html at:
 * http://localhost:3000/index.html
 * Rules that the images folder in site/ needs to be presented in URLs as nothing at all. */
app.use('', express.static('resources'));
