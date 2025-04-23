"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = UploadAvatar;
const react_1 = __importDefault(require("react"));
const react_2 = require("@chakra-ui/react");
const hi_1 = require("react-icons/hi");
const components_1 = require("../../components");
function UploadAvatar({ url, handleComplete }) {
    console.log(url);
    return (<react_2.Stack direction={["column", "row"]} spacing={6}>
      <react_2.Center>
        <react_2.Avatar size="xl" src={url}>
          <react_2.AvatarBadge as={react_2.IconButton} size="sm" rounded="full" top="-10px" colorScheme="green" aria-label="remove Image" icon={<hi_1.HiOutlineStatusOnline />}/>
        </react_2.Avatar>
      </react_2.Center>
      <react_2.Center w="full" className={"relative"}>
        <components_1.SingleUploadFile onComplete={handleComplete} label={"Change avatar"}/>
      </react_2.Center>
    </react_2.Stack>);
}
