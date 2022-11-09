import React from 'react'
import { Link } from 'react-router-dom'
import { RoutesConstants } from '../../../helpers/routes_constants'

const BreadCrumb = () => {
    return (
        <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
                <li className="breadcrumb-item"><Link to={RoutesConstants.home}>Home</Link></li>
                <li className="breadcrumb-item active" aria-current="page">Aluguel</li>
                <li className="breadcrumb-item active" aria-current="page">Descobrir casas</li>
            </ol>
        </nav>
    )
}

export default BreadCrumb