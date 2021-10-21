import React, { useEffect, useState, useContext } from "react";

import { Flex, Stack, Image } from "@chakra-ui/react";
import { Services } from "../services";

export default function HomePage() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    fetchUser();
  }, []);
  const fetchUser = async () => {
    const response = await new Services().getUsers();
  };
  return (
    <Stack minH={"100vh"} direction={{ base: "column", md: "row" }}>
      <Flex flex={1}>
        <button onClick={() => setCount(count + 1)}> click thuy</button>
      </Flex>
    </Stack>
  );
}
