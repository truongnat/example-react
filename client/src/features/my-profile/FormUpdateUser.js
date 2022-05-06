import React, { useEffect } from "react";
import { Button, Stack, useToast } from "@chakra-ui/react";
import { ControlInput } from "../../components";
import { useForm } from "react-hook-form";
import { MemoryClient } from "../../utils";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { userSelector } from "../../redux/selector";
import { ENUM_STATUS, genericAction, UPDATE_USER } from "../../redux/actions";

export default function FormUpdateUser({ avatarUrl }) {
  const history = useHistory();

  const { user } = useSelector(userSelector);

  const toast = useToast();

  const dispatch = useDispatch();

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm({
    defaultValues: {
      email: "",
      username: "",
      password: "",
      rePassword: "",
      avatarUrl: MemoryClient.get("c_avt") || "",
    },
  });

  const onSubmit = (data) =>
    dispatch(genericAction(UPDATE_USER, ENUM_STATUS.FETCHING, { data, toast }));

  useEffect(() => {
    if (user) {
      setValue("email", user.email);
      setValue("username", user.username);
    }
  }, [user, setValue]);

  useEffect(() => {
    setValue("avatarUrl", avatarUrl);
  }, [avatarUrl]);

  return (
    <Stack>
      <ControlInput
        name={"email"}
        control={control}
        label={"Email address"}
        isDisabled={true}
      />
      <ControlInput name={"username"} control={control} label={"Username"} />
      <ControlInput
        name={"password"}
        control={control}
        isPassword
        rules={{
          minLength: {
            value: 8,
            message: "Password must have at least 8 characters!",
          },
        }}
        label={"Password"}
        errorMessage={errors?.password?.message}
      />
      <ControlInput
        name={"rePassword"}
        control={control}
        isPassword
        rules={{
          minLength: {
            value: 8,
            message: "Password must have at least 8 characters!",
          },
          validate: (value) =>
            value === watch("password") || "The passwords do not match!",
        }}
        label={"Repeat Password"}
        errorMessage={errors?.rePassword?.message}
      />
      <Stack spacing={6} direction={["column", "row"]}>
        <Button
          bg={"red.400"}
          color={"white"}
          w="full"
          _hover={{
            bg: "red.500",
          }}
          onClick={() => history.push("/")}
        >
          Cancel
        </Button>
        <Button
          bg={"blue.400"}
          color={"white"}
          w="full"
          _hover={{
            bg: "blue.500",
          }}
          onClick={handleSubmit(onSubmit)}
        >
          Submit
        </Button>
      </Stack>
    </Stack>
  );
}
