import { Alert } from "react-bootstrap";

export const StatusMessage = ({ message }: { message: string }) =>
  message ? <Alert variant="danger">{message}</Alert> : null;
