"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = MenuUserDropdown;
const react_1 = require("@chakra-ui/react");
const react_2 = __importDefault(require("react"));
const react_redux_1 = require("react-redux");
const react_router_dom_1 = require("react-router-dom");
const constants_1 = require("../../constants");
const actions_1 = require("../../redux/actions");
const selector_1 = require("../../redux/selector");
const utils_1 = require("../../utils");
function MenuUserDropdown() {
    var _a, _b;
    const history = (0, react_router_dom_1.useHistory)();
    const dispatch = (0, react_redux_1.useDispatch)();
    const dataUser = (0, react_redux_1.useSelector)(selector_1.userSelector);
    const avatarUrl = utils_1.MemoryClient.get("c_avt") || ((_a = dataUser.user) === null || _a === void 0 ? void 0 : _a.avatarUrl) || constants_1.DEFAULT_AVATAR;
    const handleLogout = () => __awaiter(this, void 0, void 0, function* () {
        utils_1.MemoryClient.clearAll();
        history.push(constants_1.PAGE_KEYS.LoginPage);
        dispatch((0, actions_1.genericAction)(actions_1.CHECKING_AUTH, actions_1.ENUM_STATUS.PUSH_NORMAL, false));
    });
    return (<react_1.Menu>
      <react_1.MenuButton as={react_1.Button} rounded={"full"} variant={"link"} cursor={"pointer"} minW={0}>
        <react_1.Avatar size={"sm"} src={avatarUrl}/>
      </react_1.MenuButton>
      <react_1.MenuList alignItems={"center"}>
        <br />
        <react_1.Center>
          <react_1.Avatar size={"2xl"} src={avatarUrl}/>
        </react_1.Center>
        <br />
        <react_1.Center>
          <p>{((_b = dataUser === null || dataUser === void 0 ? void 0 : dataUser.user) === null || _b === void 0 ? void 0 : _b.email) || ""}</p>
        </react_1.Center>
        <br />
        <react_1.MenuDivider />
        <react_1.MenuItem onClick={() => history.push(constants_1.PAGE_KEYS.ProfilePage)}>
          Account Settings
        </react_1.MenuItem>
        <react_1.MenuItem onClick={handleLogout} Cl>
          Logout
        </react_1.MenuItem>
      </react_1.MenuList>
    </react_1.Menu>);
}
