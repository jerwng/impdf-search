import React from "react";

import { Upload } from "components/inputs/Upload";
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
  return (
    <div id="inputs-container">
      <Upload
        onSubmit={props.handleUpload}
        onDelete={props.handleDeleteFileServer}
        isLoading={props.loading}
      />
      <SearchWords
        disabled={props.searchDisabled}
        onSearchWords={props.handleSetSearchWords}
      />
    </div>
  );
}

export default Inputs;
