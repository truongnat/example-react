import React from "react";
import { Badge } from "@chakra-ui/react";
import { ENUM_STATUS_TODO } from "../../constants";

const badge = {
  [ENUM_STATUS_TODO.INIT]: {
    color: "cyan",
    type: ENUM_STATUS_TODO.INIT,
    title: "New",
  },
  [ENUM_STATUS_TODO.TODO]: {
    color: "purple",
    type: ENUM_STATUS_TODO.TODO,
    title: "Working",
  },
  [ENUM_STATUS_TODO.REVIEW]: {
    color: "orange",
    type: ENUM_STATUS_TODO.REVIEW,
    title: "Review",
  },
  [ENUM_STATUS_TODO.DONE]: {
    color: "green",
    type: ENUM_STATUS_TODO.DONE,
    title: "Done",
  },
  [ENUM_STATUS_TODO.KEEPING]: {
    color: "telegram",
    type: ENUM_STATUS_TODO.KEEPING,
    title: "Keeping",
  },
};

export default function TodoBadge({ status }) {
  return (
    <Badge ml="1" colorScheme={badge[status].color}>
      {badge[status].title}
    </Badge>
  );
}
