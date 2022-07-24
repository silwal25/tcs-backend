const mongoose = require("mongoose")
const dotenv = require("dotenv")
dotenv.config()

// Port variable from env
const port = process.env.PORT

// Connecting app to the database
// ! only run the server on successful connection to database
mongoose.connect(
  process.env.DATABASE_URL,
  { useNewUrlParser: true, useUnifiedTopology: true },
  (err, client) => {
    // ! if error, then print it
    if (err) {
      console.log(err)
    } else {
      // if connected successfully
      // import the app from file
      console.log("Successfully connected")
      module.exports = client
      const app = require("./app")
      app.listen(port, () => {
        console.log("backend started successfully")
      })
    }
  }
)
