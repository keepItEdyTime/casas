import React from 'react'
import './index.css'

const TitleSecondary = ({ text }: { text: string }) => {
    return (
        <div className='secondary-title h3 mb-3'>
            <span className=''>
                {text}
            </span>
        </div>
    )
}

export default TitleSecondary