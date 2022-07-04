// @ts-ignore
import sqlite3 from "sqlite3";

const DBSOURCE = "db.sqlite";

const db = new sqlite3.Database(DBSOURCE, (err: Error) => {
  if (err) {
    // Cannot open database
    console.error(err.message);
    throw err;
  } else {
    db.run(
      `CREATE TABLE history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            number1 float, 
            number2 float, 
            result float
            )`,
      (err: Error) => {
        if (err) {
          // Table already created
        }
      }
    );
    console.log("Connected to the SQLite database.");
  }
});

export default db;
