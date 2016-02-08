// npm init [makes package.json]
// npm install express --save
// npm install sqlite3 --save
// [installs the sqlite3 module (confusingly also called sqlite3) and adds it into the package.json as a required install]
// [creates node_modules folder if necessary, then adds express to node_modules folder;]
// [--save adds the installed dependency to the package.json as a required install for use by 'npm install']


// npm install [would install everything specified by the package.json, if a package.json were present]

var express = require('express'); // this makes the JS VM look for 'express' in the node_modules folder, upon having it run index.js.
var app = express(); // call the mysterious function that we just stored in the variable 'express'.

var util = require('util');

var sqlite3 = require('sqlite3').verbose(); // require('sqlite3') is an object with a property, 'verbose()', that is a callable function.
var db = new sqlite3.Database('../databases/dicts.db', sqlite3.OPEN_READONLY); // gets the file pointer for the database.

// if you browse to the root of the web server (localhost:3000), it'll shout "hello world!".
app.get('/', function(request, response){

    db.all("SELECT * FROM henshall_page LIMIT 10", function(err, row){
    //db.each("SELECT * FROM henshall_page LIMIT 10", function(err, row){
        if(err){
            console.error(err);
            return;
        }
        //to write rows into console
        //console.log(row);
        //Note: can only send one request to webpage at a time (not LIMIT 10), so need a way to collect them into one request for display.
        // and can only have one response.send. Originally had response.send(row);
        var data = JSON.stringify(row, null, "\t");
        // formats the data to be sent as code with <pre>
        var formatted = util.format("<pre>%s</pre>", data);
        response.send(formatted);
    });
});


// Listens continuously on port 3000
app.listen(3000, function (){
   console.log('yo');
});

// Creates a mapping between your filesystem, and the filesystem you pretend exists.
// If you ask for the first parameter to be just '', then no extra folder is inserted in front of the 'images' in the URL presented to the user.
// In this case: We can access file://...site/images/index.html at:
// http://localhost:3000/index.html
// Rules that the images folder in site/ needs to be presented in URLs as nothing at all.
app.use('', express.static('images'));
