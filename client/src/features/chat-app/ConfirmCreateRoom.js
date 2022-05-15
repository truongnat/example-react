import { Box, Button, Flex, Text } from "@chakra-ui/react";
import React from "react";
import { MdOutlineDone } from "react-icons/md";

export default function ConfirmCreateRoom({ onSubmit, loading }) {
  return (
    <Flex className="flex-col items-center space-y-5 py-2">
      <Box className="w-20 h-20 rounded-full border-2 border-green-600 flex flex-row items-center justify-center">
        <MdOutlineDone size={50} color={"green"} />
      </Box>
      <Text className="text-lg font-medium">Completed create room form!</Text>
      <Button size="sm" onClick={onSubmit} isLoading={loading}>
        Submit
      </Button>
    </Flex>
  );
}
