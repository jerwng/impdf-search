import React, { useState, useEffect } from "react";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

import { SearchWords } from "components/inputs/SearchWords";

import "css/inputs.css";

/**
 * Sub-component for: App
 *
 * @param {Function} props.handleUpload Handler to submit the uploaded file to server.
 * @param {Function} props.handleSetSearchWords Handler to submit the search words.
 * @param {Function} props.handleDeleteFileServer Handler to delete the uploaded file.
 * @param {Boolean} props.loading Boolean to indicate if server is processing the request.
 * @param {Boolean} props.searchDisabled Boolean to indicate if there are photos available to search.
 *
 * @returns The input component of the web app.
 */
function Inputs(props) {
  const [file, setFile] = useState(undefined);

  /**
   * Handler to submit the uploaded file to server.
   * @param {Event} e Event for the submit event.
   */
  const handleSubmit = (e) => {
    // prevent refresh after submit.
    e.preventDefault();
    props.handleUpload(file);
  };

  /**
   * Handler to submit the search words.
   * @param {Event} e Event for the upload event.
   */
  const handleUploadFile = (e) => {
    const uploadedFile = e.target.files[0];
    setFile(uploadedFile);
  };

  /**
   * Handler to delete the uploaded file.
   */
  const handleDeleteFile = () => {
    setFile(undefined);
    props.handleDeleteFileServer();
  };

  return (
    <div id="inputs-container">
      <UploadPDF
        handleUpload={handleUploadFile}
        handleSubmit={handleSubmit}
        handleDeleteFile={handleDeleteFile}
        loading={props.loading}
        file={file}
      />
      <SearchWords
        disabled={props.searchDisabled}
        onSearchWords={props.handleSetSearchWords}
      />
    </div>
  );
}

/**
 * Sub-component for: Inputs
 *
 * @param {Function} props.handleUpload Handler to let user select the file to upload.
 * @param {Function} props.handleSubmit Handler to submit the selected file.
 * @param {Function} props.handleDeleteFile Handler to delete the uploaded file.
 * @param {Boolean} props.loading Boolean to indicate if server is processing the request.
 * @param {File} props.file The selected file submitted for OCR.
 *
 * @returns The component to let user select PDF files to upload.
 */
function UploadPDF(props) {
  const handleMouseEnter = (e) => {
    e.target.style.cursor = "pointer";
  };

  const handleMouseLeave = (e) => {
    e.target.style.cursor = "";
  };

  // disable upload if no file is selected or another file is processing
  let disabled = props.file && !props.loading ? false : true;

  return (
    <Form onSubmit={props.handleSubmit}>
      <Form.Group id="upload-pdf-file-form-group">
        <h3 className="inputs-label">Upload PDF File</h3>
        <Form.File
          id="upload-pdf-file"
          label={props.file ? props.file.name : "No File Selected"}
          onChange={props.handleUpload}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          accept=".pdf"
          custom
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
  );
}

export default Inputs;
