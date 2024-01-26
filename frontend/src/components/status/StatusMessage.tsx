import { Alert } from "react-bootstrap";

export const StatusMessage = ({ message }: { message: string }) => (
  <Alert variant="danger">{message}</Alert>
);
