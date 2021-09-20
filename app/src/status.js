import React from 'react';

import Spinner from 'react-bootstrap/Spinner'
import Alert from 'react-bootstrap/Alert'

import "./css/status.css"

function Status(props) {
  let spinner
  if (props.show) {
    spinner = StatusSpinner()
  } 
  else if (typeof(props.message) !== "undefined") {
    spinner = StatusMessage(props.message)
  }

  return (
    <div className="status">
      {spinner}
    </div>
    
  )
}

function StatusSpinner() {
  return (
    <Spinner animation="border"/>
  )
}

function StatusMessage(message) {
  return (
    <Alert variant="danger">
      {message}
    </Alert>
  )
}

export default Status