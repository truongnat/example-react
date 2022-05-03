import { Box, Stack, Text } from "@chakra-ui/react";
import React from "react";
import { Footer, Header } from "../components";

export function MainLayout({ title, children }) {
  return (
    <Stack minH={"100vh"} alignItems="center" justifyContent="space-between">
      <Header />
      <Box mt={30}>
        <Text
          as={"h2"}
          fontSize="4xl"
          bgClip="text"
          bgGradient="linear(to-r, teal.500, green.500)"
          fontWeight="bold"
          textAlign="center"
          className="my-5"
        >
          {title}
        </Text>
        {children}
      </Box>

      <Box className="mt-28 w-full">
        <Footer />
      </Box>
    </Stack>
  );
}
