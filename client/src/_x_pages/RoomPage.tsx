import React, { useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { genericAction, ENUM_STATUS, ROOM_DETAIL } from "../redux/actions";
import { MainLayout } from "../layout";
import { chatSelector } from "../redux/selector";
import { Flex } from "@chakra-ui/react";
import { ChatApp } from "../features";

export default function RoomPage() {
  const params = useParams();
  const history = useHistory();

  const dispatch = useDispatch();

  const { roomDetail } = useSelector(chatSelector);

  const fetchRoomDetail = () => {
    dispatch(
      genericAction(ROOM_DETAIL, ENUM_STATUS.FETCHING, {
        data: params?.id,
        history,
      })
    );
  };
  useEffect(() => {
    fetchRoomDetail();
  }, []);
  return (
    <MainLayout title={roomDetail?.name || ""}>
      <Flex className={"w-full flex justify-center"}>
        <ChatApp.ChatBox></ChatApp.ChatBox>
      </Flex>
    </MainLayout>
  );
}
