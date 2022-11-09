import React, { useState } from 'react'
import { Button, Modal } from 'react-bootstrap'

interface IPasswordModalProps {
    show: boolean,
    onHide: () => void,
    getPass: (password?: string, remove?: boolean) => void,
    isToDelete?: boolean
}

interface IInputs {
    password: string,
    error: string
}

const PasswordModal: React.FC<IPasswordModalProps> = (props) => {

    const [inputs, setInputs] = useState<IInputs>({
        password: '',
        error: ''
    } as IInputs)

    function handleSubmit() {
        let password = inputs.password

        if (password.length < 8) {
            setInputs(old => ({ ...old, error: 'Deve ter pelomenos 8 carracteres!' }))
        } else {
            setInputs(old => ({ password: '', error: '' }))
            props.getPass(password, props.isToDelete as boolean)
        }
    }

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
                className='p-0'
            >
            </Modal.Header>
            <Modal.Body className='rounded-0 p-3'>

                <div className="mb-3">
                    <label htmlFor="password" className="form-label text-muted">Digite a sua senha para continuar...</label>
                    <input required type="password" value={inputs.password} onChange={(e) => setInputs(old => ({ password: e.target.value, error: '' }))} placeholder='senha...' className="input-form rounded-0" id="price" />
                    <span className="text-danger">{inputs.error}</span>
                </div>
                {/* end phone_number */}

                <div className="d-flex justify-content-end">
                    <Button variant='secondary' onClick={() => props.onHide()} className='rounded-0 me-2' >Cancelar</Button>
                    <Button variant='danger' onClick={() => handleSubmit()} className='rounded-0' >Continuar</Button>
                </div>
            </Modal.Body>
        </Modal>
    )
}

export default PasswordModal