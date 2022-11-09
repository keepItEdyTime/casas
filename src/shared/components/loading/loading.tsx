import React from 'react'
import './loading.css'

const Loading = () => {
    return (
        <div className='position-fixed bg-color start-0 top-0 bottom-0 vh-100 vw-100 visib'>
            <div className="d-flex justify-content-center align-items-center h-100">
                <div className="text-bg-dark p-3 rounded">
                    <div className="spinner-border text-danger" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Loading