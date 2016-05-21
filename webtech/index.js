"use strict";

/* npm init [makes package.json]
 * npm install express --save
 * npm install sqlite3 --save
 * npm install body-parser --save
 * [installs the sqlite3 module (confusingly also called sqlite3) and adds it into the package.json as a required install]
 * [creates node_modules folder if necessary, then adds express to node_modules folder;]
 * [--save adds the installed dependency to the package.json as a required install for use by 'npm install'] */


// npm install [would install everything specified by the package.json, if a package.json were present]
var express = require('express') // serves static assets (ie. .html) and answers REST requests eg. POST, PUT, GET.
// , util = require('util')
, bodyParser = require('body-parser') // allows you to parse JSON.
, sqlite3 = require('sqlite3').verbose() // database.
, cors = require('cors') // makes this backend allow frontend traffic (eg. for AJAX requests) from any domain.
, async = require('async') // allows composition of multiple async callbacks into one async callback.
, _ = require('lodash'); // general utility library for doing operations upon collections.

var app = express();
app.use(cors());
app.use(bodyParser.json()); // gives our application support for JSON-formatted PUT or POST requests.
// This app.use line needs to be early in the .js file so that the request.body object gets created.

var db = new sqlite3.Database('dicts.db', sqlite3.OPEN_READONLY);

// sqlite3 nodejs documentation: https://github.com/mapbox/node-sqlite3/wiki/API or https://www.npmjs.com/package/sqlite3
app.post('/', function(request, response){
    console.log(request.body.kanjiglyph);

    async.parallel(
        [
            //hkanjiPageSearch
            function(callback) {
                db.prepare("SELECT page FROM henshall_page WHERE hkanji = (?) LIMIT 1", request.body.kanjiglyph)
                // .get returns a single object, for when only one result is expected.
                // if there are no results, they return 'undefined' and throw an error.
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
                // .all returns an array of objects, for when multiple results may be expected.
                // if there are no results, it just returns an empty array of objects.
                .all(callback);
            },
            //kanjidicDefinitionSearch
            function(callback) {
                db.prepare("SELECT data FROM kanjidic_definition WHERE id = (?)", request.body.kanjiglyph)
                // .all returns an array of objects, for when multiple results may be expected.
                // if there are no results, it just returns an empty array of objects.
                .all(callback);
            },
            //kanjidicFrequencySearch
            function(callback) {
                db.prepare("SELECT data FROM kanjidic_frequency WHERE id = (?) LIMIT 1", request.body.kanjiglyph)
                .get(callback);
            },
            //kanjidicStrokeSearch
            function(callback) {
                db.prepare("SELECT data FROM kanjidic_stroke WHERE id = (?) LIMIT 1", request.body.kanjiglyph)
                .get(callback);
            },
            //kanjidicJlptSearch
            function(callback) {
                db.prepare("SELECT data FROM kanjidic_jlpt WHERE id = (?) LIMIT 1", request.body.kanjiglyph)
                .get(callback);
            },
            //kanjidicGradeSearch
            function(callback) {
                db.prepare("SELECT data FROM kanjidic_grade WHERE id = (?) LIMIT 1", request.body.kanjiglyph)
                .get(callback);
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
                // '|| {}' returns an empty object if the input is not truthy.
                "hkanjiPageSearch": (allResults[0] || {}).page,
                "hkanjiIndexSearch": (allResults[1] || {}).ref,
                "hkanjiCodePointSearch": allResults[2] || {},
                // '|| {}' not needed because an empty array is truthy already.
                // _.map is a lodash function to flatten an array of objects like allResults[3] into one field.
                "kanjidicReadingSearch": _.map(allResults[3], 'data'),
                "kanjidicDefinitionSearch": _.map(allResults[4], 'data'),
                "kanjidicFrequencySearch": (allResults[5] || {}).data,
                "kanjidicStrokeSearch": (allResults[6] || {}).data,
                "kanjidicJlptSearch": (allResults[7] || {}).data,
                "kanjidicGradeSearch": (allResults[8] || {}).data
            });
        }
    );

});


app.use(negotiate);

/* Creates a mapping between your filesystem, and the filesystem you pretend exists.
 * If you ask for the first parameter to be just '', then no extra folder is inserted in front of the 'images' in the URL presented to the user.
 * In this case: We can access file://...site/images/index.html at:
 * http://localhost:3000/index.html
 * Rules that the images folder in site/ needs to be presented in URLs as nothing at all. */
app.use('', express.static('site', { setHeaders: deliverXHTML }));

// Listens continuously on port 3000
app.listen(3000, function (){
   console.log('Server started. Please navigate to localhost:3000 to view website.');
});


// Check whether the browser accepts XHTML, and record it in the response.
function negotiate(req, res, next) {
    var accepts = req.headers.accept.split(",");
    if (accepts.indexOf("application/xhtml+xml") >= 0) res.acceptsXHTML = true;
    next();
}

// Called by express.static.  Delivers response as XHTML when appropriate.
function deliverXHTML(res, path, stat) {
    if (ends(path, '.html') && res.acceptsXHTML) {
        res.header("Content-Type", "application/xhtml+xml");
    }
}

function ends(s, x) { return s.indexOf(x, s.length-x.length) >= 0; }