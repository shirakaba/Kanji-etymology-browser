Username:
jb15339
wk13290

SETUP
1) navigate to the 'container' folder and run the command 'npm install'.
2) run the command 'node index.js'. (Note: no filesystem security placed on index.js yet).
3) open a browser at the URL: http://localhost:3000/html/newstart.html
4) search any single Japanese character (ie. the already-entered character), or:
Cool words: 和　麺　霽　嬲　熏　愛　爽　漢　
Computer science words: 数　算　機

FEATURES
- This is a Japanese character dictionary website.
- It sources data from an Sqlite database (dicts.db) using the 'Sqlite3' module.
  Some characters lack certain data (ie. frequency and extra information).
- The page auto-updates using AngularJS; there is no refreshing needed.
- We used the Bootstrap library to control content flow with respect to screen size,
  with overrides to our taste.
- Database queries are performed in parallel rather than sequentially, via the 'async'
  module.
- Several technologies are used for text parsing: 'lodash', 'bodyparser'
- Most of the focus has been on back-end, so the website doesn't have much variety yet.
