import React, { useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  CheckboxGroup,
  Flex,
  Input,
  InputGroup,
  InputRightElement,
  Spinner,
  Stack,
} from "@chakra-ui/react";
import { AiOutlineSearch } from "react-icons/ai";
import { Notify } from "notiflix";
import { serviceClient } from "./../../services";
import { StatusCode } from "../../constants";

export default function FormSelectParticipants({ onNext }) {
  const [textSearch, setTextSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [selected, setSelected] = useState([]);

  async function handleSearchUser() {
    try {
      setLoading(true);
      const response = await serviceClient._userService.searchUser(textSearch);
      setLoading(false);
      setSelected([]);
      if (response?.status === StatusCode.Success) {
        setUsers(response.data.data);
      }
    } catch (e) {
      setLoading(false);
      Notify.failure(e.message);
    }
  }

  const handleNextForm = () => {
    onNext({ participants: selected });
  };

  return (
    <Box>
      <Flex className="w-full">
        <InputGroup className="">
          <Input
            placeholder="Search user"
            value={textSearch}
            onChange={(e) => setTextSearch(e.target.value)}
          />
          <InputRightElement
            className="cursor-pointer"
            children={
              loading ? (
                <Spinner />
              ) : (
                <AiOutlineSearch onClick={handleSearchUser} />
              )
            }
          />
        </InputGroup>
      </Flex>
      <Flex className="mt-5">
        <CheckboxGroup
          colorScheme="green"
          value={selected}
          onChange={(value) => setSelected(value)}
        >
          <Stack>
            {users.length > 0 ? (
              users.map((u) => (
                <Checkbox key={u._id} value={u._id}>
                  {u?.username || u.email}
                </Checkbox>
              ))
            ) : (
              <div>No participant selected</div>
            )}
          </Stack>
        </CheckboxGroup>
      </Flex>

      <Flex className="mt-5 justify-end">
        <Button
          size="sm"
          onClick={handleNextForm}
          isDisabled={!selected.length}
        >
          Next
        </Button>
      </Flex>
    </Box>
  );
}
