const router = require("express").Router()

// root path
router.get("/", (req, res) => {
  res.send("App successfully connected!")
})

module.exports = router
