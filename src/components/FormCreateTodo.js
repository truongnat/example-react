import React, { useEffect } from "react";
import { AddIcon, CloseIcon } from "@chakra-ui/icons";
import { Input, Textarea, Button, Text, useToast } from "@chakra-ui/react";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { CREATE_TODO, ENUM_STATUS, genericAction } from "../redux/actions";
import { todoCreateSelector } from "../redux/selector";
import { TextError } from "./TextError";

export function FormCreateTodo() {
  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm();
  const toast = useToast();
  const dispatch = useDispatch();
  const { error, loading, status } = useSelector(todoCreateSelector);
  const onSubmit = (data) => {
    dispatch(genericAction(CREATE_TODO, ENUM_STATUS.FETCHING, data));
  };

  useEffect(() => {
    if (!loading && status === "success") {
      reset({ title: "", content: "" });
      toast({
        title: `Create todo successfully!`,
        variant: "top-accent",
        isClosable: true,
        status: "success",
        position: "top",
      });
      dispatch(genericAction(CREATE_TODO, ENUM_STATUS.RESET));
    }
    if (!loading && error) {
      reset({ title: "", content: "" });
      toast({
        title: `Something went wrong!!`,
        description: JSON.stringify(error),
        variant: "top-accent",
        isClosable: true,
        status: "error",
        position: "top",
      });
    }
  }, [error, loading, status]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="p-10 min-h-full border rounded-md"
    >
      <Controller
        name="title"
        control={control}
        rules={{ required: true }}
        render={({ field }) => (
          <Input placeholder="Title" color="black" {...field} />
        )}
      />
      <TextError e={errors.title} txtError={"Title is required"} />
      <Controller
        name="content"
        control={control}
        rules={{ required: true }}
        render={({ field }) => (
          <Textarea
            className="mt-5"
            placeholder="Description"
            color="black"
            {...field}
          />
        )}
      />
      <TextError e={errors.content} txtError={"Content is required"} />
      <div className="text-right mt-5">
        <Button
          isLoading={loading}
          leftIcon={<AddIcon />}
          loadingText="Submitting"
          colorScheme="teal"
          variant="outline"
          type="submit"
        >
          Submit
        </Button>
      </div>
    </form>
  );
}
