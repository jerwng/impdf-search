import { ChangeEvent, FormEvent, useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { StyledInputHeader } from "./styles";
import styled from "styled-components";

export const Upload = ({
  onSubmit,
  onDelete,
  isLoading,
}: {
  onSubmit: (file: File) => void;
  onDelete: () => void;
  isLoading: boolean;
}) => {
  const [file, setFile] = useState<File | undefined>(undefined);

  // Disable upload if no file is selected or another file is processing
  const disabled = !file || isLoading ? true : false;

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    // prevent refresh after submit.
    e.preventDefault();
    if (disabled) return;

    onSubmit(file as File);
  };

  const handleSetFile = (e: ChangeEvent<HTMLFormElement>) => {
    const uploadedFile = e.target.files[0] as File;
    setFile(uploadedFile);
  };

  const handleDeleteFile = () => {
    setFile(undefined);
    onDelete();
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group>
        <StyledInputHeader>Upload PDF File</StyledInputHeader>
        <StyledFormFile
          label={file ? file.name : "No File Selected"}
          onChange={handleSetFile}
          accept=".pdf"
          custom
          /*
        key={} needed for handleDeleteFile.
        If not, input will not respond if user uploads file with same name after delete.

        Solution provided by: https://stackoverflow.com/a/55495449
        */
          key={file?.name}
        />
      </Form.Group>
      <ButtonContainer>
        <Button variant="danger" onClick={handleDeleteFile} disabled={disabled}>
          Delete
        </Button>
        <Button variant="success" type="submit" disabled={disabled}>
          Upload
        </Button>
      </ButtonContainer>
    </Form>
  );
};

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
`;

const StyledFormFile = styled(Form.File)`
  input {
    cursor: pointer;
  }
`;
