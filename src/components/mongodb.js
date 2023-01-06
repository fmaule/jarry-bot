const { MongoClient } = require('mongodb');

// LOGGER
const path = require('node:path')
const { initLogger } = require('./logger'); 
const componentName = path.parse(__filename).name
const { log, logError } = initLogger(componentName);

let mongoCollection;

const initMongodb = async ({ mongodb }) => {
  log('∝ initializing component')
  try {
    const client = new MongoClient(mongodb.uri);
    await client.connect();
    const db = await client.db(mongodb.dbName);
    mongoCollection = db.collection(mongodb.collectionName);
    return mongoCollection;
  } catch (e) {
    logError(e);
  }
};

const getAllComments = async id => mongoCollection.find().toArray();
const getComment = async id => mongoCollection.findOne({ _id: id });
const addComment = async (comment) => mongoCollection.insertOne(comment);
const updateComment = async (id, comment) => mongoCollection.updateOne({ _id: id }, { $set: comment }, { upsert: true });
const addCommentReply = async (id, reply) => mongoCollection.updateOne({ _id: id }, { $push: { replies: reply } }, { upsert: true });
const deleteComment = async (id, reply) => mongoCollection.deleteOne({ _id: id })

module.exports = {
  initMongodb,
  getAllComments,
  getComment,
  addComment,
  updateComment,
  addCommentReply,
  deleteComment
};