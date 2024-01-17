import { Modal, ModalContent, Image } from '@nextui-org/react'
import { YandeImage } from '../interfaces/image'

interface Props {
  isOpen: boolean
  onOpenChange: () => void
  image: YandeImage | undefined
}

export default function ModalImage(props: Props): React.ReactElement {
  const { isOpen, onOpenChange, image } = props
  const modalSize = {
    width: 0,
    height: 0,
  }

  // 调整模态框大小不超过屏幕
  const resizeModal = (width: number = 0, height: number = 0) => {
    const { innerHeight, innerWidth } = window
    const ratio = width / height
    const resizeWidth = Math.min(innerWidth * 0.9, width)
    const resizeHeight = Math.min(innerHeight * 0.9, height)
    if (resizeHeight * ratio > resizeWidth) {
      modalSize.width = resizeWidth
      modalSize.height = resizeWidth / ratio
    } else {
      modalSize.width = resizeHeight * ratio
      modalSize.height = resizeHeight
    }
  }

  resizeModal(image?.sample_width, image?.sample_height)

  return (
    <>
      {image && (
        <Modal
          backdrop="blur"
          hideCloseButton={true}
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          style={{ maxWidth: modalSize.width, height: modalSize.height }}
        >
          <ModalContent>
            <Image src={image.sample_url} />
            {/* <div className="absolute w-10 h-10 z-10 top-1/2 -translate-y-1/2">
              <Button isIconOnly variant="light">
                <span className="material-symbols-rounded">
                  arrow_back_ios_new
                </span>
              </Button>
            </div>
            <div className="absolute w-10 h-10 z-10 top-1/2 right-0 -translate-y-1/2">
              <Button isIconOnly variant="light">
                <span className="material-symbols-rounded">
                  arrow_forward_ios
                </span>
              </Button>
            </div> */}
          </ModalContent>
        </Modal>
      )}
    </>
  )
}
