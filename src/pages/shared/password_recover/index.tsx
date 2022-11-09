import { faHome } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useState, FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast, ToastContainer } from 'react-toastify'
import { RoutesConstants } from '../../../helpers/routes_constants'
import ButtonPrimaryForm from '../../../shared/components/button_primary_form'
import { useAuth } from '../../../shared/hooks/auth_hook'
import { IAuthModel } from '../../../shared/services/models/auth_model'
import authRepository from '../../../shared/services/repository/auth_repository'

const PasswordRecover = () => {

    const { setAuth } = useAuth()
    const navigate = useNavigate()

    const [loading, setLoading] = useState(false);
    const [inputs, setInputs] = useState({
        email: '',
        password: '',
        errors: {
            email: '',
            password: ''
        }
    })

    function handleSubmit(event: FormEvent) {
        event.preventDefault()
     

        setLoading(true)

        let data = {
            email: inputs.email,
            password: inputs.password
        }

        authRepository.login(data).then(response => {
            let data = response.data as IAuthModel

            // console.log(data, ApiConstants.adminRole, typeof data.user?.role)
            // if(data.user?.role  == ApiConstants.adminRole){
            localStorage.setItem('token', data.token as string)
            toast.success('Logado com sucesso!')
            //setAuth(data)
            navigate(RoutesConstants.home, { replace: true })
            // }else{
            //     toast.error('Acesso não autorizado!')
            // }

        }).catch(reject => {
            if (reject.data) {//if exist data
                toast.error(reject.data.message)
                setInputs(old => ({ ...old, errors: reject.data.errors }))
            } else if (reject.status === 0) {//if no conexion
                toast.error('Erro de conexão')
            } else
                toast.error('Erro interno!')
        }).finally(() => {
            setLoading(false)
        })

    }

    return (
        <div className="container-fluid vh-100" >
            <ToastContainer />


            <div className="px-3 py-2">
                <Link to={RoutesConstants.home} className='text-dark'>
                    <FontAwesomeIcon icon={faHome} className={'me-2'} />
                    Home
                </Link>
            </div>

            <div className="row h-100 justify-content-center align-items-center">
                <div className="col-lg-5 shadow p-3 bg-body rounded">
                    <div className="info-login d-flex align-items-center flex-column">
                        <div className="logo">
                            {/* <img src={logoImg} alt={'lanchonete preto no branco logo'} className="img-fluid img-thumbnail border-0" /> */}
                        </div>
                        <div className="app-name">
                            Redifinir a senha
                        </div>
                    </div>
                    <form onSubmit={handleSubmit}>

                        <div className="mb-3">
                            <label htmlFor="password" className="form-label">Nova senha</label>
                            <input type="password" onChange={(e) => setInputs(old => ({ ...old, password: e.target.value }))} className="form-control rounded-0" id="password" required />
                            <div id="emailHelp" className="form-text text-danger">
                                {inputs.errors?.password}
                            </div>
                        </div>
                        {/* end confirmar senha */}

                        <div className="mb-3">
                            <label htmlFor="conf-password" className="form-label">Confirmar senha</label>
                            <input type="password" onChange={(e) => setInputs(old => ({ ...old, password: e.target.value }))} className="form-control rounded-0" id="password" required />
                            <div id="emailHelp" className="form-text text-danger">
                                {inputs.errors?.password}
                            </div>
                        </div>
                        {/* end confirmar senha */}

                        <div className="d-flex justify-content-end">
                            <ButtonPrimaryForm isLoading={loading} text={'Confirmar'} />
                        </div>

                        <Link to={RoutesConstants.login}>Cancelar</Link>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default PasswordRecover