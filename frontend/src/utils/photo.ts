// Utils file for submitting and deleting photo

import { uapi_delete } from "./api";

export const uphoto_handleDelete = ({ fileID }: { fileID: string }) => {
  uapi_delete({
    fileID,
  });
};
