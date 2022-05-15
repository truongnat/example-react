import { useState } from "react";
import { Stack, useColorModeValue } from "@chakra-ui/react";
import { userSelector } from "../redux/selector";
import { useSelector } from "react-redux";
import { DEFAULT_AVATAR } from "../constants";
import { MainLayout } from "../layout";
import { MemoryClient } from "../utils";

import { MyProfile } from "../features";

export default function MyProfilePage() {
  const dataUser = useSelector(userSelector);
  const [avatarUrl, setAvatarUrl] = useState(MemoryClient.get("c_avt"));

  const handleChangeLink = (link) => {
    MemoryClient.set("c_avt", link);
    setAvatarUrl(link);
  };

  return (
    <MainLayout title={"My Profile"}>
      <Stack
        spacing={4}
        w={"full"}
        maxW={"md"}
        mx={'auto'}
        bg={useColorModeValue("white", "gray.700")}
        rounded={"xl"}
        boxShadow={"lg"}
        p={6}
      >
        <MyProfile.UploadAvatar
          url={avatarUrl || dataUser.user?.avatarUrl || DEFAULT_AVATAR}
          handleComplete={handleChangeLink}
        />

        <MyProfile.FormUpdateUser avatarUrl={avatarUrl} />
      </Stack>
    </MainLayout>
  );
}
