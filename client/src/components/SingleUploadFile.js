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
exports.default = SingleUploadFile;
const react_1 = __importDefault(require("react"));
const react_2 = require("@chakra-ui/react");
const utils_1 = require("../utils");
const react_redux_1 = require("react-redux");
const selector_1 = require("../redux/selector");
const notiflix_notify_aio_1 = require("notiflix/build/notiflix-notify-aio");
function SingleUploadFile({ onComplete, label }) {
    const dataUser = (0, react_redux_1.useSelector)(selector_1.userSelector);
    const onChangeFile = (e) => __awaiter(this, void 0, void 0, function* () {
        if (!e.target.files || (e.target.files && !e.target.files.length)) {
            notiflix_notify_aio_1.Notify.failure("Something went wrong load file!", {
                position: "center-top",
            });
            return;
        }
        let imgFile = e.target.files[0];
        let validFile = ["image/png", "image/jpeg"].includes(imgFile.type);
        if (!validFile) {
            notiflix_notify_aio_1.Notify.failure("File includes .png | .jpg !", {
                position: "center-top",
            });
            return;
        }
        const link = yield (0, utils_1.uploadFileFirebase)(dataUser.user._id, imgFile);
        onComplete(link);
    });
    return (<div className={"w-full"}>
      <react_2.Button as={react_2.FormLabel} htmlFor="upload" className="w-full">
        {label}
      </react_2.Button>
      <input type={"file"} id="upload" hidden onChange={onChangeFile} value={""}/>
    </div>);
}
