import { useState } from "react";

export const useStatus = () => {
  const [isStatusLoading, setIsStatusLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string>("");

  const handleSetStatusMessage = ({ message }: { message: string }) => {
    setStatusMessage(message);
  };

  const handleClearStatusMessage = () => {
    setStatusMessage("");
  };

  const handleSetIsStatusLoading = () => {
    setIsStatusLoading(true);
  };

  const handleClearIsStatusLoading = () => {
    setIsStatusLoading(false);
  };

  return {
    isStatusLoading,
    statusMessage,
    handleSetStatusMessage,
    handleClearStatusMessage,
    handleSetIsStatusLoading,
    handleClearIsStatusLoading,
  };
};
