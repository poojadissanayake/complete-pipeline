const { MongoClient } = require("mongodb");

const uri = "mongodb+srv://admin:sQbQ7UpBocNpW85I@cluster0.c1bcmhv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri);

let db;

async function connectDB() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    db = client.db('cafe_latte');
  } catch (err) {
    console.error('Failed to connect to the database. Error:', err);
    process.exit(1);
  }
}

async function insertFeedback(name, email, review) {
  const fb_collection = db.collection('feedback');
  return await fb_collection.insertOne({ name, email, review });
}

async function getAllFeedback() {
  const fb_collection = db.collection('feedback');
  return await fb_collection.find({}).toArray();
}

module.exports = {
  connectDB,
  insertFeedback,
  getAllFeedback
};
