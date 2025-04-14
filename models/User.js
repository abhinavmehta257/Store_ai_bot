import bcrypt from 'bcryptjs';
import { getCollection } from '../lib/astradb';

const COLLECTION_NAME = 'users';

export const createUser = async ({ name, email, password }) => {
  const collection = await getCollection(COLLECTION_NAME);
  
  // Check if user already exists
  const existingUser = await collection.findOne({ email });
  if (existingUser) {
    throw new Error('User already exists');
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create user with Twilio fields
  const user = {
    id: Date.now().toString(),
    name,
    email,
    password: hashedPassword,
    createdAt: new Date().toISOString(),
    hasTwilioAccount: false,
    twilioAccountSid: null,
    twilioAuthToken: null,
    isFirstLogin: true
  };

  await collection.insertOne(user);
  return user;
};

export const validateUser = async ({ email, password }) => {
  const collection = await getCollection(COLLECTION_NAME);
  
  const user = await collection.findOne({ email });
  if (!user) {
    throw new Error('Invalid credentials');
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    throw new Error('Invalid credentials');
  }

  // Update first login status if needed
  if (user.isFirstLogin) {
    await collection.updateOne(
      { email },
      { $set: { isFirstLogin: false } }
    );
  }

  return user;
};

export const findUserByEmail = async (email) => {
  const collection = await getCollection(COLLECTION_NAME);
  return collection.findOne({ email });
};

export const updateTwilioCredentials = async (email, { accountSid, authToken }) => {
  const collection = await getCollection(COLLECTION_NAME);
  
  await collection.updateOne(
    { email },
    {
      $set: {
        hasTwilioAccount: true,
        twilioAccountSid: accountSid,
        twilioAuthToken: authToken
      }
    }
  );

  return collection.findOne({ email });
};

export const checkTwilioAccount = async (email) => {
  const user = await findUserByEmail(email);
  if (!user) {
    throw new Error('User not found');
  }

  return {
    hasTwilioAccount: user.hasTwilioAccount,
    isFirstLogin: user.isFirstLogin
  };
};
