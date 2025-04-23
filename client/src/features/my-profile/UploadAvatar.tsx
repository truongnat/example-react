import React from "react";
import {
  Avatar,
  AvatarBadge,
  Center,
  IconButton,
  Stack,
} from "@chakra-ui/react";
import { HiOutlineStatusOnline } from "react-icons/hi";
import { SingleUploadFile } from "../../components";

export default function UploadAvatar({ url, handleComplete }) {
  console.log(url);
  return (
    <Stack direction={["column", "row"]} spacing={6}>
      <Center>
        <Avatar size="xl" src={url}>
          <AvatarBadge
            as={IconButton}
            size="sm"
            rounded="full"
            top="-10px"
            colorScheme="green"
            aria-label="remove Image"
            icon={<HiOutlineStatusOnline />}
          />
        </Avatar>
      </Center>
      <Center w="full" className={"relative"}>
        <SingleUploadFile onComplete={handleComplete} label={"Change avatar"} />
      </Center>
    </Stack>
  );
}
