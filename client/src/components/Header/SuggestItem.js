"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SuggestItem;
const react_1 = require("@chakra-ui/react");
const ai_1 = require("react-icons/ai");
const react_2 = __importDefault(require("react"));
const constants_1 = require("../../constants");
function SuggestItem({ avatarUrl = constants_1.DEFAULT_AVATAR, email = "", isFriend = false, description = "N/A", }) {
    return (<react_1.Flex flex={1} justifyContent={"space-between"} className={"p-2 cursor-pointer transition-all hover:bg-gray-100"}>
      <react_1.Avatar src={avatarUrl}/>
      <react_1.Box ml="3" className="w-full flex flex-col justify-between">
        <react_1.Text fontWeight="bold" className="flex justify-between">
          {email}
          {isFriend ? (<react_1.Badge ml="1" colorScheme="purple">
              Friend
            </react_1.Badge>) : (<react_1.IconButton variant="outline" colorScheme="teal" aria-label="Request friend" icon={<ai_1.AiOutlineArrowRight />}/>)}
        </react_1.Text>
        <react_1.Text fontSize="sm">{description}</react_1.Text>
      </react_1.Box>
    </react_1.Flex>);
}
