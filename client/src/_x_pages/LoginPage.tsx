import React, { useEffect } from "react";

import { Button, Flex, Stack } from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { ENUM_STATUS, genericAction, LOGIN } from "../redux/actions";
import { authenticatedSelector, authLoadingSelector } from "../redux/selector";
import { useHistory, useLocation } from "react-router-dom";
import { AuthLayout } from "../layout";
import { useForm } from "react-hook-form";
import { ButtonRoute, ControlInput } from "../components";
import { PAGE_KEYS, REGEX_EMAIL } from "../constants";

export default function LoginPage() {
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
      email: "",
      password: "",
    },
  });

  const onSubmit = (data) =>
    dispatch(genericAction(LOGIN, ENUM_STATUS.FETCHING, { data }));

  useEffect(() => {
    if (isAuthenticated) {
      console.log("isAuthenticated", location);
      const from = { ...location, pathname: PAGE_KEYS.HomePage };

      history.push(from);
    }
  }, [isAuthenticated]);

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
          <Flex justifyContent={"space-between"}>
            <ButtonRoute route={PAGE_KEYS.ForgotPassword}>
              Forgot account!
            </ButtonRoute>
            <ButtonRoute route={PAGE_KEYS.RegisterPage}>
              Register account!
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
      </Stack>
    </AuthLayout>
  );
}
