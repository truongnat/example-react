import React, {useState} from "react";

import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  useToast,
  Link,
} from "@chakra-ui/react";
import {useHistory} from "react-router-dom";
import {Authenticate} from "../services";

export default function RegisterPage() {
  const [formRegister, setFormLogin] = useState({
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const toast = useToast();
  const history = useHistory();

  const onChangeForm = (name, val) => {
    setFormLogin({
      ...formRegister,
      [name]: val,
    });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!formRegister.username || !formRegister.password) {
      toast({
        title: "Validate Form",
        description: "Username field or Password field is empty!",
        status: "error",
        duration: 3000,
        isClosable: true,
        variant: "left-accent",
        position: "top",
      });
      return false;
    }
    try {
      setLoading(true);
      const response = await new Authenticate().register(formRegister);
      setLoading(false);
      if (response.data.status === 200) {
        toast({
          title: "Register success",
          status: "success",
          duration: 3000,
          isClosable: true,
          variant: "left-accent",
          position: "top",
        });
        setTimeout(() => {
          history.push('/login')
        }, 3000);
        return;
      }
      toast({
        title: "Register failure",
        description: "Something went wrong!",
        status: "error",
        duration: 3000,
        isClosable: true,
        variant: "left-accent",
        position: "top",
      });

    } catch (e) {
      setLoading(false);
      toast({
        title: "Register failure",
        description: "Something went wrong!",
        status: "error",
        duration: 3000,
        isClosable: true,
        variant: "left-accent",
        position: "top",
      });
    }
  };

  return (
    <Stack minH={"100vh"} direction={{base: "column", md: "row"}}>
      <Flex p={8} flex={1} align={"center"} justify={"center"}>
        <Stack spacing={4} w={"full"} maxW={"md"}>
          <Heading fontSize={"2xl"}>Register new account</Heading>
          <FormControl id="email">
            <FormLabel>Username or Email address</FormLabel>
            <Input
              type="username"
              autoComplete="off"
              value={formRegister.username}
              onChange={(e) => onChangeForm("username", e.target.value)}
            />
          </FormControl>
          <FormControl id="password">
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              autoComplete="off"
              value={formRegister.password}
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
              Register
            </Button>
            <Flex justifyContent={'flex-end'}>
              <Link href={'/login'}>Login account!</Link>
            </Flex>
          </Stack>
        </Stack>
      </Flex>
    </Stack>
  );
}
