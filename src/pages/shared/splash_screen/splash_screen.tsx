import React from 'react'
import logoImg from '../../../../assets/images/logo_small.png'


const SplashScreen = () => {
    return (
        <div className="vh-100">
            <div className="row justify-content-center align-items-center h-100">
                <div className="col-5">
                    <div className="logo text-center">
                        <img src={logoImg} alt="logo" className='img-fluid img-thumbnail border-0' />
                    </div>
                    <div className="text-center mt-3">
                        <div className="spinner-border text-danger" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SplashScreen