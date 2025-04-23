import React from "react";
import ChatForm from "./ChatForm";
import { Box } from "@chakra-ui/react";
import ChatMessage from "./ChatMessage";

export default function ChatBox({ messages = [] }) {
  return (
    <Box
      maxW={"400px"}
      h={"25rem"}
      mx={"auto"}
      className="w-full border rounded-md flex flex-col justify-between"
    >
      <div className="flex-1 overflow-y-auto p-5 space-y-5">
        {[1, 2, 3, 4, 5, 6, 7, 8, 11, 9].map((i) => (
          <ChatMessage key={i} isMe={i % 2} />
        ))}
      </div>
      <ChatForm />
    </Box>
  );
}
