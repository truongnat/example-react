import React, { useEffect } from "react";
import { AddIcon, CloseIcon } from "@chakra-ui/icons";
import { Input, Textarea, Select, Button, Text } from "@chakra-ui/react";
import { Controller, useForm } from "react-hook-form";
import { STATUS_TODO } from "../constants";

export function FormTodo({
  dataInit,
  callback,
  loading,
  isFieldStatus = false,
  resetValue,
}) {
  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm();
  const onSubmit = (data) => callback(data);

  function renderError(e, txtError) {
    if (e) {
      return (
        <div className="flex flex-row items-center justify-start mt-2 space-x-1">
          <CloseIcon w="2.5" h="2.5" color="red" />
          <Text color="red">{txtError}</Text>
        </div>
      );
    }
    return null;
  }
  useEffect(() => {
    if (resetValue) {
      reset(resetValue);
    }
  }, [resetValue]);
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-10 border rounded-md">
      <Controller
        name="title"
        control={control}
        rules={{ required: true }}
        defaultValue={dataInit?.title || ""}
        render={({ field }) => (
          <Input placeholder="Title" color="black" {...field} />
        )}
      />
      {renderError(errors.title, "Title is required")}
      {isFieldStatus && (
        <>
          <Controller
            name="status"
            control={control}
            rules={{ required: true }}
            defaultValue={dataInit?.status || ""}
            render={({ field }) => (
              <Select
                className="mt-5"
                placeholder="Status"
                color="black"
                {...field}
              >
                {STATUS_TODO.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </Select>
            )}
          />
          {renderError(errors.status, "Status is required")}
        </>
      )}
      <Controller
        name="content"
        control={control}
        rules={{ required: true }}
        defaultValue={dataInit?.content || ""}
        render={({ field }) => (
          <Textarea
            className="mt-5"
            placeholder="Description"
            color="black"
            {...field}
          />
        )}
      />
      {renderError(errors.content, "Content is required")}
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
