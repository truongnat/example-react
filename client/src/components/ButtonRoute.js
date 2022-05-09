import React from "react";
import { Box, Text } from "@chakra-ui/react";
import { useHistory } from "react-router-dom";
import { classes } from "../utils";

export default function ButtonRoute({ children, route, classNames }) {
  const history = useHistory();
  return (
    <Box onClick={() => history.push(route)}>
      <Text className={classes("cursor-pointer hover:underline", classNames)}>
        {children}
      </Text>
    </Box>
  );
}
