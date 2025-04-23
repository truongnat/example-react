"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = CreateRoomForm;
const react_1 = require("@chakra-ui/react");
const react_2 = require("react");
const react_redux_1 = require("react-redux");
const fi_1 = require("react-icons/fi");
const ai_1 = require("react-icons/ai");
const md_1 = require("react-icons/md");
const chakra_ui_steps_1 = require("chakra-ui-steps");
const FormRoomName_1 = __importDefault(require("./FormRoomName"));
const FormSelectParticipants_1 = __importDefault(require("./FormSelectParticipants"));
const ConfirmCreateRoom_1 = __importDefault(require("./ConfirmCreateRoom"));
function CreateRoomForm({ isOpen, onClose }) {
    const dispatch = (0, react_redux_1.useDispatch)();
    const [loading, setLoading] = (0, react_2.useState)(false);
    const [roomForm, setRoomForm] = (0, react_2.useState)({
        name: "",
        participants: [],
    });
    const { nextStep, reset, activeStep } = (0, chakra_ui_steps_1.useSteps)({
        initialStep: 0,
    });
    const steps = [
        { label: "Room name", icon: md_1.MdMeetingRoom },
        { label: "Participants", icon: fi_1.FiUsers },
        { label: "Submit", icon: ai_1.AiOutlineFileDone },
    ];
    function handleNextForm(data) {
        setRoomForm(Object.assign(Object.assign({}, roomForm), data));
        nextStep();
    }
    function submitCreateForm() {
        console.log("show data : ", roomForm);
    }
    function handleCloseModal() {
        setRoomForm({
            name: "",
            participants: [],
        });
        onClose();
        reset();
    }
    return (<react_1.Modal isCentered size={"2xl"} isOpen={isOpen} onClose={handleCloseModal} closeOnOverlayClick={false} closeOnEsc={false}>
      <react_1.ModalOverlay />
      <react_1.ModalContent>
        <react_1.ModalHeader>Create Room Chat</react_1.ModalHeader>
        <react_1.ModalCloseButton />
        <react_1.ModalBody pb={6}>
          <chakra_ui_steps_1.Steps activeStep={activeStep}>
            {steps.map(({ label, icon }, index) => (<chakra_ui_steps_1.Step label={label} key={label} icon={icon}>
                <div className="mt-6">
                  {index === 0 && <FormRoomName_1.default onNext={handleNextForm}/>}
                  {index === 1 && (<FormSelectParticipants_1.default onNext={handleNextForm}/>)}
                  {index === 2 && (<ConfirmCreateRoom_1.default loading={loading} onSubmit={submitCreateForm}/>)}
                </div>
              </chakra_ui_steps_1.Step>))}
          </chakra_ui_steps_1.Steps>
        </react_1.ModalBody>
      </react_1.ModalContent>
    </react_1.Modal>);
}
