import { Box, Stack } from "@chakra-ui/react";
import React from "react";
import { Footer, Header } from "../components";

export function ChatLayout({ children }) {
  return (
    <Stack minH={"100vh"} alignItems="center" justifyContent="space-between">
      <Header />
      {children}
      <Box className="mt-28 w-full">
        <Footer />
      </Box>
    </Stack>
  );
}
