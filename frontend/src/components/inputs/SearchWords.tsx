import { MouseEvent } from "react";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { StyledInputHeader } from "./styles";

export const SearchWords = ({
  isDisabled,
  onSearchWords,
}: {
  isDisabled: boolean;
  onSearchWords: (searchWord: string | undefined) => void;
}) => {
  const handleSubmit = (e: MouseEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const formDataInput = formData.get("search-words-input") as string;
    const newSearchWord = formDataInput.length > 0 ? formDataInput : undefined;

    onSearchWords(newSearchWord);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group>
        <StyledInputHeader>Search Words</StyledInputHeader>
        <Form.Control
          name="search-words-input"
          placeholder="Enter Search Words"
          disabled={isDisabled}
        />
      </Form.Group>
      <Button variant="success" type="submit" disabled={isDisabled}>
        Search
      </Button>
    </Form>
  );
};
