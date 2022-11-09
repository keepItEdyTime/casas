import React from 'react'
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import

interface IConfirmDialogProps {
    title: string,
    message: string,
    onConfirm: () => void,
    onCancel?: () => void
}

function ConfirmDialog({ title, message, onConfirm, onCancel }: IConfirmDialogProps) {
    return confirmAlert({
        closeOnClickOutside: false,

        customUI: ({ onClose }) => {
            return (
                <div className='text-bg-dark p-4 w-60'>

                    <div className=''>
                        <h1>{title}</h1>
                        <p>{message}</p>
                        <div className="d-flex -justufy-content-between">
                            <button className='btn btn-outline-danger rounded-0'
                                onClick={() => {
                                    if (onCancel) {
                                        onCancel();
                                    }
                                    onClose()
                                }}>
                                cancelar
                            </button>
                            <button
                                className='btn btn-danger rounded-0 mx-3'
                                onClick={() => {
                                    onConfirm()
                                    onClose();
                                }}
                            >
                                Confirmar
                            </button>
                        </div>
                    </div>

                </div>
            );
        }
    });

}

export default ConfirmDialog