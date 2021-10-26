import { CloseIcon } from "@chakra-ui/icons";
import { Text } from "@chakra-ui/react";
import React from "react";

export function TextError({ e, txtError }) {
  if (e) {
    return (
      <div className="flex flex-row items-center justify-start mt-2 space-x-1">
        <CloseIcon w="2.5" h="2.5" color="red" />
        <Text color="red">{txtError}</Text>
      </div>
    );
  }
  return null;
}
