import { Avatar } from "@chakra-ui/react";
import React from "react";

export default function ChatMessage({ isMe }) {
  return (
    <div
      className={`p-3 bg-white shadow rounded-lg animate__animated 
      ${isMe ? "animate__bounceInLeft" : "animate__bounceInRight"}`}
    >
      <div
        className={`border-b flex items-start pb-2 ${
          isMe ? "flex-row-reverse" : ""
        }`}
      >
        <Avatar
          size={"sm"}
          name="Dan Abrahmov"
          src="https://bit.ly/dan-abramov"
        />
        <h3 className={`text-md font-medium ${isMe ? "pr-2" : "pl-2"}`}>
          font-sans
        </h3>
      </div>

      <p className="font-sans">
        The quick brown fox jumps over the lazy dog The quick brown fox jumps
        over the lazy dog The quick brown fox jumps over the lazy dogThe quick
        brown fox jumps over the lazy dogThe quick brown fox jumps over the lazy
        dog .
      </p>
    </div>
  );
}
