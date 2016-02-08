// npm init [makes package.json]
// npm install express --save
// [creates node_modules folder if necessary, then adds express to node_modules folder;]
//[--save adds the dependency upon 'express' to the package.json]


// npm install [would install everything specified by the package.json, if a package.json were present]

var express = require('express'); // this makes the JS VM look for 'express' in the node_modules folder, upon having it run index.js.
var app = express(); // call the mysterious function that we just stored in the variable 'express'.

// if you browse to the root of the web server (localhost:3000), it'll shout "hello world!".
app.get('/', function(request, response){
   response.send('Hello World!');
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
