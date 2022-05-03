import React from "react";
import { Button, Flex, Stack, useToast, Link } from "@chakra-ui/react";
import { useHistory } from "react-router-dom";
import { AuthLayout } from "../layout";
import { useForm } from "react-hook-form";
import { ControlInput } from "../components";
import { useDispatch, useSelector } from "react-redux";
import { ENUM_STATUS, genericAction, REGISTER } from "../redux/actions";
import { authLoadingSelector } from "../redux/selector";

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
      username: "",
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
            <Link href={"/login"}>Login account!</Link>
          </Flex>
        </Stack>
      }
    >
      <Stack>
        <ControlInput
          name={"username"}
          control={control}
          rules={{ required: "Username is required!" }}
          label={"Username or Email address"}
          errorMessage={errors?.username?.message}
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
