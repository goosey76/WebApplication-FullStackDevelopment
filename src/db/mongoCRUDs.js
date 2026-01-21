import { MongoClient, ObjectId } from 'mongodb';

// MongoDB connection configuration
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const DB_NAME = process.env.DB_NAME || 'bekys_aep';

let client;
let db;

/**
 * Connect to MongoDB database
 */
async function connectToDatabase() {
  if (!client) {
    try {
      client = new MongoClient(MONGODB_URI);
      await client.connect();
      db = client.db(DB_NAME);
      console.log('Connected to MongoDB');
    } catch (error) {
      console.error('Failed to connect to MongoDB:', error);
      throw error;
    }
  }
  return db;
}

/**
 * Get database instance
 */
async function getDb() {
  if (!db) {
    await connectToDatabase();
  }
  return db;
}

// ==================== USER OPERATIONS ====================

/**
 * Find all users
 * @returns {Promise<Array>} Array of all users
 */
export async function findAllUsers() {
  try {
    const database = await getDb();
    const users = await database.collection('users').find({}).toArray();
    return users;
  } catch (error) {
    console.error('Error finding all users:', error);
    throw error;
  }
}

/**
 * Find one user by username and password
 * @param {string} username - The username to search for
 * @param {string} password - The password to verify
 * @returns {Promise<Object|null>} User object if found, null otherwise
 */
export async function findOneUser(username, password) {
  try {
    const database = await getDb();
    const user = await database.collection('users').findOne({ 
      username: username, 
      password: password 
    });
    return user;
  } catch (error) {
    console.error('Error finding user:', error);
    throw error;
  }
}

// ==================== LOCATION OPERATIONS ====================

/**
 * Find all locations
 * @returns {Promise<Array>} Array of all locations
 */
export async function findAllLocations() {
  try {
    const database = await getDb();
    const locations = await database.collection('locations').find({}).toArray();
    return locations;
  } catch (error) {
    console.error('Error finding all locations:', error);
    throw error;
  }
}

/**
 * Find one location by ID
 * @param {string} locationId - The ID of the location to find
 * @returns {Promise<Object|null>} Location object if found, null otherwise
 */
export async function findOneLocation(locationId) {
  try {
    // Validate ObjectId format
    if (!ObjectId.isValid(locationId)) {
      return null;
    }
    
    const database = await getDb();
    const location = await database.collection('locations').findOne({ 
      _id: new ObjectId(locationId) 
    });
    return location;
  } catch (error) {
    console.error('Error finding location:', error);
    throw error;
  }
}

/**
 * Add one location
 * @param {Object} locationData - The location data to add
 * @returns {Promise<Object>} The inserted location with its new _id
 */
export async function addOneLocation(locationData) {
  try {
    const database = await getDb();
    const result = await database.collection('locations').insertOne(locationData);
    
    // Return the inserted document with its _id
    return {
      ...locationData,
      _id: result.insertedId
    };
  } catch (error) {
    console.error('Error adding location:', error);
    throw error;
  }
}

/**
 * Update one location
 * @param {string} locationId - The ID of the location to update
 * @param {Object} updatedData - The data to update
 * @returns {Promise<number>} 1 if updated successfully, 0 if not found
 */
export async function updateOneLocation(locationId, updatedData) {
  try {
    // Validate ObjectId format
    if (!ObjectId.isValid(locationId)) {
      return 0;
    }
    
    // Validate that there's data to update
    if (!updatedData || Object.keys(updatedData).length === 0) {
      return 0;
    }
    
    const database = await getDb();
    
    // Remove _id from updatedData if it exists to avoid immutable field error
    const { _id, ...dataToUpdate } = updatedData;
    
    const result = await database.collection('locations').updateOne(
      { _id: new ObjectId(locationId) },
      { $set: dataToUpdate }
    );
    
    return result.matchedCount;
  } catch (error) {
    console.error('Error updating location:', error);
    throw error;
  }
}

/**
 * Delete one location
 * @param {string} locationId - The ID of the location to delete
 * @returns {Promise<number>} 1 if deleted successfully, 0 if not found
 */
export async function deleteOneLocation(locationId) {
  try {
    // Validate ObjectId format
    if (!ObjectId.isValid(locationId)) {
      return 0;
    }
    
    const database = await getDb();
    const result = await database.collection('locations').deleteOne({ 
      _id: new ObjectId(locationId) 
    });
    
    return result.deletedCount;
  } catch (error) {
    console.error('Error deleting location:', error);
    throw error;
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  if (client) {
    await client.close();
    console.log('MongoDB connection closed');
  }
  process.exit(0);
});

export default {
  findAllUsers,
  findOneUser,
  findAllLocations,
  findOneLocation,
  addOneLocation,
  updateOneLocation,
  deleteOneLocation
};
