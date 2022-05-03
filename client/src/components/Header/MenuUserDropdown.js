import {
  Avatar,
  Button,
  Center,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { DEFAULT_AVATAR } from "../../constants";
import { CHECKING_AUTH, ENUM_STATUS, genericAction } from "../../redux/actions";
import { userSelector } from "../../redux/selector";
import { MemoryClient } from "../../utils";

export default function MenuUserDropdown() {
  const history = useHistory();
  const dispatch = useDispatch();
  const dataUser = useSelector(userSelector);

  const avatarUrl =
    MemoryClient.get("c_avt") || dataUser.user?.avatarUrl || DEFAULT_AVATAR;

  const handleLogout = async () => {
    MemoryClient.clearAll()
    history.push("/login");
    dispatch(genericAction(CHECKING_AUTH, ENUM_STATUS.PUSH_NORMAL, false));
  };

  return (
    <Menu>
      <MenuButton
        as={Button}
        rounded={"full"}
        variant={"link"}
        cursor={"pointer"}
        minW={0}
      >
        <Avatar size={"sm"} src={avatarUrl} />
      </MenuButton>
      <MenuList alignItems={"center"}>
        <br />
        <Center>
          <Avatar size={"2xl"} src={avatarUrl} />
        </Center>
        <br />
        <Center>
          <p>{dataUser?.user?.username || ""}</p>
        </Center>
        <br />
        <MenuDivider />
        <MenuItem onClick={() => history.push("/my-profile")}>
          Account Settings
        </MenuItem>
        <MenuItem onClick={handleLogout} Cl>
          Logout
        </MenuItem>
      </MenuList>
    </Menu>
  );
}
