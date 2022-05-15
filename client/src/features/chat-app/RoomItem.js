import React from "react";
import { Avatar, Flex, Tag } from "@chakra-ui/react";
import { BsCheck2All } from "react-icons/bs";
import { useHistory } from "react-router-dom";
import { DEFAULT_AVATAR, PAGE_KEYS } from "../../constants";

export default function RoomItem({
  avatarUrl = DEFAULT_AVATAR,
  name = "",
  lastMessage = "",
  time = "",
  isRead = false,
  unReadCount = 0,
  _id,
}) {
  const history = useHistory();

  function navigateRoom() {
    history.push(`${PAGE_KEYS.RoomPage}/${_id}`);
  }

  return (
    <Flex
      onClick={navigateRoom}
      className="p-3 rounded-2xl bg-gray-50 hover:bg-gray-100 cursor-pointer"
    >
      <Avatar size={"md"} src={avatarUrl} />

      <Flex direction={"column"} className="w-full">
        <Flex alignItems={"center"} justifyContent={"space-between"}>
          <div className="pl-2 font-medium">{name}</div>
          <Flex alignItems={"center"} justifyContent={"flex-end"}>
            {isRead && <BsCheck2All color="green" />}
            <span>{time}</span>
          </Flex>
        </Flex>

        <Flex alignItems={"center"} justifyContent={"space-between"}>
          <div className="pl-2">{lastMessage}</div>
          {unReadCount > 0 && (
            <Flex alignItems={"center"} justifyContent={"flex-end"}>
              <Tag
                size={"md"}
                borderRadius="full"
                variant="solid"
                colorScheme="green"
              >
                {unReadCount}
              </Tag>
            </Flex>
          )}
        </Flex>
      </Flex>
    </Flex>
  );
}
