import React, { useState, useEffect } from 'react';

import Form from "react-bootstrap/Form"
import Button from "react-bootstrap/Button"

import './css/inputs.css';

function Inputs(props) {
  return <div id="inputs-container">
    <UploadPDF 
      handleUpload={props.handleUpload}
      handleDeleteFileServer={props.handleDeleteFileServer}
      uniqueFileName={props.uniqueFileName}
    />
    <SearchWords 
      handleSetSearchWords={props.handleSetSearchWords}
      uniqueFileName={props.uniqueFileName}
    />
    
  </div>
}

function UploadPDF(props) {
  const [file, setFile] = useState(undefined)
  /* Want to Disable Delete and Upload buttons during loading to prevent 
     bugs or repeated form submittion API calls */
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    /* We know form submittion API call is finished when parent's uniqueFileName 
       is updated */
    setLoading(false)
  }, [props.uniqueFileName])

  const handleSubmit = (e) => {
    e.preventDefault()

    setLoading(true)
    props.handleUpload(file)

  }

  const handleUploadFile = (e) => {
    const uploadedFile = e.target.files[0]
    setFile(uploadedFile)

  }

  const handleDeleteFile = (e) => {
    setFile(undefined)
    props.handleDeleteFileServer()
  }

  const handleMouseEnter = (e) => {
    e.target.style.cursor = 'pointer'
  }

  const handleMouseLeave = (e) => {
    e.target.style.cursor = ''
  }

  let disabled = file && !loading ? false : true

  return <Form onSubmit={handleSubmit}>
    <Form.Group id="upload-pdf-file-form-group">
      <h3 className="inputs-label">Upload PDF File</h3>
      <Form.File 
        id="upload-pdf-file" 
        label={file ? file.name : "No File Selected"}
        onChange={handleUploadFile} 
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        accept=".pdf" custom      
        /*
        key={} needed for handleDeleteFile.
        If not, input will not respond if user uploads file with same name after delete.

        Solution provided by: https://stackoverflow.com/a/55495449
        */
        key={file}
      />
    </Form.Group>
    <div id="upload-pdf-file-button-container">
      <Button
        id="upload-pdf-file-delete-button"
        className="upload-pdf-file-button"
        variant="danger"
        onClick={handleDeleteFile}
        disabled={disabled}
      >
        Delete
      </Button>
      <Button
        id="upload-pdf-file-upload-button"
        className="upload-pdf-file-button"
        variant="success"
        type="submit"
        disabled={disabled}
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

  let disabled = props.uniqueFileName ? false : true

  return <Form onSubmit={handleSubmit}>
    <Form.Group id="search-words-form-group">
      <h3 className="inputs-label">Search Words</h3>
      <Form.Control id="search-words-input" placeholder="Enter Search Words" disabled={disabled}/>
    </Form.Group>
    <Button 
      id="search-words-button" 
      variant="success"
      type="submit"
      disabled={disabled}
    >
      Search
    </Button>
  </Form>
}

export default Inputs