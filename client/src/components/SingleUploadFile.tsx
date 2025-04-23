import React from "react";
import { Button, FormLabel } from "@chakra-ui/react";
import { uploadFileFirebase } from "../utils";
import { useSelector } from "react-redux";
import { userSelector } from "../redux/selector";
import { Notify } from "notiflix/build/notiflix-notify-aio";

export default function SingleUploadFile({ onComplete, label }) {
  const dataUser = useSelector(userSelector);
  const onChangeFile = async (e) => {
    if (!e.target.files || (e.target.files && !e.target.files.length)) {
      Notify.failure("Something went wrong load file!", {
        position: "center-top",
      });
      return;
    }
    let imgFile = e.target.files[0];
    let validFile = ["image/png", "image/jpeg"].includes(imgFile.type);
    if (!validFile) {
      Notify.failure("File includes .png | .jpg !", {
        position: "center-top",
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
