import SQLite from 'react-native-sqlite-storage';

const db = SQLite.openDatabase({ name: 'TGM_Local.db', location: 'default' });

export const initDatabase = () => {
  db.transaction((tx) => {
    // Core Inspection Table with Milestone 1 Requirements
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS Inspections (
        local_id TEXT PRIMARY KEY, 
        bubble_id TEXT, 
        status TEXT, 
        sync_status TEXT DEFAULT 'pending', 
        last_modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );`
    );
    console.log("Offline Database Initialized [cite: 12, 14]");
  });
};