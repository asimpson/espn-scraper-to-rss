import sql from "sqlite3";
import path from "path";
import express from "express";
import cons from "consolidate";
const app = express();

const dbFile = path.join(__dirname, 'LOWE');

app.get('/rss', function(req, res) {
  const db = new sql.Database(dbFile);

  db.all("SELECT * FROM articles ORDER BY rowid DESC", (err, rows) => {
    if (err) {
      console.log(err);
    }

    if (rows) {
      cons.handlebars('rss.hbs', {rows: rows}, function(err, html) {
        if (err) throw err;
        res.set('Content-Type', 'text/xml');
        res.send(html);
      });
    }
  });
});

module.exports = app;
