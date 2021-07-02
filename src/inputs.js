import React, { useState, useEffect } from 'react';

import Form from "react-bootstrap/Form"
import Button from "react-bootstrap/Button"

import { uapi_post_pdf } from "./utils/api.js";
import './css/inputs.css';

function Inputs() {
  return <div id="inputs-container">
    <UploadPDF />
    <SearchWords />
  </div> 

}

function UploadPDF() {
  const [file, setFile] = useState(undefined)

  const handleSubmit = (e) => {
    e.preventDefault()
    
    const file_form_data = new FormData();
    file_form_data.append('file', file);

    uapi_post_pdf(file_form_data)
  }

  const handleUploadFile = (e) => {
    const uploadedFile = e.target.files[0]
    setFile(uploadedFile)
  }

  const handleDeleteFile = () => {
    setFile(undefined)
  }

  return <Form onSubmit={handleSubmit}>
    <Form.Group id="upload-pdf-file-form-group">
      <h3 className="inputs-label">Upload PDF File</h3>
      <Form.File 
        id="upload-pdf-file" 
        label={file ? file.name : "No File Selected"}
        onChange={handleUploadFile} 
        accept=".pdf" custom
      />
    </Form.Group>
    <div id="upload-pdf-file-button-container">
      <Button
        id="upload-pdf-file-delete-button"
        className="upload-pdf-file-button"
        variant="danger"
        onClick={handleDeleteFile}
      >
        Delete
      </Button>
      <Button
        id="upload-pdf-file-upload-button"
        className="upload-pdf-file-button"
        variant="success"
        type="submit"
      >
        Upload
      </Button>
    </div>
  </Form>
}

function SearchWords() {
  return <Form>
    <Form.Group id="search-words-form-group">
      <h3 className="inputs-label">Search Words</h3>
      <Form.Control id="search-words-input" placeholder="Enter Search Words" />
    </Form.Group>
    <Button id="search-words-button" variant="success">
      Search
    </Button>
  </Form>
}

export default Inputs