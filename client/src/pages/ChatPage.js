import React from "react";

import { Stack, Text, Box } from "@chakra-ui/react";
import { Footer, Header, IconSticky } from "../components";
import { ChatApp } from "../features";
import { DEFAULT_AVATAR } from "../constants";

const mockData = [
  {
    avatarUrl: DEFAULT_AVATAR,
    name: "Telegram",
    lastMessage: "ok toi nho ban",
    time: "17:08",
    isRead: true,
    unReadCount: 1,
  },
  {
    avatarUrl: DEFAULT_AVATAR,
    name: "Mc AAA",
    lastMessage: "ok toi nho ban",
    time: "17:08",
    isRead: true,
    unReadCount: 1,
  },
];

export default function ChatPage() {
  return (
    <Stack minH={"100vh"} alignItems="center" justifyContent="start">
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
          Chat App
        </Text>
      </Box>
      <Box className="w-10/12 md:w-3/5 lg:w-2/5">
        {mockData.map((e, i) => (
          <ChatApp.RoomItem key={i} {...e} />
        ))}
      </Box>
      <div className="mt-28 w-full">
        <Footer />
      </div>
      <IconSticky fn={() => alert(123)} />
    </Stack>
  );
}
