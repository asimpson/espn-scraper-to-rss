import sql from "sqlite3";
import path from "path";

const dbFile = path.join(__dirname, '../LOWE');

const save = (article) => {
  const db = new sql.Database(dbFile);

  db.run("INSERT INTO articles VALUES($id, $date, $title, $url, $description)", {
    $id: article.id,
    $date: article.date,
    $title: article.title,
    $url: article.url,
    $description: article.description
  }, function(err) {
    if (err != null) {
      console.log('sqlite error: ', err);
    }
  });
}

const check = (article) => {
  const db = new sql.Database(dbFile);

  db.get("SELECT id FROM articles ORDER BY rowid DESC", (err, rows) => {
    if (err) {
      console.log(err);
    }

    if (rows) {
      if (article.id !== rows.id) {
        save(article)
      }
    }
  });

  db.close();
}

export { check };
