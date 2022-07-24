const express = require("express")
const cors = require("cors")

const app = express()

// Initialize the application

const corsOptions = {
  exposedHeaders: "Authorization"
}
app.use(cors(corsOptions))
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

// Router
app.use("/", require("./router"))

// Exporting app for database
module.exports = app
