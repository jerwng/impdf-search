import React from "react"

import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Image from 'react-bootstrap/Image'

import './css/images.css';

function Images(props) {
  return (
    <Row xs="auto"> {
      props.photos.map((photo, index) => {
        let curPhotoWords = ""
        if (props.words.length > 0) {
          /* 
            Join the words array into a string. This is to pickup searchWords input
            with multiple words that are next to each other in the array.

            Ex: props.words: ["good", "morning"] => Join words into string "good morning"
                props.searchWords: "good morning
          */
          curPhotoWords = props.words[index][1].words.join(' ')
        }

        /* 
          Filter images only where searchWords is substring in joined words string
          OR 
          Unfilter all images if empty searchWords
        */
        if (curPhotoWords.includes(props.searchWords) || typeof(props.searchWords) === "undefined") {
          return (
            <Col xs="auto" key={index}>
              <Thumbnail
                photo={photo}
                id={index}
                handleClick={props.handleClick}
              />
            </Col>
          )
        }
      })
    }
    </Row>
  )
}

function Thumbnail(props) {
  const handleClick = () => {
    props.handleClick(props.id)
  }

  return (
    <img
      className="image-thumbnail"
      src={"data:image/jpeg;base64, ".concat(props.photo)} // concat data:image/jpeg;base64, in front of the base64 encoded image to allow for <img> to read the encoded image
      onClick={handleClick}
    />
  )
}

export default Images