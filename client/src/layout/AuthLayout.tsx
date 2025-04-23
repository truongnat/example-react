import React from "react";
import { Flex, Heading, Stack, Image } from "@chakra-ui/react";
import Logo from "../assets/images/logo-mern.png";

export function AuthLayout({ title, children, footer }) {
  return (
    <Stack minH={"100vh"} direction={{ base: "column", md: "row" }}>
      <Flex p={8} flex={1} align={"center"} justify={"center"}>
        <Stack spacing={4} w={"full"} maxW={"md"}>
          <Image
            w={300}
            h={200}
            mx={"auto"}
            src={Logo}
            alt="logo-application"
          />
          <Heading textAlign={"center"} pb={50} fontSize={"2xl"}>
            {title}
          </Heading>
          {children}
          {footer}
        </Stack>
      </Flex>
    </Stack>
  );
}
