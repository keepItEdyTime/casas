import { Button } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';
import ReactImageGallery, { ReactImageGalleryItem } from 'react-image-gallery';



const ImgsModal = (props: { images: ReactImageGalleryItem[], show: boolean, onHide: () => void, handleFullScreen: (v: boolean) => void }) => {

    // const [loading, setLoading] = useState(true)

    return (

        <Modal
            //  {...props}
            show={props.show}
            onHide={props.onHide}
            backdrop
            // size="sm"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            scrollable
            className='rounded-0'

        >
            <Modal.Header
                className='p-0 bg-dark'
            >
            </Modal.Header>
            <Modal.Body className='rounded-0 bg-dark p-0'>

                <ReactImageGallery
                    items={props.images}
                    autoPlay={false}
                    showThumbnails={false}
                    thumbnailPosition={'bottom'}
                    onScreenChange={props.handleFullScreen}
                />


                <div className="d-flex justify-content-end">
                    <Button variant='danger' className='rounded-0' onClick={props.onHide}>Fechar</Button>
                </div>

            </Modal.Body>
        </Modal>
    )
}

export default ImgsModal