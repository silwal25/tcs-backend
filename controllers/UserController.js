const User = require("../models/UserModel")
const jwt = require("jsonwebtoken")
const dotenv = require("dotenv")
const { request } = require("express")

dotenv.config()

// register route
exports.register = (req, res) => {
  const user = new User(req.body)

  /**
   * * Check if the user is already registered
   * * if already registered, send an error message
   * * if not, register them after authentication
   */

  user
    .register()
    .then((data) => {
      // After request completion
      console.log(data)
      res.send({ data: data })
    })
    .catch((err) => {
      // Unexpected error
      console.log(err)
      res.send(err)
    })
}

// Login route
exports.login = (req, res) => {
  const user = new User(req.body)
  /**
   * * Check if username is in the database or not
   * * if not return with status 404
   * * else process the request
   */
  user
    .login()
    .then((id) => {
      // Username exist
      // generate JWT and send
      const token = jwt.sign({ id: id }, process.env.JWT_SECRET)
      res.send({ auth_token: token, status: 200, message: "successfully loogged in" })
    })
    .catch((err) => {
      // username doesn't exist / unexpected error
      console.log(err)
      res.send(err)
    })
}

exports.verifyToken = (req, res) => {
  const authHeader = req.headers["authorization"]
  const token = authHeader && authHeader.split(" ")[1]
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        res.sendStatus(401)
      } else {
        res.sendStatus(200)
      }
    })
  } else {
    return res.send(err)
  }
}
