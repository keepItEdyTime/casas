import { useEffect } from 'react'
import { faHome } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { FormEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast, ToastContainer } from 'react-toastify'
import { RoutesConstants } from '../../../helpers/routes_constants'
import ButtonPrimaryForm from '../../../shared/components/button_primary_form'
import { IAuthModel, IUserSingUpBodyModel, IUserSingUpErrorsModel } from '../../../shared/services/models/auth_model'
import authRepository from '../../../shared/services/repository/auth_repository'

interface IRegisterInputs {
    inputs: IUserSingUpBodyModel,
    errors?: IUserSingUpErrorsModel
}

const Register = () => {

    const navigate = useNavigate()

    const [loading, setLoading] = useState(false);
    const [inputs, setInputs] = useState<IRegisterInputs>({
        errors: undefined,
        inputs: {
            email: '',
            image: undefined,
            name: '',
            password: '',
            password_confirmation: '',
            phone_number: '',
            phone_number_2: ''
        }
    } as IRegisterInputs)



    function initialize(): void {
        let data = {
            errors: undefined,
            inputs: {
                email: '',
                image: undefined,
                name: '',
                password: '',
                password_confirmation: '',
                phone_number: '',
                phone_number_2: '',
            }
        }
        setInputs(data)

    }

    function handleSubmit(event: FormEvent) {
        event.preventDefault()

        setLoading(true)

        let data = inputs.inputs

        authRepository.register(data).then(response => {

            let responseData = response.data.data as IAuthModel
            // console.log(data, ApiConstants.adminRole, typeof data.user?.role)
            // if(data.user?.role  == ApiConstants.adminRole){

            localStorage.setItem('token', responseData.token as string)
            toast.success('Valide a conta!')
            initialize()
            //setAuth(data)

            setTimeout(() => {
                navigate(RoutesConstants.emailVerification, { replace: true })
            }, 1000)
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
                            Registrar
                        </div>
                    </div>
                    <form onSubmit={handleSubmit}>

                        <fieldset disabled={loading}>
                            <div className="mb-3">
                                <label htmlFor="name" className="form-label">Nome completo</label>
                                <input type="name" value={inputs.inputs.name} onChange={(e) => setInputs(old => ({ ...old, inputs: { ...old.inputs, name: e.target.value } }))} className="form-control rounded-0" id="name" required />
                                <div id="emailHelp" className="form-text text-danger">
                                    {inputs?.errors?.name}
                                </div>
                            </div>
                            {/* end name */}

                            <div className="mb-3">
                                <label htmlFor="email" className="form-label">Email</label>
                                <input type="email" value={inputs.inputs.email} onChange={(e) => setInputs(old => ({ ...old, inputs: { ...old.inputs, email: e.target.value } }))} className="form-control rounded-0" id="email" required />
                                <div id="emailHelp" className="form-text text-danger">
                                    {inputs?.errors?.email}
                                </div>
                            </div>
                            {/* end email */}

                            <div className="row rows-cols-lg-6">
                                <div className="col-lg mb-3">
                                    <label htmlFor="tel1" className="form-label">Numero de celular</label>
                                    <input type="tel" value={inputs.inputs.phone_number} onChange={(e) => setInputs(old => ({ ...old, inputs: { ...old.inputs, phone_number: e.target.value } }))} className="form-control rounded-0" id="tel1" required />
                                    <div id="emailHelp" className="form-text text-danger">
                                        {inputs.errors?.phone_number}
                                    </div>
                                </div>
                                {/* end confirmar tel 1 */}

                                <div className="col-lg mb-3">
                                    <label htmlFor="tel2" className="form-label">Outro numero <span className='text-danger'>(opcional)</span></label>
                                    <input type="tel" value={inputs.inputs.phone_number_2} onChange={(e) => setInputs(old => ({ ...old, inputs: { ...old.inputs, phone_number_2: e.target.value } }))} className="form-control rounded-0" id="tel2" />
                                    <div id="emailHelp" className="form-text text-danger">
                                        {inputs?.errors?.phone_number_2}
                                    </div>
                                </div>
                                {/* end confirmar tel 2 */}
                            </div>


                            <div className="mb-3">
                                <label htmlFor="password" className="form-label">Senha</label>
                                <input type="password" value={inputs.inputs.password} onChange={(e) => setInputs(old => ({ ...old, inputs: { ...old.inputs, password: e.target.value } }))} className="form-control rounded-0" id="password" required />
                                <div id="emailHelp" className="form-text text-danger">
                                    {inputs.errors?.password}
                                </div>
                            </div>
                            {/* end confirmar senha */}

                            <div className="mb-3">
                                <label htmlFor="conf-password" className="form-label">Confirmar senha</label>
                                <input type="password" value={inputs.inputs.password_confirmation} onChange={(e) => setInputs(old => ({ ...old, inputs: { ...old.inputs, password_confirmation: e.target.value } }))} className="form-control rounded-0" id="conf-password" required />
                                <div id="emailHelp" className="form-text text-danger">
                                </div>
                            </div>
                            {/* end confirmar senha */}

                            <Link to={RoutesConstants.login}>Tenho uma conta</Link>

                            <div className="d-flex justify-content-end">
                                <ButtonPrimaryForm isLoading={loading} text={'Registrar'} />
                            </div>
                        </fieldset>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Register