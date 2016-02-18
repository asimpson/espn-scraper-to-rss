"use strict";

var _sqlite = require("sqlite3");

var _sqlite2 = _interopRequireDefault(_sqlite);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _express = require("express");

var _express2 = _interopRequireDefault(_express);

var _consolidate = require("consolidate");

var _consolidate2 = _interopRequireDefault(_consolidate);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();

var dbFile = _path2.default.join(__dirname, 'LOWE');

app.get('/rss', function (req, res) {
  var db = new _sqlite2.default.Database(dbFile);

  db.all("SELECT * FROM articles ORDER BY rowid DESC", function (err, rows) {
    if (err) {
      console.log(err);
    }

    if (rows) {
      console.log(rows);
      _consolidate2.default.handlebars('rss.hbs', { rows: rows }, function (err, html) {
        if (err) throw err;
        res.set('Content-Type', 'text/xml');
        res.send(html);
      });
    }
  });
});

module.exports = app;
