const express = require("express")
const router = express.Router()
const services = require("../services/services")
const cache = require("memory-cache")
router.get("/", (req, res) => {
  res.send({ response: "I am alive" }).status(200)
  setInterval(() => {
    const bikes = services.getBikes()
    bikes.then((dataBikes) => {
      console.log(dataBikes.network.stations)
      cache.put(Date.now(), dataBikes.network.stations)
    })
  }, 3000)
})

router.get("/historical-bikes", (req, res) => {
  const intialDate = req.query.initialDate
  const finalDate = req.query.finalDate
  const getKeysCache = cache.keys()
  let rangeOfDate = []
  let stationsBikePerDate = []
  if (cache.size() !== 0 && getKeysCache.length !== 0) {
    rangeOfDate = getKeysCache.filter((data) => {
      return data >= intialDate && data <= finalDate
    })
    rangeOfDate.forEach(dateSelected => {
      stationsBikePerDate.push(cache.get(dateSelected));
    })
    res.send({ response: stationsBikePerDate }).status(200)
  }
})
module.exports = router
