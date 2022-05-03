import React from "react";
import { AddIcon } from "@chakra-ui/icons";
import { Textarea, Button, useToast, Code, Box } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { CREATE_TODO, ENUM_STATUS, genericAction } from "../../redux/actions";
import { todoSelector } from "../../redux/selector";
import { ControlInput } from "../../components";
import TodoBadge from "./TodoBadge";
import { STATUS_TODO } from "../../constants";

const initForm = {
  title: "",
  content: "",
};

export default function FormCreateTodo() {
  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm({
    defaultValues: {
      ...initForm,
    },
  });
  const toast = useToast();
  const dispatch = useDispatch();
  const { status: statusType } = useSelector(todoSelector);

  const onSubmit = (data) => {
    dispatch(
      genericAction(CREATE_TODO, ENUM_STATUS.FETCHING, {
        data,
        statusType,
        toast,
        reset,
      })
    );
  };

  return (
    <Box className="w-full sm:w-3/5 p-5 border rounded-md">
      <form onSubmit={handleSubmit(onSubmit)}>
        <ControlInput
          name={"title"}
          control={control}
          rules={{ required: "Title field is required!" }}
          errorMessage={errors?.title?.message}
        />

        <ControlInput
          name={"content"}
          control={control}
          rules={{ required: "Content field is required!" }}
          errorMessage={errors?.content?.message}
          component={Textarea}
        />

        <div className="text-right my-5 space-x-5">
          <Button onClick={() => reset(initForm)} type="button">
            Clear
          </Button>
          <Button
            leftIcon={<AddIcon />}
            loadingText="Submitting"
            colorScheme="teal"
            variant="outline"
            type="submit"
          >
            Submit
          </Button>
        </div>
        <div className="">
          <Code>Status App : </Code>
        </div>
        <div className="mt-5">
          {STATUS_TODO.map((status) => (
            <TodoBadge key={status} status={status} />
          ))}
        </div>
      </form>
    </Box>
  );
}
