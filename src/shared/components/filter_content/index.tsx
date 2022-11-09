import { faFilter, faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import FilterItemNext from '../filter_item';

interface IFilterContentPropos {
    children: React.ReactNode,
    searchContentBtn?: boolean,
    getFiltersAsUrl: (url: string) => void,
}

const FilterContent: React.FC<IFilterContentPropos> = ({ children, searchContentBtn, getFiltersAsUrl }) => {

    const [modalShow, setModalShow] = useState(false);

    return (

        <>

            {
                searchContentBtn
                    ?
                    <div className="d-flex d-lg-none justify-content-end px-3 py-2">
                        <Button variant='outline-secondary w-100 text-start' className='rounded-0' onClick={() => setModalShow(true)}>
                            <FontAwesomeIcon icon={faSearch} className='me-2' />
                            <span className="">Pesquisar...</span>
                        </Button>
                    </div>
                    :
                    <div className="d-flex justify-content-end">
                        <Button variant='outline-secondary' className='rounded-0' onClick={() => setModalShow(true)}>
                            <FontAwesomeIcon icon={faFilter} className='me-2' />
                            Filtrar os dados
                        </Button>
                    </div>}

            <MyVerticallyCenteredModal
                show={modalShow}
                onHide={() => setModalShow(false)}
                getFiltersAsUrl={getFiltersAsUrl}
            />
            {children}
        </>
    );
}

function MyVerticallyCenteredModal(props: { show: boolean, onHide: () => void, getFiltersAsUrl: (url: string) => void }) {
    return (
        <Modal
            {...props}
            // size="sm"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            scrollable
            className='rounded-0'
        >
            <Modal.Header
                className='p-0 bg-dark'
            >
                <Button variant='danger' className='rounded-0' onClick={props.onHide}>Fechar</Button>
            </Modal.Header>
            <Modal.Body className='rounded-0 bg-danger p-0'>
                <FilterItemNext getFiltersAsUrl={props.getFiltersAsUrl} />
            </Modal.Body>
        </Modal>

    );
}

export default FilterContent
