var sqlite3 = require('sqlite3').verbose();

// Load the db
var db = new sqlite3.Database('database.sqlite', sqlite3.OPEN_READONLY);

// console.log('?');
// console.log('亜');

db.each("SELECT * FROM kanji_dictionary_eng LIMIT 1", function(err, row) {
	if (err) {
		console.error(err);
		return;
	}
	console.log(row);
});