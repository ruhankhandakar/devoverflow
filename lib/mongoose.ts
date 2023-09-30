import mongoose from 'mongoose';

let isConnected: boolean = false;

export const connectToDatabase = async () => {
  mongoose.set('strictQuery', true);

  if (!process.env.MONGODB_URL) {
    return console.error('MISSING MONGODB_URL');
  }

  if (isConnected) {
    return console.log('Mongodb is connected already');
  }

  try {
    await mongoose.connect(process.env.MONGODB_URL, {
      dbName: 'devflow',
    });

    isConnected = true;
    console.log('Mongodb is connected');
  } catch (error) {
    console.error('Mongodb Connection Error', error);
  }
};
