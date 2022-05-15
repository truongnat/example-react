import React from "react";
import { ControlInput } from "../../components";
import { useForm } from "react-hook-form";
import { Box, Button, Flex } from "@chakra-ui/react";

export default function FormRoomName({ onNext }) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
    },
  });
  const onSubmit = (data) => {
    onNext(data);
  };

  return (
    <Box>
      <ControlInput
        name={"name"}
        control={control}
        rules={{
          required: "Name room is required!",
          minLength: {
            value: 4,
            message: "Name room must have at least 4 characters!",
          },
          maxLength: {
            value: 50,
            message: "Name room max 50 characters!",
          },
        }}
        label={"Name room"}
        errorMessage={errors?.name?.message}
      />
      <Flex className="mt-5 justify-end">
        <Button size="sm" onClick={handleSubmit(onSubmit)}>
          Next
        </Button>
      </Flex>
    </Box>
  );
}
