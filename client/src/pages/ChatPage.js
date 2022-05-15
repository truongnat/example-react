import React, { useEffect } from "react";

import { Box, Flex, useDisclosure } from "@chakra-ui/react";
import { ChatApp } from "../features";
import { MainLayout } from "../layout";
import { chatSelector } from "../redux/selector";
import { useDispatch, useSelector } from "react-redux";
import { IconSticky } from "../components";
import { ENUM_STATUS, genericAction, GET_ALL_ROOM } from "../redux/actions";

export default function ChatPage() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { rooms } = useSelector(chatSelector);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(genericAction(GET_ALL_ROOM, ENUM_STATUS.FETCHING));
  }, [dispatch]);

  return (
    <MainLayout title={"Chat App"}>
      <Flex className={"w-full flex justify-center"}>
        <Box className="w-10/12 md:w-3/5 lg:w-2/5">
          {rooms.map((e, i) => (
            <ChatApp.RoomItem key={i} {...e} />
          ))}
        </Box>

        {/*portal*/}
        <ChatApp.CreateRoomForm isOpen={isOpen} onClose={onClose} />
        <IconSticky
          fn={() => onOpen()}
          customClass={"bottom-24 bg-green-500"}
        />
      </Flex>
    </MainLayout>
  );
}
