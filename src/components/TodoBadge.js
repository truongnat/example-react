import { Badge } from "@chakra-ui/react";
import React from "react";

export function TodoBadge({ status }) {
  switch (status) {
    case "initial":
      return (
        <Badge ml="1" colorScheme="cyan">
          New
        </Badge>
      );
    case "todo":
      return (
        <Badge ml="1" colorScheme="purple">
          Working
        </Badge>
      );
    case "review":
      return (
        <Badge ml="1" colorScheme="orange">
          Review
        </Badge>
      );
    case "done":
      return (
        <Badge ml="1" colorScheme="green">
          Done
        </Badge>
      );
    case "keeping":
      return (
        <Badge ml="1" colorScheme="green">
          Keeping
        </Badge>
      );
    default:
      return (
        <Badge variant="outline" colorScheme="green">
          Default
        </Badge>
      );
  }
}
