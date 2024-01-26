import { ReactNode } from "react";
import styled from "styled-components";

export const Status = ({ status }: { status: ReactNode }) => {
  return <StatusContainer>{status}</StatusContainer>;
};

const StatusContainer = styled.div`
  position: fixed;
  bottom: 2%;

  /*
    Centers a fixed element
    Solution provided by: https://stackoverflow.com/a/25919090
  */
  left: 50%;
  transform: translate(-50%, 0);
`;
