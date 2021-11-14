import {useEffect, useState} from "react";
import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  useColorModeValue,
  Avatar,
  AvatarBadge,
  IconButton,
  Center,
  useToast,
} from "@chakra-ui/react";
import {Header} from "../components/Header";
import {Footer} from "../components/Footer";
import {HiOutlineStatusOnline} from "react-icons/hi";
import {useHistory} from "react-router-dom";
import {userSelector} from "../redux/selector";
import {useDispatch, useSelector} from "react-redux";
import {SingleUploadFile} from "../components/SingleUploadFile";
import {Authenticate} from "../services";
import {ENUM_STATUS, genericAction, LOGIN} from "../redux/actions";

export default function MyProfile() {

  const history = new useHistory();

  const dataUser = useSelector(userSelector);

  const toast = useToast();

  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);

  const [formEdit, setFormEdit] = useState({
    username: "",
    password: "",
    re_password: "",
    avatar_url: ''
  });

  const handleChangeForm = (e) => {
    setFormEdit({
      ...formEdit,
      [e.target.name]: e.target.value
    })
  }

  const handleComplete = (link) => {
    setFormEdit({
      ...formEdit,
      avatar_url: link
    })
  }

  const handleSubmit = async () => {
    let validPassword = formEdit.password === formEdit.re_password;
    if ((formEdit.password || formEdit.re_password) && !validPassword) {
      return toast({
        title: "Validate Form",
        description: "Password not matching!",
        status: "error",
        duration: 3000,
        isClosable: true,
        variant: "left-accent",
        position: "top",
      });
    }
    let objUpdate = {};
    for (const k in formEdit) {
      if (formEdit[k] !== '' && k !== 're_password') {
        objUpdate[k] = formEdit[k];
      }
    }

    try {
      setLoading(true);
      const response = await new Authenticate().update(objUpdate);
      setLoading(false);
      if (response.data && response.data.status === 200) {
        toast({
          title: "Update success",
          description: "Update process success, thanks for updating!",
          status: "success",
          duration: 3000,
          isClosable: true,
          variant: "left-accent",
          position: "top",
        });
        const dataUser = await new Authenticate().isAuthenticated();
        dispatch(genericAction(LOGIN, ENUM_STATUS.SUCCESS, dataUser));
        setFormEdit({
          ...formEdit,
          re_password: "",
          avatar_url: ''
        })

      }
    } catch (e) {
      setLoading(false);
      toast({
        title: "Update failure",
        description: "Something went wrong update profile",
        status: "error",
        duration: 3000,
        isClosable: true,
        variant: "left-accent",
        position: "top",
      });
    }
  }


  useEffect(() => {
    if (dataUser.user) {
      setFormEdit({
        ...formEdit,
        username: dataUser.user.username,
      })
    }
  }, []);
  return (
    <>
      <Header/>
      <Flex
        align={"center"}
        justify={"center"}
        bg={useColorModeValue("gray.50", "gray.800")}
      >
        <Stack
          spacing={4}
          w={"full"}
          maxW={"md"}
          bg={useColorModeValue("white", "gray.700")}
          rounded={"xl"}
          boxShadow={"lg"}
          p={6}
          my={12}
        >
          <Heading lineHeight={1.1} fontSize={{base: "2xl", sm: "3xl"}}>
            User Profile Edit
          </Heading>
          <FormControl id="userName">
            <FormLabel>User Avatar</FormLabel>
            <Stack direction={["column", "row"]} spacing={6}>
              <Center>
                <Avatar size="xl"
                        src={formEdit.avatar_url || dataUser.user.avatar_url || "https://avatars.dicebear.com/api/male/username.svg"}>
                  <AvatarBadge
                    as={IconButton}
                    size="sm"
                    rounded="full"
                    top="-10px"
                    colorScheme="green"
                    aria-label="remove Image"
                    icon={<HiOutlineStatusOnline/>}
                  />
                </Avatar>
              </Center>
              <Center w="full" className={'relative'}>
                <SingleUploadFile onComplete={handleComplete}/>
              </Center>
            </Stack>
          </FormControl>
          <FormControl id="userName" isRequired>
            <FormLabel>User name</FormLabel>
            <Input
              placeholder="UserName"
              _placeholder={{color: "gray.500"}}
              type="text"
              value={formEdit.username}
              name={'username'}
              onChange={handleChangeForm}
            />
          </FormControl>
          <FormControl id="password" isRequired>
            <FormLabel>New password</FormLabel>
            <Input
              placeholder="password"
              _placeholder={{color: "gray.500"}}
              type="password"
              name={'password'}
              value={formEdit.password}
              onChange={handleChangeForm}
            />
          </FormControl>
          <FormControl id="re-password" isRequired>
            <FormLabel>Confirm password</FormLabel>
            <Input
              placeholder="Confirm password"
              _placeholder={{color: "gray.500"}}
              type="password"
              name={'re_password'}
              value={formEdit.re_password}
              onChange={handleChangeForm}
            />
          </FormControl>
          <Stack spacing={6} direction={["column", "row"]}>
            <Button
              bg={"red.400"}
              color={"white"}
              w="full"
              _hover={{
                bg: "red.500",
              }}
              onClick={() => history.push('/')}
            >
              Cancel
            </Button>
            <Button
              isLoading={loading}
              bg={"blue.400"}
              color={"white"}
              w="full"
              _hover={{
                bg: "blue.500",
              }}
              onClick={handleSubmit}
            >
              Submit
            </Button>
          </Stack>
        </Stack>
      </Flex>
      <Footer/>
    </>
  );
}
