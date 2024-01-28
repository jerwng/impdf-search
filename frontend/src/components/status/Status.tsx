import styled from "styled-components";
import { StatusSpinner } from "./StatusSpinner";
import { StatusMessage } from "./StatusMessage";

export const Status = ({
  isLoading,
  message,
}: {
  isLoading: boolean;
  message: string | undefined;
}) => {
  return (
    <StatusContainer>
      <StatusSpinner show={isLoading} />
      <StatusMessage message={message} />
    </StatusContainer>
  );
};

const StatusContainer = styled.div`
  position: fixed;
  bottom: 2%;

  display: flex;
  flex-direction: column;
  align-items: center;

  gap: 10px;
  width: 100vw;
`;
