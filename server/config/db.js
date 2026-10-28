import mongoose from 'mongoose';

const DEFAULT_URI = 'mongodb://127.0.0.1:27017/mentorsphere';

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || DEFAULT_URI;

  mongoose.connection.on('disconnected', () =>
    console.error('⚠️  MongoDB disconnected. Database requests will return 503 until it reconnects.')
  );
  mongoose.connection.on('reconnected', () =>
    console.log('✅ MongoDB reconnected.')
  );
  mongoose.connection.on('error', (err) =>
    console.error('❌ MongoDB error:', err.message)
  );

  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 8000 });
    console.log('✅ MongoDB Connected Successfully!');
  } catch (err) {
    // Never print the URI: it may contain credentials.
    console.error('❌ MongoDB Connection Failed:', err.message);
    process.exit(1);
  }
};

export default connectDB;
