const mongoose = require("mongoose");

async function dbConnect() {
  try {
    const conn = await mongoose.connect(process.env.DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    if (conn) {
      console.log(`Database connected successfully on:${conn.connection.host}`);
    } else {
      throw new Error("Database connection failed!");
    }
  } catch (error) {
    console.log(error.message);
  }
}

module.exports = dbConnect;
