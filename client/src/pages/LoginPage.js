import React, { useEffect } from "react";

import { Button, Flex, Stack, useToast, Link } from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { ENUM_STATUS, genericAction, LOGIN } from "../redux/actions";
import { authenticatedSelector, authLoadingSelector } from "../redux/selector";
import { useHistory, useLocation } from "react-router-dom";
import { AuthLayout } from "../layout";
import { useForm } from "react-hook-form";
import { ControlInput } from "../components";
export default function LoginPage() {
  const toast = useToast();
  const dispatch = useDispatch();
  const location = useLocation();
  const history = useHistory();
  const isAuthenticated = useSelector(authenticatedSelector);

  const loading = useSelector(authLoadingSelector);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      username: "truong200122",
      password: "truong2001",
    },
  });

  const onSubmit = (data) =>
    dispatch(genericAction(LOGIN, ENUM_STATUS.FETCHING, { data, toast }));

  useEffect(() => {
    if (isAuthenticated) {
      const { from } = location.state || { from: { pathname: "/" } };
      history.push(from);
    }
  }, [isAuthenticated, location.state]);

  return (
    <AuthLayout
      title={"Sign in to your account!"}
      footer={
        <Stack spacing={6}>
          <Button
            isLoading={loading}
            onClick={handleSubmit(onSubmit)}
            colorScheme={"blue"}
            variant={"solid"}
          >
            Sign in
          </Button>
          <Flex justifyContent={"flex-end"}>
            <Link href={"/register"}>Register account!</Link>
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
      </Stack>
    </AuthLayout>
  );
}
