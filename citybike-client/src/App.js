import React, { Component } from "react"
import socketIOClient from "socket.io-client"
import {
  Map,
  TileLayer,
  Marker,
  Popup,
  CircleMarker,
  Circle,
} from "react-leaflet"
import L from "leaflet"
import SelectHour from "./molecules/SelectHour/SelectHour"
import "./App.css"
import Table from "./molecules/Table/Table"

export const returnTime = new L.Icon({
  iconUrl: "return.png",
  iconRetinaUrl: "return.png",
  iconAnchor: [30, 30],
  iconSize: [30, 30],
})
export const bikeNotAllowedIcon = new L.Icon({
  iconUrl: "bike_not_allowed.png",
  iconRetinaUrl: "bike_not_allowed.png",
  iconAnchor: [30, 30],
  iconSize: [30, 30],
})
export const bikeIcon = new L.Icon({
  iconUrl: "marker-icon-2x.png",
  iconRetinaUrl: "marker-icon-2x.png",
  iconAnchor: [5, 50],
  iconSize: [30, 50],
})

class App extends Component {
  constructor() {
    super()
    this.state = {
      response: false,
      endpoint: "http://127.0.0.1:4001",
      lat: 25.791421,
      lng: -80.148155,
      zoom: 13,
      ciyBikes: [],
      dateNow: 0,
      firstDateHour: 0,
      rangeOfHours: [],
      initialDateSelected: 0,
      finalDateSelected: 0,
      rangeOfDateSelected: [],
      showTable: false,
      isLive: true,
      socket: socketIOClient("http://127.0.0.1:4001"),
      hourSelected: 0,
    }
    this.handleClickFirstDate = this.handleClickFirstDate.bind(this)
    this.handleClickLastDate = this.handleClickLastDate.bind(this)
    this.hadleButton = this.hadleButton.bind(this)
    this.handleClickLoadButton = this.handleClickLoadButton.bind(this)
  }
  componentDidMount() {
    this.state.socket.on("city-bikes", (data) => {
      console.log(`event socked`)
      this.setState({ ciyBikes: data })
      this.setState({ dateNow: Date.now() })
      this.getFirstDateHour()
    })
  }
  getFirstDateHour() {
    fetch(`${this.state.endpoint}/first-registry-date`).then((data) => {
      data.json().then((response) => {
        this.setState({ firstDateHour: response.response })
        this.getArrayOfDates()
      })
    })
  }

  getArrayOfDates() {
    let firstHourDate = Number(this.state.firstDateHour)
    let arrayOfDates = []
    arrayOfDates.push(firstHourDate)
    while (firstHourDate <= Number(this.state.dateNow)) {
      firstHourDate += 300000
      if (firstHourDate < Number(this.state.dateNow)) {
        arrayOfDates.push(firstHourDate)
      }
    }
    this.setState({ rangeOfHours: arrayOfDates, response: true })
  }

  handleClickFirstDate(event) {
    console.log(`firstDate ${event.target.value}`)
    this.setState({
      initialDateSelected: event.target.value,
    })
  }
  handleClickLastDate(event) {
    console.log(`FINAL DATE ${event.target.value}`)
    this.setState({
      finalDateSelected: event.target.value,
    })
  }
  hadleButton(event) {
    if (
      Number(
        this.state.initialDateSelected <= Number(this.state.finalDateSelected)
      )
    ) {
      this.getHistoricalDay()
    } else {
      alert(`Initial Date is posterior than final Date`)
    }
  }
  getHistoricalDay() {
    fetch(
      `${this.state.endpoint}/historical-bikes?initialDate=${this.state.initialDateSelected}&&finalDate=${this.state.finalDateSelected}`
    ).then((value) => {
      value.json().then((dataDate) => {
        console.log(dataDate)
        this.setState({
          rangeOfDateSelected: dataDate.response,
          showTable: true,
        })
        window.scroll(0,200)
      })
    })
  }

  handleClickLoadButton(e) {
    this.setState({ hourSelected: e })
    fetch(`${this.state.endpoint}/get-data-cache?date=${e}`).then((data) => {
      data.json().then((response) => {
        this.setState({ isLive: false })
        this.state.socket.disconnect()
        this.state.socket.close()
        this.setState({ ciyBikes: response.response })
      })
    })
  }
  handleClickGoLive() {
    console.log("go to live")
    this.state.socket.connect()
    this.setState({ isLive: true })
  }
  transformFormaterDate(date) {
    const newDate = new Date(Number(date))
    return `${newDate.getHours()}:${newDate.getMinutes()}`
  }

  render() {
    const position = [this.state.lat, this.state.lng]
    return (
      <div className='map'>
        <h1 className='map__header'> City Bikes in Miami </h1>
        <Map className='map__body' center={position} zoom={this.state.zoom}>
          <TileLayer
            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
          />
          {this.state.ciyBikes.length !== 0 &&
            this.state.ciyBikes.map((element, key) => {
              return (
                <Marker
                  key={key}
                  position={[element.latitude, element.longitude]}
                  icon={
                    this.state.isLive
                      ? element.free_bikes === 0
                        ? bikeNotAllowedIcon
                        : bikeIcon
                      : returnTime
                  }
                >
                  <Popup>
                    <h2>{element.name}</h2>
                    <span>
                      {`Empty slots: ${element.empty_slots}`} <br />
                      {`Free bikes: ${element.free_bikes}`} <br />
                      {this.state.isLive
                        ? `Last update hour: ${new Date(element.timestamp)}`
                        : `You are seeing bikes at: ${new Date(
                            element.timestamp
                          )}`}
                    </span>
                  </Popup>
                </Marker>
              )
            })}
        </Map>
        {!this.state.isLive && (
          <div className='map__message'>
            <h3>{`Available bikes at ${this.transformFormaterDate(
              this.state.hourSelected
            )}`}</h3>
            <h3>{`If you are looking for upgraded data click here!`}</h3>
            <button
              className='map__message--button'
              onClick={(e) => this.handleClickGoLive(e)}
            >
              Go to Live
            </button>
          </div>
        )}
        {this.state.response && (
          <SelectHour
            day={this.state.firstDateHour}
            initialDate={this.state.rangeOfHours}
            finalDate={this.state.rangeOfHours}
            onClickInitialDate={this.handleClickFirstDate}
            onClickLastDate={this.handleClickLastDate}
            onClickButton={this.hadleButton}
          ></SelectHour>
        )}
        {this.state.showTable && (
          <Table
            dates={this.state.rangeOfDateSelected}
            onClickHandle={this.handleClickLoadButton}
          ></Table>
        )}
      </div>
    )
  }
}
export default App
