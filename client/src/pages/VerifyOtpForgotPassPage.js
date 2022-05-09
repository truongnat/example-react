import React, { useEffect, useState } from "react";

import {
  Button,
  Flex,
  Stack,
  useToast,
  Link,
  PinInput,
  PinInputField,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { ENUM_STATUS, genericAction, VERITY_OTP } from "../redux/actions";
import { authenticatedSelector, authLoadingSelector } from "../redux/selector";
import { useHistory, useLocation } from "react-router-dom";
import { AuthLayout } from "../layout";
import { PAGE_KEYS } from "../constants";

export default function VerifyOtpForgotPassPage() {
  const toast = useToast();
  const dispatch = useDispatch();
  const location = useLocation();
  const history = useHistory();
  const isAuthenticated = useSelector(authenticatedSelector);

  const loading = useSelector(authLoadingSelector);

  const [otp, setOtp] = useState("");

  const onSubmit = () =>
    dispatch(
      genericAction(VERITY_OTP, ENUM_STATUS.FETCHING, {
        data: {
          otp,
          email: new URLSearchParams(location.search).get("e") || "",
        },
        toast,
        history,
      })
    );

  useEffect(() => {
    if (isAuthenticated) {
      const { from } = location || { from: { pathname: "/" } };
      history.push(from);
    }
  }, [isAuthenticated, location]);

  return (
    <AuthLayout
      title={"Verify OTP!"}
      footer={
        <Stack spacing={6}>
          <Button
            isLoading={loading}
            onClick={onSubmit}
            colorScheme={"blue"}
            variant={"solid"}
          >
            Verify
          </Button>
          <Flex justifyContent={"space-between"}>
            <Link href={PAGE_KEYS.ForgotPassword}>Forgot password!</Link>
            <Link href={PAGE_KEYS.LoginPage}>Login account!</Link>
          </Flex>
        </Stack>
      }
    >
      <Stack>
        <Flex justifyContent={"space-between"} className={"pb-10"}>
          <PinInput
            autoFocus
            otp
            onChange={(val) => setOtp(val)}
            onComplete={(val) => setOtp(val)}
          >
            <PinInputField />
            <PinInputField />
            <PinInputField />
            <PinInputField />
            <PinInputField />
            <PinInputField />
          </PinInput>
        </Flex>
      </Stack>
    </AuthLayout>
  );
}
