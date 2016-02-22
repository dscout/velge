import React, { Component } from 'react'
import Velge from 'velge'

class VelgeComponent extends Component {
  componentDidMount() {
    this.velge = new Velge(this.container, {
      choices: [
        { name: 'macintosh' },
        { name: 'cortland' }
      ],
      chosen: [
        { name: 'jonagold' },
        { name: 'snow sweet' }
      ]
    })
  }

  render() {
    return (
      <div className="velge-container" ref={ (ref) => this.container = ref } />
    )
  }
}

export default VelgeComponent
