import SQLite from 'react-native-sqlite-storage';
import axios from 'axios';

// Configuration for Bubble.io API Handshake
const BUBBLE_API_BASE = 'https://your-app-name.bubbleapps.io/api/1.1/obj';
const API_TOKEN = 'YOUR_BUBBLE_API_KEY'; // Replace with your actual token

const db = SQLite.openDatabase({ name: 'TGMFieldApp.db', location: 'default' });

export const setupDatabase = () => {
  db.transaction((tx) => {
    // Inspection Table with SyncStatus and LastModified
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS Inspections (
        local_id TEXT PRIMARY KEY, 
        bubble_id TEXT, 
        title TEXT,
        status TEXT, 
        last_modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        sync_status TEXT DEFAULT 'synced' 
      );`
    );
    // Sync Log Table (For Milestone 2 Retry Logic)
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS SyncLog (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        action TEXT,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );`
    );
  });
};

// Morning Data Preload Logic
export const morningPreload = async (userId) => {
  try {
    // 1. API Handshake: Fetch assigned inspections from Bubble.io
    const response = await axios.get(`${BUBBLE_API_BASE}/inspection`, {
      headers: { Authorization: `Bearer ${API_TOKEN}` },
      params: { 
        constraints: JSON.stringify([
          { key: "assigned_to", constraint_type: "equals", value: userId }
        ]) 
      }
    });

    const remoteData = response.data.response.results;

    // 2. ID Mapping & Local Storage
    db.transaction((tx) => {
      remoteData.forEach((item) => {
        tx.executeSql(
          `INSERT OR REPLACE INTO Inspections (local_id, bubble_id, title, status, sync_status) 
           VALUES (?, ?, ?, ?, ?)`,
          [item._id, item._id, item.Name || 'Inspection', item.Status, 'synced']
        );
      });
    });

    return remoteData;
  } catch (error) {
    console.error("Morning Preload Failed:", error);
    throw error;
  }
};