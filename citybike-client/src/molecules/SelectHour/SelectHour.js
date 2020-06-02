import React, { Component } from "react"
import "./SelectHour.css"

class SelectHour extends Component {
  constructor(props) {
    super(props)
  }
  transformFormaterDateToDay(date) {
    const newDate = new Date(Number(date))
    const today =
      newDate.getDate().toString().length === 2
        ? newDate.getDate()
        : `0${newDate.getDate()}`
    const month =
      newDate.getMonth().toString().length === 2
        ? newDate.getMonth()
        : `0${newDate.getMonth() + 1}`
    return `${today}-${month}-${newDate.getFullYear()}`
  }
  transformFormaterDate(date) {
    const newDate = new Date(Number(date))
    const minutes =
      newDate.getMinutes().toString().length === 2
        ? newDate.getMinutes()
        : `0${newDate.getMinutes()}`
    return `${newDate.getHours()}:${minutes}`
  }
  render() {
    return (
      <div className='selectHour'>
        <h2 className='selectHour__header'>{`Select Hours of ${this.transformFormaterDateToDay(
          this.props.day
        )}`}</h2>
        <div className='selectHour__body'>
          <select onChange={(e) => this.props.onClickInitialDate(e)}>
            <option>Select initial hour</option>
            {this.props.initialDate.map((element, key) => {
              return (
                <option value={element} key={key}>
                  {this.transformFormaterDate(element)}
                </option>
              )
            })}
          </select>
          <h3>to</h3>
          <select onChange={(e) => this.props.onClickLastDate(e)}>
            <option>Select final hour</option>
            {this.props.initialDate.map((element, key) => {
              return (
                <option value={element} key={key}>
                  {this.transformFormaterDate(element)}
                </option>
              )
            })}
          </select>
        </div>
        <button
          className='selectHour__button'
          onClick={this.props.onClickButton}
        >
          Select Hour
        </button>
      </div>
    )
  }
}

export default SelectHour
