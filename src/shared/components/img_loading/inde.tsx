import { faImage } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import './index.css'

const ImgLoading = () => {
    return (
        <div className="img-loading-bg d-flex flex-column justify-content-center align-items-center">
            <FontAwesomeIcon icon={faImage} className='icon-img' />
            <div className="spinner-border text-dark" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>
    )
}

export default ImgLoading