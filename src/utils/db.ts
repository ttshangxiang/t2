import { MongoClient, Db } from 'mongodb';
import * as fs from 'fs';
import * as path from 'path';

// Connection URL
let url: string;
const filePath = path.resolve(__dirname, '../../../mongodb.txt');
function loadUrl () {
  try {
    return fs.readFileSync(filePath).toString('utf-8');
  } catch (error) {
    console.log(error);
  }
}
// Database name
const dbName = 'ttsx';

type operation = (db: Db) => object | [];
export default async function(operation: operation) {
  !url && (url = loadUrl());
  const client = await MongoClient.connect(url, { useNewUrlParser: true });
  const db = client.db(dbName);
  const result = await operation(db);
  if (client) {
    client.close();
  }
  return result;
}
