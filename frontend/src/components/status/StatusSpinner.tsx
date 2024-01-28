import { Spinner } from "react-bootstrap";

export const StatusSpinner = ({ show }: { show: boolean }) =>
  show ? <Spinner animation="border" /> : null;
