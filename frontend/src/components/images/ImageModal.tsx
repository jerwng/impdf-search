import Modal from "react-bootstrap/Modal";
import "css/images.css";

function ImageModal({
  selectedPhotoURL,
  onModalClose,
}: {
  selectedPhotoURL: string; // data:image/jpeg;base64 format
  onModalClose: () => void;
}) {
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
      <Modal.Body>
        <img className="image-modal" src={selectedPhotoURL} alt="enlarged" />
      </Modal.Body>
    </Modal>
  );
}

export default ImageModal;
