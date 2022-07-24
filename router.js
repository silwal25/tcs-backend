const router = require("express").Router()
const controller = require("./controllers/UserController")

// root path
router.get("/", (req, res) => {
  res.send("App successfully connected!")
})

// User controller
// For functions like login and register
router.post("/register", controller.register)
router.post("/login", controller.login)
router.post("/verify-token", controller.verifyToken)

module.exports = router
