import React, { useState, useEffect } from "react";

import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  useToast,
  Text,
  Center,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { ENUM_STATUS, genericAction, LOGIN } from "../redux/actions";
import { selectorAuth, userSelector } from "../redux/selector";
import { useHistory, useLocation } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import { signInGoogle } from "../config/firebase-cloud";
export default function LoginPage() {
  const [formLogin, setFormLogin] = useState({
    username: "truongx2",
    password: "truong222",
  });
  const toast = useToast();
  const dispatch = useDispatch();
  const location = useLocation();
  const history = useHistory();
  const isAuthenticated = useSelector(selectorAuth);
  const { loading } = useSelector(userSelector);
  const onChangeForm = (name, val) => {
    setFormLogin({
      ...formLogin,
      [name]: val,
    });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!formLogin.username || !formLogin.password) {
      toast({
        title: "Validate Form",
        description: "Username field or Password field is empty!",
        status: "error",
        duration: 9000,
        isClosable: true,
        variant: "left-accent",
        position: "top",
      });
      return;
    }
    dispatch(genericAction(LOGIN, ENUM_STATUS.FETCHING, formLogin));
  };
  useEffect(() => {
    if (isAuthenticated) {
      const { from } = location.state || { from: { pathname: "/" } };
      history.push(from);
    }
  }, [isAuthenticated, location.state, history]);

  const handleDone = (data) => {
    console.log("login google done :", data);
    alert("Coming soon!");
  };

  return (
    <Stack minH={"100vh"} direction={{ base: "column", md: "row" }}>
      <Flex p={8} flex={1} align={"center"} justify={"center"}>
        <Stack spacing={4} w={"full"} maxW={"md"}>
          <Heading fontSize={"2xl"}>Sign in to your account</Heading>
          <FormControl id="email">
            <FormLabel>Email address</FormLabel>
            <Input
              type="username"
              value={formLogin.username}
              onChange={(e) => onChangeForm("username", e.target.value)}
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
            <Button
              isLoading={loading}
              onClick={onSubmit}
              colorScheme={"blue"}
              variant={"solid"}
            >
              Sign in
            </Button>
            {/* Facebook */}
            <Button
              w={"full"}
              colorScheme={"facebook"}
              leftIcon={<FaFacebook />}
              onClick={() => alert("Coming soon!")}
            >
              <Center>
                <Text>Continue with Facebook</Text>
              </Center>
            </Button>

            {/* Google */}
            <Button
              onClick={() => signInGoogle(handleDone)}
              w={"full"}
              variant={"outline"}
              leftIcon={<FcGoogle />}
            >
              <Center>
                <Text>Sign in with Google</Text>
              </Center>
            </Button>
          </Stack>
        </Stack>
      </Flex>
    </Stack>
  );
}
