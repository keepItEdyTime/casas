import { faFile, faFill, faHome, faHouseUser, faKey, faMagic, faMailBulk, faPersonCane, faPersonChalkboard, faPhone, faRegistered, faSadCry, faSearch, faSignIn, faSignOut, faStar, faUpload, faUser, faUserCheck } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useState } from 'react'
import { Button } from 'react-bootstrap'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { toast, ToastContainer } from 'react-toastify'
import { RoutesConstants } from '../../../helpers/routes_constants'
import { useAuth } from '../../hooks/auth_hook'
import authRepository from '../../services/repository/auth_repository'
import ConfirmDialog from '../confirm_dialog'
import Loading from '../loading/loading'

import './index.css'

const NavBar = () => {

  const { auth, setAuth } = useAuth()
  const navigation = useNavigate()
  const [loading, setLoading] = useState(false)

  function styleActiveLink({ isActive }: { isActive: boolean }): React.CSSProperties {
    return isActive ? {
      color: '#000',
      borderBottomWidth: 2,
      borderBottomColor: '#000',
      borderBottomStyle: 'solid',
    } : {}
  }

  function handleLogOut() {
    // alert(id)
    ConfirmDialog({
      title: 'Confirmar',
      message: 'Deseja sair da conta?',
      onConfirm: () => {
        setLoading(true)
        authRepository
          .logout()
          .then(Response => {

            toast.success('Saiu com sucesso!')

            navigation(RoutesConstants.home)
            setAuth(undefined)

          })
          .catch(reject => {
            console.log(reject)
            if (reject.status === 0)
              toast.error('Erro de conexao!')
            toast.error('Erro ao remover')
          }).finally(() => {
            setLoading(false)
          })
      }
    })
  }

  return (
    <div className='sticky-top'>
      <ToastContainer />

      {loading && <Loading />}
      <div className="text-bg-dark">
        <div className="container-fluid row">
          <div className="col-md-8">
            <div className="d-inline">
              <FontAwesomeIcon icon={faMailBulk} className='me-2' />
              empresa@gmail.com
            </div>
            <div className="d-inline ms-3">
              <FontAwesomeIcon icon={faPhone} className='me-2' />
              8478846556
            </div>
          </div>
          {
            auth?.user &&
            <div className="col-md-4 text-md-end">
              <FontAwesomeIcon icon={faUserCheck} />
              <div className="d-inline ms-2">
                {auth?.user?.name}
              </div>
            </div>
          }
        </div>
      </div>
      <nav className="navbar navbar-expand-lg text-bg-light p-0">
        <div className="container-fluid">
          <Link className="navbar-brand" to={RoutesConstants.home}>Casas</Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target='#navbarNavDropdown' >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse justify-content-center" id="navbarNavDropdown">
            <ul className="navbar-nav nav-left-center">
              <li className="nav-item ">
                <NavLink style={styleActiveLink} className="nav-link h-100 p-2" aria-current="page" to={RoutesConstants.home}>
                  <FontAwesomeIcon icon={faHome} className={'me-2'} />
                  Inicio
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink style={styleActiveLink} className="nav-link h-100 p-2" to={RoutesConstants.homeSearch}>
                  <FontAwesomeIcon icon={faSearch} className={'me-2'} />
                  Descobrir
                </NavLink>
              </li>
              {
                auth?.user &&
                <li className="nav-item">
                  <NavLink style={styleActiveLink} className="nav-link h-100 p-2" to={RoutesConstants.favorits}>
                    <FontAwesomeIcon icon={faStar} className={'me-2'} />
                    Favoritos
                  </NavLink>
                </li>
              }
              <li className="nav-item">
                <NavLink style={styleActiveLink} className="nav-link h-100 p-2" to={RoutesConstants.manageAnounce}>
                  <FontAwesomeIcon icon={faUpload} className={'me-2'} />
                  Anunciar casa
                </NavLink>
              </li>
              <li className="nav-item dropdown">
                <Link to='#' className="nav-link dropdown-toggle" role={'button'} data-bs-toggle='dropdown' >
                  <div className="account-icon d-inline">
                    <FontAwesomeIcon icon={faPersonChalkboard} className='me-2' />
                    Suporte
                  </div>
                </Link>
                <ul className="dropdown-menu rounded-0 border-0 shadow ">
                  <li>
                    <Link className="dropdown-item" to={RoutesConstants.manage}>
                      <FontAwesomeIcon icon={faPersonCane} className={'me-2'} />
                      Ajuda
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to={RoutesConstants.account}>
                      <FontAwesomeIcon icon={faMagic} className={'me-2'} />
                      Sobre nós
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="#">
                      <FontAwesomeIcon icon={faFile} className={'me-2'} />
                      Termos e condições
                    </Link>
                  </li>
                </ul>
              </li>

              {
                auth?.user &&

                <li className="nav-item dropdown">
                  <Link to='#' className="nav-link dropdown-toggle" role={'button'} data-bs-toggle='dropdown' >
                    <div className="account-icon d-inline">
                      <FontAwesomeIcon icon={faUser} />
                    </div>
                  </Link>
                  <ul className="dropdown-menu rounded-0 border-0 shadow ">
                    <li>
                      <Link className="dropdown-item" to={RoutesConstants.manage}>
                        <FontAwesomeIcon icon={faKey} className={'me-2'} />
                        Gerir casas
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item" to={RoutesConstants.account}>
                        <FontAwesomeIcon icon={faHouseUser} className={'me-2'} />
                        Minha conta
                      </Link>
                    </li>
                    <li>
                      <Button onClick={() => handleLogOut()} className="dropdown-item btn-none" >
                        <FontAwesomeIcon icon={faSignOut} className={'me-2'} />
                        Sair
                      </Button>
                    </li>
                  </ul>
                </li>
              }

            </ul>
            {
              !auth?.user &&
              <div className='nav-right-center '>
                <div className="d-flex justify-content-lg-end text-muted">
                  <Link className="nav-link h-100 p-2" to={RoutesConstants.login}>
                    <FontAwesomeIcon icon={faSignIn} className={'me-2'} />
                    Login
                  </Link>
                  <Link className="nav-link h-100 p-2" to={RoutesConstants.register}>
                    <FontAwesomeIcon icon={faFill} className={'me-2'} />
                    Registrar
                  </Link>
                </div>
              </div>
            }
          </div>
        </div>
      </nav>
    </div>
  )
}

export default NavBar