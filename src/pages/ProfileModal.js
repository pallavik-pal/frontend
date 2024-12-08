import {
  Button,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";

const ProfileModal = ({ user, onClose }) => {
  return (
    <Modal size="lg" onClose={onClose} isOpen={true} isCentered>
      <ModalOverlay />
      <ModalContent h="410px">
        <ModalHeader
          fontSize="40px"
          fontFamily="Work sans"
          d="flex"
          justifyContent="center"
        >
          {user.name}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody
          d="flex"
          flexDir="column"
          alignItems="center"
          justifyContent="space-between"
        >
          <Image
            borderRadius="full"
            boxSize="150px"
            src={user.pic}
            alt={user.name}
          />
          <Text fontSize={{ base: "28px", md: "30px" }} fontFamily="Work sans">
            Email: {user.email}
          </Text>
        </ModalBody>
        <ModalFooter>
          <Button onClick={onClose}>Close</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ProfileModal;
