import React from 'react'

const ButtonPrimary = ({ outline, text, isLoading, onPress, color = 'secondary' }: { outline?: boolean, text: string, isLoading: boolean, onPress: () => void, color?: 'secondary' | 'warning' | 'success'|'danger' }) => {

    return (
        <>
            {
                isLoading ?
                    <button  className={`btn ${outline ? 'btn-outline-'+color : 'btn-'+color} rounded-0 d-flex align-items-center`} >
                        <div className="spinner-border spinner-border-sm text-light me-2" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                        Processando...
                    </button>
                    :
                    <button onClick={() => onPress()} className={"btn btn-"+color+" rounded-0"}>{text}</button>
            }
        </>

    )
}

export default ButtonPrimary