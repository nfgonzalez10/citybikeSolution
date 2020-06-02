const express = require("express")
const http = require("http")
const socketIo = require("socket.io")

const port = process.env.PORT || 4001
const services = require("./services/services")
const index = require("./routes/index")
const app = express()
let countNumberOfIterations = 0
const dayInMilliseconds = 86400000
const frecuencyToSaveData = 300000
const frecuencyToSendData = 200000
app.use(index)

const server = http.createServer(app)
const io = socketIo(server) // < Interesting!
let dataBikesStation = []
const getServiceBikes = () => {
  countNumberOfIterations++
  services.getBikes().then((dataBikes) => {
    dataBikesStation = []
    dataBikesStation = dataBikes.network.stations
    services.saveCacheData(dataBikes.network.stations)
  })
  if (frecuencyToSaveData * countNumberOfIterations >= dayInMilliseconds) {
    countNumberOfIterations = 0
    services.deletDataCache()
  }
}
getServiceBikes()

io.on("connection", (socket) => {
  var socketId = socket.id
  var clientIp = socket.request.connection.remoteAddress
  console.log("New connection " + socketId + " from " + clientIp)
  io.emit("city-bikes", dataBikesStation)
  setInterval(() => {
    io.emit("city-bikes", dataBikesStation)
  }, frecuencyToSendData)
  setInterval(() => {})
  socket.on("disconnect", () => {
    console.log("Client disconnected")
  })
})

server.listen(port, () => console.log(`Listening on port ${port}`))

setInterval(getServiceBikes, frecuencyToSaveData)
