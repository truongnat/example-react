"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SideFilter;
const react_1 = __importDefault(require("react"));
const react_2 = require("@chakra-ui/react");
const ti_1 = require("react-icons/ti");
const vsc_1 = require("react-icons/vsc");
const md_1 = require("react-icons/md");
const io5_1 = require("react-icons/io5");
const actions_1 = require("../../redux/actions");
const react_redux_1 = require("react-redux");
const selector_1 = require("../../redux/selector");
const constants_1 = require("../../constants");
function SideFilter() {
    const dispatch = (0, react_redux_1.useDispatch)();
    const { status } = (0, react_redux_1.useSelector)(selector_1.todoSelector);
    function filterTodo(status = "") {
        dispatch((0, actions_1.genericAction)(actions_1.GET_ALL_TODO, actions_1.ENUM_STATUS.FETCHING, { status }));
    }
    function resolveVariant(status, match) {
        return status === match ? "solid" : "outline";
    }
    return (<react_2.Flex className="w-full sm:w-4/12 flex-col p-5 border rounded-md">
      <react_2.Heading className="mb-5" as="h2" bgClip="text" bgGradient="linear(to-r, teal.500, green.500)" size="md">
        Side Filter
      </react_2.Heading>
      <div className="flex flex-col items-start justify-start space-y-5">
        <react_2.Button onClick={() => filterTodo(constants_1.ENUM_STATUS_TODO.INIT)} variant={resolveVariant(status, constants_1.ENUM_STATUS_TODO.INIT)} leftIcon={<ti_1.TiThSmall />} colorScheme="teal">
          All
        </react_2.Button>
        <react_2.Button onClick={() => filterTodo(constants_1.ENUM_STATUS_TODO.TODO)} leftIcon={<md_1.MdOutlineWorkOutline />} colorScheme="teal" variant={resolveVariant(status, constants_1.ENUM_STATUS_TODO.TODO)}>
          Todo
        </react_2.Button>
        <react_2.Button onClick={() => filterTodo(constants_1.ENUM_STATUS_TODO.REVIEW)} leftIcon={<vsc_1.VscPreview />} colorScheme="teal" variant={resolveVariant(status, constants_1.ENUM_STATUS_TODO.REVIEW)}>
          Review
        </react_2.Button>
        <react_2.Button onClick={() => filterTodo(constants_1.ENUM_STATUS_TODO.DONE)} leftIcon={<vsc_1.VscCheckAll />} colorScheme="teal" variant={resolveVariant(status, constants_1.ENUM_STATUS_TODO.DONE)}>
          Completed
        </react_2.Button>

        <react_2.Button onClick={() => filterTodo(constants_1.ENUM_STATUS_TODO.KEEPING)} leftIcon={<io5_1.IoPlaySkipForwardOutline />} colorScheme="teal" variant={resolveVariant(status, constants_1.ENUM_STATUS_TODO.KEEPING)}>
          Skipped
        </react_2.Button>
      </div>
    </react_2.Flex>);
}
