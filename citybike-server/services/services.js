const citybikeurl = "http://api.citybik.es/v2/networks/decobike-miami-beach"
const fetch = require("node-fetch")
const miInit = { method: "GET" }


const getBikes = async () => {
  try {
    const dataBikes = await fetch(citybikeurl, miInit)
    if (dataBikes.status !== 200) {
      throw new Error(`Bad request from server ${dataBikes.status}`)
    }
    const dataSuccess = await dataBikes.json();
    return dataSuccess;
  } catch (error) {
    console.error(error)
  }
}

exports.getBikes = getBikes
