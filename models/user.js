const mongoose = require('mongoose');
const db = require('../db');
const collectionName = "users";
const modelName = "user";

mongoose.connect(db.uri, { useMongoClient: true });

var userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

module.exports = mongoose.model(modelName, userSchema, collectionName);
