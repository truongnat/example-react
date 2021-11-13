import React from "react";
import {
  Box,
  Flex,
  Avatar,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useColorModeValue,
  Stack,
  useColorMode,
  Center,
} from "@chakra-ui/react";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import { useDispatch, useSelector } from "react-redux";
import { userSelector } from "../redux/selector";
import { MemoryClient } from "../utils";
import { useHistory } from "react-router-dom";
import { CHECKING_AUTH, ENUM_STATUS, genericAction } from "../redux/actions";

export function Header() {
  const { colorMode, toggleColorMode } = useColorMode();
  const dataUser = useSelector(userSelector);
  const history = useHistory();
  const dispatch = useDispatch();
  const handleLogout = async () => {
    MemoryClient.removeMultiple(["lp", "anonymous_user"]);
    history.push("/login");
    dispatch(genericAction(CHECKING_AUTH, ENUM_STATUS.PUSH_NORMAL, false));
  };
  return (
    <div className="w-full">
      <Box bg={useColorModeValue("gray.100", "gray.900")} px={4}>
        <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
          <Box
            className={"font-bold text-xl cursor-pointer"}
            onClick={() => history.push("/")}
          >
            Peanut
          </Box>

          <Flex alignItems={"center"}>
            <Stack direction={"row"} spacing={7}>
              <Button onClick={toggleColorMode}>
                {colorMode === "light" ? <MoonIcon /> : <SunIcon />}
              </Button>

              <Menu>
                <MenuButton
                  as={Button}
                  rounded={"full"}
                  variant={"link"}
                  cursor={"pointer"}
                  minW={0}
                >
                  <Avatar
                    size={"sm"}
                    src={"https://avatars.dicebear.com/api/male/username.svg"}
                  />
                </MenuButton>
                <MenuList alignItems={"center"}>
                  <br />
                  <Center>
                    <Avatar
                      size={"2xl"}
                      src={"https://avatars.dicebear.com/api/male/username.svg"}
                    />
                  </Center>
                  <br />
                  <Center>
                    <p>{dataUser.user ? dataUser.user.username : ""}</p>
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
            </Stack>
          </Flex>
        </Flex>
      </Box>
    </div>
  );
}
