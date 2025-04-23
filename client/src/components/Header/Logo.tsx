import { Box } from "@chakra-ui/react";
import React from "react";
import { useHistory } from "react-router-dom";
import { PAGE_KEYS } from "../../constants";

export default function Logo() {
  const history = useHistory();
  return (
    <Box
      className={"font-bold text-xl cursor-pointer"}
      onClick={() => history.push(PAGE_KEYS.HomePage)}
    >
      Peanut
    </Box>
  );
}
