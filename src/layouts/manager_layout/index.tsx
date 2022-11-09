import { faList } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useEffect, useState } from 'react'
import { Link, Outlet } from 'react-router-dom'
import { RoutesConstants } from '../../helpers/routes_constants'
import './index.css'

const ManagerLayout = () => {

    const [sideOpen, setSideOpen] = useState(false)

    function handleClick() {
        if (window.screen.width < 1024)
            setSideOpen(false)
    }

    useEffect(() => {
        if (window.screen.width > 1023)
            setSideOpen(true)
    }, [])


    return (
        <div>
            <div className='manage-layout'>
                <div className='manage-side-bar text-bg-dark' style={{ width: sideOpen ? '300px' : '0px' }}>
                    <div className="text-end" >
                        <button onClick={() => setSideOpen(old => !old)} className='text-bg-dark m-btn-close py-2 px-3'>
                            <FontAwesomeIcon icon={faList} />
                        </button>
                    </div>
                    <div className={`${sideOpen ? `d-flex flex-column ` : `d-none`} sticky-links pt-5`}>
                        <Link onClick={() => handleClick()} to={RoutesConstants.manageAnounce}> Anunciar </Link>
                        <Link onClick={() => handleClick()} to={RoutesConstants.manage}> Publicadas </Link>
                        <Link onClick={() => handleClick()} to={RoutesConstants.managepeddings}> Pendentes </Link>
                        <Link onClick={() => handleClick()} to={RoutesConstants.manageHistory}> Historico </Link>
                    </div>
                </div>
                <div className='w-100 py-2 px-3'>
                    <Outlet />
                </div>
            </div>
        </div>
    )
}

export default ManagerLayout