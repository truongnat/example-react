import React from "react";
import { Flex, Button, Text, Heading } from "@chakra-ui/react";
import { TiThSmall } from "react-icons/ti";
import { VscCheckAll } from "react-icons/vsc";
import { MdOutlineWorkOutline } from "react-icons/md";
import { IoPlaySkipForwardOutline } from "react-icons/io5";

export function SideFilter() {
  return (
    <Flex
      direction="column"
      alignItems="flex-start"
      justifyContent="flex-start"
    >
      <Heading
        className="mb-5"
        as="h2"
        bgClip="text"
        bgGradient="linear(to-r, teal.500, green.500)"
        size="md"
      >
        Side Filter
      </Heading>
      <div className="flex flex-col items-start justify-start space-y-5">
        <Button leftIcon={<TiThSmall />} colorScheme="teal" variant="outline">
          All
        </Button>
        <Button leftIcon={<VscCheckAll />} colorScheme="teal" variant="outline">
          Completed
        </Button>
        <Button
          leftIcon={<MdOutlineWorkOutline />}
          colorScheme="teal"
          variant="outline"
        >
          Todo
        </Button>
        <Button
          leftIcon={<IoPlaySkipForwardOutline />}
          colorScheme="teal"
          variant="outline"
        >
          Skipped
        </Button>
      </div>
    </Flex>
  );
}
