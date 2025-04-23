"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = FormSelectParticipants;
const react_1 = __importStar(require("react"));
const react_2 = require("@chakra-ui/react");
const ai_1 = require("react-icons/ai");
const notiflix_1 = require("notiflix");
const services_1 = require("./../../services");
const constants_1 = require("../../constants");
function FormSelectParticipants({ onNext }) {
    const [textSearch, setTextSearch] = (0, react_1.useState)("");
    const [loading, setLoading] = (0, react_1.useState)(false);
    const [users, setUsers] = (0, react_1.useState)([]);
    const [selected, setSelected] = (0, react_1.useState)([]);
    function handleSearchUser() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                setLoading(true);
                const response = yield services_1.serviceClient._userService.searchUser(textSearch);
                setLoading(false);
                setSelected([]);
                if ((response === null || response === void 0 ? void 0 : response.status) === constants_1.StatusCode.Success) {
                    setUsers(response.data.data);
                }
            }
            catch (e) {
                setLoading(false);
                notiflix_1.Notify.failure(e.message);
            }
        });
    }
    const handleNextForm = () => {
        onNext({ participants: selected });
    };
    return (<react_2.Box>
      <react_2.Flex className="w-full">
        <react_2.InputGroup className="">
          <react_2.Input placeholder="Search user" value={textSearch} onChange={(e) => setTextSearch(e.target.value)}/>
          <react_2.InputRightElement className="cursor-pointer" children={loading ? (<react_2.Spinner />) : (<ai_1.AiOutlineSearch onClick={handleSearchUser}/>)}/>
        </react_2.InputGroup>
      </react_2.Flex>
      <react_2.Flex className="mt-5">
        <react_2.CheckboxGroup colorScheme="green" value={selected} onChange={(value) => setSelected(value)}>
          <react_2.Stack>
            {users.length > 0 ? (users.map((u) => (<react_2.Checkbox key={u._id} value={u._id}>
                  {(u === null || u === void 0 ? void 0 : u.username) || u.email}
                </react_2.Checkbox>))) : (<div>No participant selected</div>)}
          </react_2.Stack>
        </react_2.CheckboxGroup>
      </react_2.Flex>

      <react_2.Flex className="mt-5 justify-end">
        <react_2.Button size="sm" onClick={handleNextForm} isDisabled={!selected.length}>
          Next
        </react_2.Button>
      </react_2.Flex>
    </react_2.Box>);
}
