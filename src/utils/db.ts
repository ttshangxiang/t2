import { MongoClient, Db } from 'mongodb';
import * as fs from 'fs';
import * as path from 'path';

// Connection URL
let url: string;
const filePath = path.resolve(__dirname, '../../../mongodb.txt');
function loadUrl () {
  return fs.readFileSync(filePath).toString('utf-8');
}

type operation = (db: Db) => object | [];
export default async function(operation: operation) {
  !url && (url = loadUrl());
  url = url.replace(/[\s\n\t\r]/g, '');
  const client = await MongoClient.connect(url, { useNewUrlParser: true });
  const arr = url.split('/');
  const db = client.db(arr[arr.length -1]);
  const result = await operation(db);
  if (client) {
    client.close();
  }
  return result;
}
