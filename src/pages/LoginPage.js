import React, { useState } from "react";

import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  useToast,
} from "@chakra-ui/react";
import { useHistory, useLocation } from "react-router-dom";
import { useAuth } from "../hooks";
import { useDispatch } from "react-redux";
import { ENUM_STATUS, genericAction, LOGIN } from "../redux/actions";

export function LoginPage() {
  const [formLogin, setFormLogin] = useState({ email: "", password: "" });
  const toast = useToast();

  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();
  const auth = useAuth();
  let { from } = location.state || { from: { pathname: "/" } };

  const onChangeForm = (name, val) => {
    setFormLogin({
      ...formLogin,
      [name]: val,
    });
  };
  const onSubmit = async () => {
    if (!formLogin.email || !formLogin.password) {
      toast({
        title: "Validate Form",
        description: "Email field or Password field is empty!",
        status: "error",
        duration: 9000,
        isClosable: true,
        variant: "left-accent",
        position: "top",
      });
    }
    dispatch(genericAction(LOGIN, ENUM_STATUS.FETCHING, formLogin));
    // auth.signIn(formLogin, () => {
    //   history.replace(from);
    // });
  };
  return (
    <Stack minH={"100vh"} direction={{ base: "column", md: "row" }}>
      <Flex p={8} flex={1} align={"center"} justify={"center"}>
        <Stack spacing={4} w={"full"} maxW={"md"}>
          <Heading fontSize={"2xl"}>Sign in to your account</Heading>
          <FormControl id="email">
            <FormLabel>Email address</FormLabel>
            <Input
              type="email"
              value={formLogin.email}
              onChange={(e) => onChangeForm("email", e.target.value)}
            />
          </FormControl>
          <FormControl id="password">
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              value={formLogin.password}
              onChange={(e) => onChangeForm("password", e.target.value)}
            />
          </FormControl>
          <Stack spacing={6}>
            <Button onClick={onSubmit} colorScheme={"blue"} variant={"solid"}>
              Sign in
            </Button>
          </Stack>
        </Stack>
      </Flex>
    </Stack>
  );
}
