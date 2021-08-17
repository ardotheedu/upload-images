import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalFooter,
  ModalBody,
  Image,
  Link,
} from '@chakra-ui/react';

interface ModalViewImageProps {
  isOpen: boolean;
  onClose: () => void;
  imgUrl: string;
}

export function ModalViewImage({
  isOpen,
  onClose,
  imgUrl,
}: ModalViewImageProps): JSX.Element {
  // TODO MODAL WITH IMAGE AND EXTERNAL LINK
  return (
    <Modal isOpen={isOpen} onClose={onClose} >
      <ModalOverlay />
      <ModalContent maxW={600} maxH={900} >
        <ModalBody bgColor="pGray.800" width="100%" padding="0">
          <Image src={imgUrl} />
        </ModalBody>
        <ModalFooter bgColor="pGray.800" justifyContent="flex-start">
          <Link href={imgUrl} isExternal>Abrir original</Link>  
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
