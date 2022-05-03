import React from "react";
import { Select, Button, useToast, Textarea } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { STATUS_TODO } from "../../constants";
import { ControlInput } from "../../components";
import { useSelector, useDispatch } from "react-redux";
import { todoSelector } from "../../redux/selector";
import { UPDATE_TODO, genericAction, ENUM_STATUS } from "../../redux/actions";
import { GrDocumentUpdate } from "react-icons/gr";

export default function FormEditTodo({ dataInit, onClose }) {
  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm({
    defaultValues: {
      ...dataInit,
    },
  });
  const toast = useToast();
  const dispatch = useDispatch();
  const { status: statusType } = useSelector(todoSelector);
  const onSubmit = (todo) => {
    const payload = {
      data: {
        ...todo,
        id: dataInit._id,
      },
      statusType,
      toast,
      onClose,
    };
    dispatch(genericAction(UPDATE_TODO, ENUM_STATUS.FETCHING, payload));
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full p-5 border rounded-md"
    >
      <ControlInput
        name={"title"}
        control={control}
        rules={{ required: "Title field is required" }}
        errorMessage={errors?.title?.message}
      />

      <ControlInput
        name={"status"}
        control={control}
        rules={{ required: "Status field is required" }}
        errorMessage={errors?.status?.message}
        component={Select}
      >
        {STATUS_TODO.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </ControlInput>

      <ControlInput
        name={"content"}
        control={control}
        rules={{ required: "Content field is required" }}
        errorMessage={errors?.content?.message}
        component={Textarea}
      />

      <div className="text-right mt-5 space-x-5">
        <Button onClick={onClose} variant="outline" type="button">
          Cancel
        </Button>
        <Button
          leftIcon={<GrDocumentUpdate />}
          loadingText="Submitting"
          colorScheme="teal"
          variant="outline"
          type="submit"
        >
          Update
        </Button>
      </div>
    </form>
  );
}
