const fs = require("fs");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Tour = require("../../models/tourModel");
const User = require("../../models/userModel");
const Review = require("../../models/reviewModel");

dotenv.config({ path: "./config.env" });

const DB = process.env.DATABASE.replace("<PASSWORD>", process.env.DATABASE_PASSWORD);

mongoose.connect(DB).then(() => console.log("DB Connections successful"));

// READ JSON FILE
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, "utf-8"));
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, "utf-8"));
const reviews = JSON.parse(fs.readFileSync(`${__dirname}/reviews.json`, "utf-8"));

// IMPORT DATA INTO DATABASE(COLLECTION)
const importData = async function () {
  try {
    await Tour.create(tours);
    await User.create(users, { validateBeforeSave: false });
    await Review.create(reviews);

    console.log("Data successfully loaded into collection!");
  } catch (err) {
    console.log(err);
  } finally {
    process.exit();
  }
};

// DELETE ALL DATA FROM COLLECTION
const deleteData = async function () {
  try {
    await Tour.deleteMany();
    await User.deleteMany();
    await Review.deleteMany();

    console.log("Data successfully deleted from collection!");
  } catch (err) {
    console.log(err);
  } finally {
    process.exit();
  }
};

// console.log(process.argv);

// UPLOADING OR DELETING DATA FROM DATABASE DEPENDING UPON COMMAND LINE ARGUMENTS
if (process.argv.at(2) === "--import") importData();
else if (process.argv.at(2) === "--delete") deleteData();

// COMMAND TO RUN THIS SCRIPT: node ./dev-data/data/import-dev-data.js <FLAG: --import | --delete>
