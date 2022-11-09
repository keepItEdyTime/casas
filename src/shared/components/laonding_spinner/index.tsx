import React from 'react'

const LoadingSpinner = ({isSmall}:{isSmall?: boolean}) => {
    return (
        <div className={`spinner-border ${isSmall && 'spinner-border-sm'} text-danger`} role="status">
            <span className="visually-hidden">Loading...</span>
        </div>
    )
}

export default LoadingSpinner