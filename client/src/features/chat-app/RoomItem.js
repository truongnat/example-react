"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = RoomItem;
const react_1 = __importDefault(require("react"));
const react_2 = require("@chakra-ui/react");
const bs_1 = require("react-icons/bs");
const react_router_dom_1 = require("react-router-dom");
const constants_1 = require("../../constants");
function RoomItem({ avatarUrl = constants_1.DEFAULT_AVATAR, name = "", lastMessage = "", time = "", isRead = false, unReadCount = 0, _id, }) {
    const history = (0, react_router_dom_1.useHistory)();
    function navigateRoom() {
        history.push(`${constants_1.PAGE_KEYS.RoomPage}/${_id}`);
    }
    return (<react_2.Flex onClick={navigateRoom} className="p-3 rounded-2xl bg-gray-50 hover:bg-gray-100 cursor-pointer">
      <react_2.Avatar size={"md"} src={avatarUrl}/>

      <react_2.Flex direction={"column"} className="w-full">
        <react_2.Flex alignItems={"center"} justifyContent={"space-between"}>
          <div className="pl-2 font-medium">{name}</div>
          <react_2.Flex alignItems={"center"} justifyContent={"flex-end"}>
            {isRead && <bs_1.BsCheck2All color="green"/>}
            <span>{time}</span>
          </react_2.Flex>
        </react_2.Flex>

        <react_2.Flex alignItems={"center"} justifyContent={"space-between"}>
          <div className="pl-2">{lastMessage}</div>
          {unReadCount > 0 && (<react_2.Flex alignItems={"center"} justifyContent={"flex-end"}>
              <react_2.Tag size={"md"} borderRadius="full" variant="solid" colorScheme="green">
                {unReadCount}
              </react_2.Tag>
            </react_2.Flex>)}
        </react_2.Flex>
      </react_2.Flex>
    </react_2.Flex>);
}
