const mongoose = require("mongoose");
const dotenv = require("dotenv");

// All the bugs that occur in our synchronous code, but are NOT handled anywhere are called Uncaught Exceptions.
process.on("uncaughtException", function (err) {
  console.log("UNCAUGHT EXCEPTION! 💥 Shutting down!......");
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config({ path: "./config.env" });
const app = require("./app");

const DB = process.env.DATABASE.replace("<PASSWORD>", process.env.DATABASE_PASSWORD);

// mongoose
//   .connect(DB, {
//     useNewUrlParser: true,
//     useCreateIndex: true,
//     useFindAndModify: false,
//     useUnifiedTopology: true,
//   })
//   .then(() => console.log("DB Connections successful"));

mongoose.connect(DB).then(() => console.log("DB Connections successful"));

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}....`);
});

// All the bugs that occur in our asynchronous code (i.e., code which results in Promises), but are NOT handled anywhere are called Unhandled Rejections
process.on("unhandledRejection", function (err) {
  console.log("UNHANDLED REJECTION! 💥 Shutting down!......");
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
