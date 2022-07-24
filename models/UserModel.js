const mongoose = require("mongoose")
const Joi = require("joi")
const bcrypt = require("bcryptjs")
const bcryptjs = require("bcryptjs")

// Constructor methor for fetching data from request object
let User = function (data) {
  this.data = data
  this.errors = []
}

// User scheme for mongodb
const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    unique: true
  },
  email: {
    type: String,
    unique: true
  },
  password: String,
  secret: {
    first: {
      question: String,
      answer: String
    },
    second: {
      question: String,
      answer: String
    },
    third: {
      question: String,
      answer: String
    }
  }
})

// Joi schema for validation checks
const schema = Joi.object({
  userName: Joi.string().min(6).max(20).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  secret: Joi.object({
    first: Joi.object({
      question: Joi.string(),
      answer: Joi.string()
    }),
    second: Joi.object({
      question: Joi.string(),
      answer: Joi.string()
    }),
    third: Joi.object({
      question: Joi.string(),
      answer: Joi.string()
    })
  })
})

// Mongoose model
const userModel = mongoose.model("User", userSchema)

/**
 * * Register function
 * * Returns a promise that is resolved when the user is registered
 * ? Find a way to send errors for existing email
 */
User.prototype.register = function () {
  return new Promise(async (resolve, reject) => {
    // Reject if already registered
    userModel
      .findOne({ userName: this.data.userName })
      .then(async (user) => {
        // User is found in the database
        // reject
        if (user) {
          // ? find a way to check for email too
          reject("Username already exist")
        } else {
          // User is not found
          // Validate the credentials using Joi schema
          const { error } = schema.validate(this.data)

          // If there are errors, reject
          // else hash the password and insert data in the database
          if (error) {
            reject(error.details[0].message)
          } else {
            // Hashing password
            const salt = bcrypt.genSaltSync(10)
            const hashPassword = await bcrypt.hash(this.data.password, salt)

            // Hashing the secrets
            const secrets = []
            secrets.push(this.data.secret.first.answer.toLowerCase())
            secrets.push(this.data.secret.second.answer.toLowerCase())
            secrets.push(this.data.secret.third.answer.toLowerCase())

            this.data.secret.first.answer = await bcrypt.hash(secrets[0], salt)
            this.data.secret.second.answer = await bcrypt.hash(secrets[1], salt)
            this.data.secret.third.answer = await bcrypt.hash(secrets[2], salt)

            // making user
            const newUser = new userModel({
              userName: this.data.userName,
              email: this.data.email,
              password: hashPassword,
              secret: this.data.secret
            })

            // Saving to the database
            newUser
              .save()
              .then(() => {
                resolve({ status: 200, message: "Saved successfully" })
              })
              .catch((e) => {
                reject("There was an error saving the data: " + e.message)
              })
          }
        }
      })
      .catch(() => {
        // Unexpected response
        reject(err)
      })
  })
}

/**
 * Login function
 * After a successful login, JWT is sent
 */
User.prototype.login = function () {
  return new Promise((resolve, reject) => {
    // First search for the username in the database
    // If found, then proceed to verify the password
    userModel
      .findOne({
        userName: this.data.userName
      })
      .then((user) => {
        if (user) {
          // User if found
          if (bcrypt.compareSync(this.data.password, user.password)) {
            // Password matched, resolve
            resolve({ status: 200, id: user._id })
          } else {
            // Password not matched, reject
            reject({ status: 401, message: "password does not matched" })
          }
        } else {
          // User is not found
          reject({ status: 404, message: "user not found" })
        }
      })
      .catch((err) => {
        reject(err)
      })
  })
}

module.exports = User
