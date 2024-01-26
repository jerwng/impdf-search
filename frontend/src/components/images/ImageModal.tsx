import Modal from "react-bootstrap/Modal";
import styled from "styled-components";

export const ImageModal = ({
  selectedPhotoURL,
  onModalClose,
}: {
  selectedPhotoURL: string | undefined; // data:image/jpeg;base64 format
  onModalClose: () => void;
}) => {
  /**
   * Handler for when the modal is closed.
   */
  const handleClose = () => {
    onModalClose();
  };

  return (
    /* 
    animation={false} to suppress "Warning: findDOMNode is deprecated in StrictMode message.""
    Solution from https://stackoverflow.com/a/64325602 */
    <Modal show={!!selectedPhotoURL} onHide={handleClose} animation={false}>
      <Modal.Header closeButton placeholder="">
        {" "}
        Image{" "}
      </Modal.Header>
      <StyledModalBody>
        <EnlargedImage src={selectedPhotoURL} alt="enlarged" />
      </StyledModalBody>
    </Modal>
  );
};

const StyledModalBody = styled(Modal.Body)`
  display: flex;
  justify-content: center;
`;

const EnlargedImage = styled.img`
  width: 90%;
`;
