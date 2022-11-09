import React from 'react'

interface IButtonPrimaryFormProps {
    text: string,
    isLoading: boolean,
    styleStatic?: string,
    styleLoading?: string
}

const ButtonPrimaryForm: React.FC<IButtonPrimaryFormProps> = ({text, isLoading, styleLoading, styleStatic }) => {
    return (
        <>
            {
                isLoading ?
                    <button className="btn btn-outline-dark rounded-0 d-flex align-items-center" disabled>
                        <div className="spinner-border spinner-border-sm text-danger me-2" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                        Processando...
                    </button>
                    :
                    <button type="submit" className="btn btn-dark rounded-0">{text}</button>
            }
        </>

    )
}

export default ButtonPrimaryForm