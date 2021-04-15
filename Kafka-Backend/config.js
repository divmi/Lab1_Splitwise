let mongoose = require("mongoose");

const connectionString =
  "mongodb+srv://divmi:splitwise@cluster0.wkrel.mongodb.net/SplitwiseDB?retryWrites=true&w=majority";
class Database {
  constructor() {
    this._connect();
  }

  _connect() {
    mongoose
      .connect(connectionString, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        poolSize: 500,
        bufferMaxEntries: 0
      })
      .then(() => {
        console.log("Database connection successful");
      })
      .catch(err => {
        console.error("Database connection error");
      });
  }
}

module.exports = new Database();
