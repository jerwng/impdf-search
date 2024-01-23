import React from "react";

import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import "css/images.css";

/**
 * The images component to display the rows of thumbnail sized images.
 *
 * Sub-component for: App
 *
 * @param {String} props.photos The photos converted from the PDF. data:image/jpeg;base64 format.
 * @param {Function} props.handleClick Function for when a image is clicked.
 * @returns The images component to display the rows of thumbnail sized images.
 */
function Images(props) {
  return (
    <Row xs="auto">
      {" "}
      {props.photos.map((photo, index) => {
        return (
          <Col xs="auto" key={index}>
            <Thumbnail
              photo={photo}
              id={index}
              handleClick={props.handleClick}
            />
          </Col>
        );
      })}
    </Row>
  );
}

/**
 * Sub-component for: Images
 *
 * @param {String} props.photos The individual photo converted from the PDF. data:image/jpeg;base64 format.
 * @param {Number} props.id The index of the indivual photo.
 * @returns An <img> element for the individual photo.
 */
function Thumbnail(props) {
  const handleClick = () => {
    props.handleClick(props.id);
  };

  const handleMouseEnter = (e) => {
    e.target.style.cursor = "pointer";
  };

  const handleMouseLeave = (e) => {
    e.target.style.cursor = "";
  };

  return (
    <img
      className="image-thumbnail"
      src={props.photo}
      alt=""
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    />
  );
}

export default Images;
