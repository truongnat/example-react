import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { FiUsers } from "react-icons/fi";
import { AiOutlineFileDone } from "react-icons/ai";
import { MdMeetingRoom } from "react-icons/md";
import { Step, Steps, useSteps } from "chakra-ui-steps";
import FormRoomName from "./FormRoomName";
import FormSelectParticipants from "./FormSelectParticipants";
import ConfirmCreateRoom from "./ConfirmCreateRoom";

export default function CreateRoomForm({ isOpen, onClose }) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [roomForm, setRoomForm] = useState({
    name: "",
    participants: [],
  });

  const { nextStep, reset, activeStep } = useSteps({
    initialStep: 0,
  });

  const steps = [
    { label: "Room name", icon: MdMeetingRoom },
    { label: "Participants", icon: FiUsers },
    { label: "Submit", icon: AiOutlineFileDone },
  ];

  function handleNextForm(data) {
    setRoomForm({
      ...roomForm,
      ...data,
    });
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

  return (
    <Modal
      isCentered
      size={"2xl"}
      isOpen={isOpen}
      onClose={handleCloseModal}
      closeOnOverlayClick={false}
      closeOnEsc={false}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create Room Chat</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <Steps activeStep={activeStep}>
            {steps.map(({ label, icon }, index) => (
              <Step label={label} key={label} icon={icon}>
                <div className="mt-6">
                  {index === 0 && <FormRoomName onNext={handleNextForm} />}
                  {index === 1 && (
                    <FormSelectParticipants onNext={handleNextForm} />
                  )}
                  {index === 2 && (
                    <ConfirmCreateRoom
                      loading={loading}
                      onSubmit={submitCreateForm}
                    />
                  )}
                </div>
              </Step>
            ))}
          </Steps>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
