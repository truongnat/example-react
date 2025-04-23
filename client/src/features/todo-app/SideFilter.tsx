import React from "react";
import { Flex, Button, Heading } from "@chakra-ui/react";
import { TiThSmall } from "react-icons/ti";
import { VscCheckAll, VscPreview } from "react-icons/vsc";
import { MdOutlineWorkOutline } from "react-icons/md";
import { IoPlaySkipForwardOutline } from "react-icons/io5";
import { ENUM_STATUS, genericAction, GET_ALL_TODO } from "../../redux/actions";
import { useDispatch, useSelector } from "react-redux";
import { todoSelector } from "../../redux/selector";
import { ENUM_STATUS_TODO } from "../../constants";

export default function SideFilter() {
  const dispatch = useDispatch();
  const { status } = useSelector(todoSelector);

  function filterTodo(status = "") {
    dispatch(genericAction(GET_ALL_TODO, ENUM_STATUS.FETCHING, { status }));
  }

  function resolveVariant(status, match) {
    return status === match ? "solid" : "outline";
  }

  return (
    <Flex className="w-full sm:w-4/12 flex-col p-5 border rounded-md">
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
        <Button
          onClick={() => filterTodo(ENUM_STATUS_TODO.INIT)}
          variant={resolveVariant(status, ENUM_STATUS_TODO.INIT)}
          leftIcon={<TiThSmall />}
          colorScheme="teal"
        >
          All
        </Button>
        <Button
          onClick={() => filterTodo(ENUM_STATUS_TODO.TODO)}
          leftIcon={<MdOutlineWorkOutline />}
          colorScheme="teal"
          variant={resolveVariant(status, ENUM_STATUS_TODO.TODO)}
        >
          Todo
        </Button>
        <Button
          onClick={() => filterTodo(ENUM_STATUS_TODO.REVIEW)}
          leftIcon={<VscPreview />}
          colorScheme="teal"
          variant={resolveVariant(status, ENUM_STATUS_TODO.REVIEW)}
        >
          Review
        </Button>
        <Button
          onClick={() => filterTodo(ENUM_STATUS_TODO.DONE)}
          leftIcon={<VscCheckAll />}
          colorScheme="teal"
          variant={resolveVariant(status, ENUM_STATUS_TODO.DONE)}
        >
          Completed
        </Button>

        <Button
          onClick={() => filterTodo(ENUM_STATUS_TODO.KEEPING)}
          leftIcon={<IoPlaySkipForwardOutline />}
          colorScheme="teal"
          variant={resolveVariant(status, ENUM_STATUS_TODO.KEEPING)}
        >
          Skipped
        </Button>
      </div>
    </Flex>
  );
}
