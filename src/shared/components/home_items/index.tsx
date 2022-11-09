import React from 'react'

interface IHomeItemsProps {
    label: string,
    value: string | number
}

const HomeItems: React.FC<IHomeItemsProps> = ({ label, value }) => {
    return (
        <div className="info-item border-success mb-3 text-bg-light border-bottom row">
            <div className="info-label col-7">{label}</div>
            <div className="info-value col-5 text-center "> <span className='info-text rounded-pill text-bg-light my-2 px-2'>{value}</span></div>
        </div>
    )
}

export default HomeItems