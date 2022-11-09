import React from 'react'
import './index.css'

const Title = ({ text }: { text: string }) => {
    return (
        <div className="text-center">
            <span className="h2 border-title">
                {text}
            </span>
        </div>
    )
}

export default Title