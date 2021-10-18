import React, { useState, useEffect } from 'react';

import Form from "react-bootstrap/Form"
import Button from "react-bootstrap/Button"

import './css/inputs.css';

function Inputs(props) {
  const[file, setFile] = useState(undefined)

  const handleSubmit = (e) => {
    e.preventDefault()
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

  return <div id="inputs-container">
    <UploadPDF 
      handleUpload={handleUploadFile}
      handleSubmit={handleSubmit}
      handleDeleteFile={handleDeleteFile}
      loading={props.loading}
      file={file}
    />
    <SearchWords 
      handleSetSearchWords={props.handleSetSearchWords}
      file={file}
      disabled={props.searchDisabled}
    />
    
  </div>
}

function UploadPDF(props) {
  const handleMouseEnter = (e) => {
    e.target.style.cursor = 'pointer'
  }

  const handleMouseLeave = (e) => {
    e.target.style.cursor = ''
  }

  let disabled = props.file && !props.loading ? false : true

  return <Form onSubmit={props.handleSubmit}>
    <Form.Group id="upload-pdf-file-form-group">
      <h3 className="inputs-label">Upload PDF File</h3>
      <Form.File 
        id="upload-pdf-file" 
        label={props.file ? props.file.name : "No File Selected"}
        onChange={props.handleUpload} 
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        accept=".pdf" custom      
        /*
        key={} needed for handleDeleteFile.
        If not, input will not respond if user uploads file with same name after delete.

        Solution provided by: https://stackoverflow.com/a/55495449
        */
        key={props.file}
      />
    </Form.Group>
    <div id="upload-pdf-file-button-container">
      <Button
        id="upload-pdf-file-delete-button"
        className="upload-pdf-file-button"
        variant="danger"
        onClick={props.handleDeleteFile}
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

  // let disabled = !props.file ? false : true

  return <Form onSubmit={handleSubmit}>
    <Form.Group id="search-words-form-group">
      <h3 className="inputs-label">Search Words</h3>
      <Form.Control id="search-words-input" placeholder="Enter Search Words" disabled={props.disabled}/>
    </Form.Group>
    <Button 
      id="search-words-button" 
      variant="success"
      type="submit"
      disabled={props.disabled}
    >
      Search
    </Button>
  </Form>
}

export default Inputs