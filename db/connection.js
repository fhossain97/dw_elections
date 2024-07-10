const mongoose = require("mongoose");

mongoose
  .connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected successfully."))
  .catch((e) => {
    // For testing purposes, I am leaving this console.error in here. For production,  will be more beneficial to do something such as the following: `throw new Error(`Error in connecting to MongoDB: ${e}`)
    console.error(`Error connecting to MongoDB: ${e}`);
  });
