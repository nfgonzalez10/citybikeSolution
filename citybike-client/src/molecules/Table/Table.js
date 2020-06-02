import React, { Component } from "react"
import "./Table.css"

class Table extends Component {
  constructor(props) {
    super(props)
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
      <div className='tableData'>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Load</th>
            </tr>
          </thead>
          <tbody>
            {this.props.dates.map((element, key) => {
              return (
                <tr key={key}>
                  <th>{this.transformFormaterDate(element)}</th>
                  <th>
                    <button
                      onClick={() => this.props.onClickHandle(element)}
                    >{`Load ${this.transformFormaterDate(element)}`}</button>
                  </th>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    )
  }
}

export default Table
