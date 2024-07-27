import * as DBLite from "expo-sqlite";
import { drizzle, ExpoSQLiteDatabase } from "drizzle-orm/expo-sqlite";
import { integer, sqliteTable } from "drizzle-orm/sqlite-core";
import { text } from "drizzle-orm/sqlite-core";

export let kindleNotesDB: DBLite.SQLiteDatabase;
export let drizzleDB: ExpoSQLiteDatabase<Record<string, never>>;

export const DB_TABLES = {
  CLIPPINGS_FILE: "clippingsFile",
  BOOK_HIGHLIGHTS: "bookHighlights",
};
export const DB_NAME = "kindleNotes.db";

export const schema = {
  clippingsFile: sqliteTable(DB_TABLES.CLIPPINGS_FILE, {
    fileContents: text("fileContents"), // TODO: configure this table to contain only 1 entry
  }),
  bookHighlights: sqliteTable(DB_TABLES.BOOK_HIGHLIGHTS, {
    bookTitle: text("bookTitle"),
    highlightedText: text("highlightedText"),
    highlightedType: text("highlightedType", { enum: ["HIGHLIGHT", "NOTE"] }),
    brandNewHighlight: integer("brandNewHighlight", { mode: "boolean" }),
  }),
};

export async function initDB() {
  kindleNotesDB = await DBLite.openDatabaseAsync(DB_NAME);
  drizzleDB = drizzle(kindleNotesDB);
  const [_, error1] = await cRunAsync(
    kindleNotesDB,
    `CREATE TABLE IF NOT EXISTS ${DB_TABLES.CLIPPINGS_FILE} (
        fileContents TEXT NOT NULL
    )`
  );
  const [__, error2] = await cRunAsync(
    kindleNotesDB,
    `CREATE TABLE IF NOT EXISTS ${DB_TABLES.BOOK_HIGHLIGHTS} (
      bookTitle TEXT NOT NULL,
      highlightedText TEXT NOT NULL,
      highlightedType TEXT NOT NULL,
      brandNewHighlight INTEGER
    )`
  );

  const error = error1 || error2;

  return [
    drizzleDB as ExpoSQLiteDatabase<Record<string, never>>,
    error as string,
  ];
}

export async function clearAllTables(verbose = false) {
  for (let [tableName, table] of Object.entries(schema)) {
    try {
      const result = await drizzleDB.delete(table);
      if (verbose) {
        console.log("Deleted table", tableName, "with result", result);
      }
    } catch (e) {
      console.log("Error deleting table:", tableName, "with details:", e);
    }
  }
}

export async function closeDB() {
  await kindleNotesDB.closeAsync();
}

async function cRunAsync(
  db: DBLite.SQLiteDatabase,
  query: string,
  insertVals: Array<any> = []
) {
  if (!db || !query) {
    return [undefined, "DB or query not correct."];
  }

  let result: DBLite.SQLiteRunResult | undefined | unknown[], error: unknown;

  await db.withTransactionAsync(async () => {
    try {
      result = query.includes("SELECT")
        ? await db.getAllAsync(query)
        : await db.runAsync(query, insertVals);
    } catch (e) {
      error = e;
    }
  });

  return [result as DBLite.SQLiteRunResult, error];
}
