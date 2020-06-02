const express = require("express")
const router = express.Router()
const services = require("../services/services")
const cache = require("memory-cache")
const server = require("../server")

// router.get("/", (req, res) => {
//   res.send({ response: "ok" }).status(200)
//   server.socketConnection();
// })

router.get("/historical-bikes", (req, res) => {
  res.header("Access-Control-Allow-Origin", "*")
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  )
  const intialDate = req.query.initialDate
  const finalDate = req.query.finalDate
  const getKeysCache = cache.keys()
  let rangeOfDate = []
  let stationsBikePerDate = []
  if (cache.size() !== 0 && getKeysCache.length !== 0) {
    rangeOfDate = getKeysCache.filter((data) => {
      return data >= intialDate && data <= finalDate
    })
    rangeOfDate.forEach((dateSelected) => {
      stationsBikePerDate.push(cache.get(dateSelected))
    })
    res.send({ response: rangeOfDate }).status(200)
  }
})

router.get("/get-data-cache", (req, res) => {
  res.header("Access-Control-Allow-Origin", "*")
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  )
  const date = req.query.date
  res.send({ response: cache.get(date) }).status(200)
})

router.get("/first-registry-date", (req, res) => {
  res.header("Access-Control-Allow-Origin", "*")
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  )

  const getFirstCacheRegistry = cache.keys()[0]
  res.send({ response: getFirstCacheRegistry }).status(200)
})
module.exports = router
