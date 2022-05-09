import React, { useEffect } from "react";

import { Button, Flex, Stack, useToast } from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { ENUM_STATUS, FORGOT_PASSWORD, genericAction } from "../redux/actions";
import { authenticatedSelector, authLoadingSelector } from "../redux/selector";
import { useHistory, useLocation } from "react-router-dom";
import { AuthLayout } from "../layout";
import { useForm } from "react-hook-form";
import { ButtonRoute, ControlInput } from "../components";
import { PAGE_KEYS, REGEX_EMAIL } from "../constants";

export default function ForgotPasswordPage() {
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
      email: "",
    },
  });

  const onSubmit = (data) => {
    dispatch(
      genericAction(FORGOT_PASSWORD, ENUM_STATUS.FETCHING, {
        data,
        toast,
        history,
      })
    );
  };

  useEffect(() => {
    if (isAuthenticated) {
      const { from } = location || { from: { pathname: "/" } };
      history.push(from);
    }
  }, [isAuthenticated, location]);

  return (
    <AuthLayout
      title={"Forgot account!"}
      footer={
        <Stack spacing={6}>
          <Button
            isLoading={loading}
            onClick={handleSubmit(onSubmit)}
            colorScheme={"blue"}
            variant={"solid"}
          >
            Request
          </Button>
          <Flex justifyContent={"space-between"}>
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
      </Stack>
    </AuthLayout>
  );
}
