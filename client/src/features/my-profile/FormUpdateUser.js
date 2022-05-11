import React, { useEffect } from "react";
import { Button, Stack } from "@chakra-ui/react";
import { ControlInput } from "../../components";
import { useForm } from "react-hook-form";
import { MemoryClient } from "../../utils";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { userLoadingSelector, userSelector } from "../../redux/selector";
import { ENUM_STATUS, genericAction, UPDATE_USER } from "../../redux/actions";

export default function FormUpdateUser({ avatarUrl }) {
  const history = useHistory();

  const { user } = useSelector(userSelector);
  const loading = useSelector(userLoadingSelector);

  const dispatch = useDispatch();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm({
    defaultValues: {
      email: "",
      username: "",
      currentPassword: "",
      newPassword: "",
      reNewPassword: "",
      avatarUrl: MemoryClient.get("c_avt") || "",
    },
  });

  const onSubmit = (data) =>
    dispatch(genericAction(UPDATE_USER, ENUM_STATUS.FETCHING, { data, reset }));

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
        name={"currentPassword"}
        autoComplete={"off"}
        control={control}
        isPassword
        rules={{
          minLength: {
            value: 8,
            message: "Current password must have at least 8 characters!",
          },
        }}
        label={"Current password"}
        errorMessage={errors?.currentPassword?.message}
      />

      <ControlInput
        name={"newPassword"}
        autoComplete={"off"}
        control={control}
        isPassword
        rules={{
          minLength: {
            value: 8,
            message: "New password must have at least 8 characters!",
          },
        }}
        label={"New password"}
        errorMessage={errors?.newPassword?.message}
      />

      <ControlInput
        name={"reNewPassword"}
        autoComplete={"off"}
        control={control}
        isPassword
        rules={{
          minLength: {
            value: 8,
            message: "Repeat new password must have at least 8 characters!",
          },
          validate: (value) =>
            value === watch("newPassword") ||
            "The repeat new password do not match!",
        }}
        label={"Repeat new password"}
        errorMessage={errors?.reNewPassword?.message}
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
          isLoading={loading}
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
