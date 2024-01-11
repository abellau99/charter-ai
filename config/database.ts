/* This is a database connection function*/
import mongoose from "mongoose";

const connection = { isConnected: null } as {
  isConnected: any;
}; /* creating connection object*/

if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

const uri = process.env.MONGODB_URI;

async function dbConnect() {
  /* check if we have connection to our databse*/
  if (connection.isConnected) {
    return;
  }

  /* connecting to our database */
  const db = await mongoose.connect(uri);

  connection.isConnected = db.connections[0].readyState;
}

export default dbConnect;
