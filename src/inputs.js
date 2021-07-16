import React, { useState, useEffect } from 'react';

import Form from "react-bootstrap/Form"
import Button from "react-bootstrap/Button"

import { uapi_post_pdf } from "./utils/api.js";
import './css/inputs.css';

function Inputs(props) {
  return <div id="inputs-container">
    <UploadPDF handleUpload={props.handleUpload}/>
    <SearchWords handleSetSearchWords={props.handleSetSearchWords}/>
    
  </div>
}

function UploadPDF(props) {
  const [file, setFile] = useState(undefined)

  const handleSubmit = (e) => {
    e.preventDefault()
    
    props.handleUpload(file)
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

function SearchWords(props) {
  const handleSubmit = (e) => {
    e.preventDefault()
  
    let newSearchWord = undefined
    /* e.target[0].value contains the search word value in the input */
    if (e.target[0].value !== "") {
      newSearchWord = e.target[0].value
    }

    props.handleSetSearchWords(newSearchWord)
  }

  return <Form onSubmit={handleSubmit}>
    <Form.Group id="search-words-form-group">
      <h3 className="inputs-label">Search Words</h3>
      <Form.Control id="search-words-input" placeholder="Enter Search Words" />
    </Form.Group>
    <Button 
      id="search-words-button" 
      variant="success"
      type="submit"
    >
      Search
    </Button>
  </Form>
}

export default Inputs