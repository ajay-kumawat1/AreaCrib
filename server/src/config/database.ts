import { connect } from "mongoose";
import config from "./config";

const opts = {
  useNewUrlParser: true,
  serverSelectionTimeoutMS: 10000,
  autoIndex: config.mongo.autoIndex,
  autoCreate: config.mongo.useCreateIndex,
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
};

const MONGO_URI = config.mongo.url || "";

export const connectDB = async (): Promise<void> => {
  try {
    await connect(MONGO_URI, opts);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1); // Exit process with failure
  }
};

export default connectDB;
