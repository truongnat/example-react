import React from "react";
import { Button, FormLabel, useToast } from "@chakra-ui/react";
import { createToast, uploadFileFirebase } from "../utils";
import { useSelector } from "react-redux";
import { userSelector } from "../redux/selector";

export default function SingleUploadFile({ onComplete, label }) {
  const dataUser = useSelector(userSelector);
  const toast = useToast();
  const onChangeFile = async (e) => {
    if (!e.target.files || (e.target.files && !e.target.files.length)) {
      createToast(toast, {
        title: "Error load file",
        description: "Something went wrong load file!",
        status: "error",
      });
      return;
    }
    let imgFile = e.target.files[0];
    let validFile = ["image/png", "image/jpeg"].includes(imgFile.type);
    if (!validFile) {
      createToast(toast, {
        title: "Valid file",
        description: "File includes .png | .jpg !",
        status: "error",
      });
      return;
    }
    const link = await uploadFileFirebase(dataUser.user._id, imgFile);
    onComplete(link);
  };
  return (
    <div className={"w-full"}>
      <Button as={FormLabel} htmlFor="upload" className="w-full">
        {label}
      </Button>
      <input
        type={"file"}
        id="upload"
        hidden
        onChange={onChangeFile}
        value={""}
      />
    </div>
  );
}
