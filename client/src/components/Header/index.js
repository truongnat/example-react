"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Header;
const react_1 = __importDefault(require("react"));
const react_2 = require("@chakra-ui/react");
const Logo_1 = __importDefault(require("./Logo"));
const TabHeader_1 = __importDefault(require("./TabHeader"));
const MenuUserDropdown_1 = __importDefault(require("./MenuUserDropdown"));
function Header() {
    return (<div className='w-full'>
      <react_2.Box bg={(0, react_2.useColorModeValue)('gray.100', 'gray.900')} px={4}>
        <react_2.Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
          <Logo_1.default />
          <TabHeader_1.default />
          {/* <SearchHeader /> */}
          <react_2.Flex alignItems={'center'}>
            <react_2.Stack direction={'row'} spacing={7}>
              {/* <HeaderModeTheme /> */}
              <MenuUserDropdown_1.default />
            </react_2.Stack>
          </react_2.Flex>
        </react_2.Flex>
      </react_2.Box>
    </div>);
}
