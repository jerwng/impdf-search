import { Upload } from "components/inputs/Upload";
import { SearchWords } from "components/inputs/SearchWords";

import styled from "styled-components";

export const Inputs = ({
  onFileSubmit,
  onFileDelete,
  onSearchWords,
  isFileLoading,
  isSearchDisabled,
}: {
  onFileSubmit: (file: File) => void;
  onFileDelete: () => void;
  onSearchWords: (searchWord: string | undefined) => void;
  isFileLoading: boolean;
  isSearchDisabled: boolean;
}) => (
  <InputsContainer>
    <Upload
      onSubmit={onFileSubmit}
      onDelete={onFileDelete}
      isLoading={isFileLoading}
    />
    <SearchWords isDisabled={isSearchDisabled} onSearchWords={onSearchWords} />
  </InputsContainer>
);

const InputsContainer = styled.div`
  margin-top: 5px;
`;
