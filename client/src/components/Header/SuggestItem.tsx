import { Avatar, Badge, Box, Flex, IconButton, Text } from "@chakra-ui/react";
import { AiOutlineArrowRight } from "react-icons/ai";
import React from "react";
import { DEFAULT_AVATAR } from "../../constants";
export default function SuggestItem({
  avatarUrl = DEFAULT_AVATAR,
  email = "",
  isFriend = false,
  description = "N/A",
}) {
  return (
    <Flex
      flex={1}
      justifyContent={"space-between"}
      className={"p-2 cursor-pointer transition-all hover:bg-gray-100"}
    >
      <Avatar src={avatarUrl} />
      <Box ml="3" className="w-full flex flex-col justify-between">
        <Text fontWeight="bold" className="flex justify-between">
          {email}
          {isFriend ? (
            <Badge ml="1" colorScheme="purple">
              Friend
            </Badge>
          ) : (
            <IconButton
              variant="outline"
              colorScheme="teal"
              aria-label="Request friend"
              icon={<AiOutlineArrowRight />}
            />
          )}
        </Text>
        <Text fontSize="sm">{description}</Text>
      </Box>
    </Flex>
  );
}
