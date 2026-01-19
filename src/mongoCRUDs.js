import { MongoClient, ObjectId } from "mongodb";

// Replace db_user, db_pass, db_name, db_collection
const db_user = 'beky_kyanh';
const db_pass = 'Px2FFPjRz';
const db_name = 'beky';
const db_collection = 'users';
const dbHostname = "mongodb1.f4.htw-berlin.de"
const dbPort = 27017
const uri = `mongodb://${db_user}:${db_pass}@${dbHostname}:${dbPort}/${db_name}`;

export const findOneUser  = async function(uNameIn, passwdIn) {
  const client = new MongoClient(uri);
  console.log ("DB: " + uNameIn + "," + passwdIn);
  try {
    const database = client.db(db_name);
    const users = database.collection(db_collection);
    const query = {username: uNameIn, password: passwdIn};
    const doc = await users.findOne(query);
    if (doc) {
      delete doc.password;
    }
    return doc;
  } finally {
    // Ensures that the client will close when finished and on error
    await client.close();
  }
};

export const findAllUsers  = async function() {
  const client = new MongoClient(uri);
  try {  
    const database = client.db(db_name);
    const users = database.collection(db_collection);
    const query = {};
    const cursor = users.find(query);
    // Print a message if no documents were found
    if ((await users.countDocuments(query)) === 0) {
      console.log("No documents found!");
      return null;
    }
    let docs = new Array();
    for await (const doc of cursor) {
      delete doc.password;
      docs.push(doc);
    }
    return docs;
  } finally {
    // Ensures that the client will close when finished and on error
    await client.close();
  }
};

export const findAllLocations = async function() {
  const client = new MongoClient(uri);
  try {
    const database = client.db(db_name);
    const locations = database.collection('locs');
    const query = {};
    const cursor = locations.find(query);

    if ((await locations.countDocuments(query)) === 0) {
      console.log("Keine Locations gefunden!");
      return null;
    }

    let docs = new Array();
    for await (const doc of cursor) {
      docs.push(doc);
    }
    return docs;
  } finally {
    await client.close();
  }
};

// Finde eine location
export const findOneLocation = async function(id) {
  const client = new MongoClient(uri);
  try {
    const database = client.db(db_name);
    const locations = database.collection('locs');
    const query = { _id: new ObjectId(id) }; // Filtert nach der gesuchten Id
    const doc = await locations.findOne(query);
    return doc;
  } finally {
    await client.close();
  }
};

// Loescht eine location
export const deleteOneLocation = async function(id) {
  const client = new MongoClient(uri);
  try {
    const database = client.db(db_name);
    const locations = database.collection('locs');
    const query = { _id: new ObjectId(id) }; // Filtert nach der gesuchten Id
    const doc = await locations.deleteOne(query);
    return doc;
  } finally {
    await client.close();
  }
};

/**  
* Fuegt eine Location dazu mit ihren Daten und gibt die Id zurück
*/
export const addOneLocation = async function(locationData) {
  const client = new MongoClient(uri);
  try {
    const database = client.db(db_name);
    const locations = database.collection('locs');
    const result = await locations.insertOne(locationData); // Fügt die Location hinzu
    return result.insertedId;  // gibt die Id von der zugefuegten Location zurück 
  } finally {
    await client.close();
  }
}

/**
 * Update this Location
 * @param {Object} id - The ID of the
 * location to update.
 * @param {Object} updatedData 
 * @returns {Object} Die Zahl der geänderten Dokumenten
 */

export const updateOneLocation = async function(id, updatedData) {
  const client = new MongoClient(uri);
  try {
    const database = client.db(db_name);
    const locations = database.collection('locs');

    // Entferne _id von updateData von der ID -wegen mög. Konflikten
    delete updatedData._id;

    const result = await locations.updateOne(
      { _id: new ObjectId(id) },  // Konvertiert die  Object Id
      { $set: updatedData } // Update mit neuer data
    );

    return result.modifiedCount; // Resultiert mit einer 1 wenn etwas geupdated wurde oder 0, für nichts/
} finally {
    await client.close();
  }
}
