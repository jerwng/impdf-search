import React from "react"

import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

import './css/images.css';

function Images(props) {
  return (
    <Row xs="auto"> {
      props.photos.map((photo, index) => {
        return (
          <Col xs="auto" key={index}>
            <Thumbnail
              photo={photo}
              id={index}
              handleClick={props.handleClick}
            />
          </Col>
        )
      })
    }
    </Row>
  )
}

function Thumbnail(props) {
  const handleClick = () => {
    props.handleClick(props.id)
  }

  const handleMouseEnter = (e) => {
    e.target.style.cursor = 'pointer'
  }

  const handleMouseLeave = (e) => {
    e.target.style.cursor = ''
  }

  return (
    <img
      className="image-thumbnail"
      src={"data:image/jpeg;base64, ".concat(props.photo)} // concat data:image/jpeg;base64, in front of the base64 encoded image to allow for <img> to read the encoded image
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    />
  )
}

export default Images