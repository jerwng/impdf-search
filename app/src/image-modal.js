import React, { useState, useEffect } from "react"

import Modal from 'react-bootstrap/Modal'

import './css/images.css';

function ImageModal(props) {
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (typeof props.selectedPhotoID !== 'undefined') {
      setShow(true)
    }
  }, [props.selectedPhotoID])

  const handleClose = () => {
    setShow(false)
    /*
      Un-select selected photo when modal closes.
      Required to ensure modal re-shows if same photo is re-selected immediately 
      after closing modal.
      */
    props.setSelectedPhotoID(undefined)
  }

  return (
    /* 
    animation={false} to suppress "Warning: findDOMNode is deprecated in StrictMode message.""
    Solution from https://stackoverflow.com/a/64325602 */
    <Modal show={show} onHide={handleClose} animation={false}> 
      <Modal.Header closeButton> Image </Modal.Header>
      <Modal.Body>    
        <img
          className="image-modal"
          src={"data:image/jpeg;base64, ".concat(props.selectedPhoto)} // concat data:image/jpeg;base64, in front of the base64 encoded image to allow for <img> to read the encoded image
          alt=""
        />
      </Modal.Body>
    </Modal>
  )
}

export default ImageModal