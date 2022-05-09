import React from "react";
import { Button, Flex, Stack, useToast, Link } from "@chakra-ui/react";
import { useHistory } from "react-router-dom";
import { AuthLayout } from "../layout";
import { useForm } from "react-hook-form";
import { ButtonRoute, ControlInput } from "../components";
import { useDispatch, useSelector } from "react-redux";
import { ENUM_STATUS, genericAction, REGISTER } from "../redux/actions";
import { authLoadingSelector } from "../redux/selector";
import { PAGE_KEYS, REGEX_EMAIL } from "../constants";

export default function RegisterPage() {
  const toast = useToast();
  const history = useHistory();
  const dispatch = useDispatch();

  const loading = useSelector(authLoadingSelector);

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
      rePassword: "",
    },
  });

  const onSubmit = (data) =>
    dispatch(
      genericAction(REGISTER, ENUM_STATUS.FETCHING, { data, toast, history })
    );

  return (
    <AuthLayout
      title={"Register new account!"}
      footer={
        <Stack spacing={6}>
          <Button
            isLoading={loading}
            onClick={handleSubmit(onSubmit)}
            colorScheme={"blue"}
            variant={"solid"}
          >
            Register
          </Button>
          <Flex justifyContent={"flex-end"}>
            <ButtonRoute route={PAGE_KEYS.LoginPage}>
              Login account!
            </ButtonRoute>
          </Flex>
        </Stack>
      }
    >
      <Stack>
        <ControlInput
          name={"email"}
          control={control}
          rules={{
            required: "Email is required!",
            pattern: { value: REGEX_EMAIL, message: "Email invalid!" },
          }}
          label={"Email address"}
          errorMessage={errors?.email?.message}
        />

        <ControlInput
          name={"password"}
          control={control}
          isPassword
          rules={{
            required: "Password is required!",
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
            required: "Repeat password is required!",
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
      </Stack>
    </AuthLayout>
  );
}
