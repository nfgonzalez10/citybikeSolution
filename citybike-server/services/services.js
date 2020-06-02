const citybikeurl = "http://api.citybik.es/v2/networks/decobike-miami-beach"
const fetch = require("node-fetch")
const miInit = { method: "GET" }
const cache = require("memory-cache")

const getBikes = async () => {
  try {
    const dataBikes = await fetch(citybikeurl, miInit)
    if (dataBikes.status !== 200) {
      throw new Error(`Bad request from server ${dataBikes.status}`)
    }
    const dataSuccess = await dataBikes.json()
    return dataSuccess
  } catch (error) {
    console.error(error)
  }
}

const saveCacheData = (data) => {
  console.log("saving data", Date.now())
  cache.put(Date.now(), data)
}
const deletDataCache = () => {
  console.log("Delete Cache")
  cache.clear();
}

exports.getBikes = getBikes
exports.saveCacheData = saveCacheData
exports.deletDataCache = deletDataCache
