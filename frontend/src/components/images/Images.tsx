import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import { Thumbnail } from "components/images/Thumbnail";

export const Images = ({
  photos,
  onClick,
}: {
  photos: string[];
  onClick: (id: number) => void;
}) => {
  return (
    <Row>
      {" "}
      {photos.map((photo, index) => (
        <Col xs="auto" key={index}>
          <Thumbnail photo={photo} id={index} onClick={onClick} />
        </Col>
      ))}
    </Row>
  );
};
