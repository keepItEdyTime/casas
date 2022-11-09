import { faHome } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from 'react-toastify';
import { RoutesConstants } from "../../../helpers/routes_constants";
import ButtonPrimaryForm from "../../../shared/components/button_primary_form";
import { useAuth } from "../../../shared/hooks/auth_hook";
import { IAuthModel, IUserLoginBodyModel, IUserLoginErrorsModel, IUserSingUpBodyModel, IUserSingUpErrorsModel } from "../../../shared/services/models/auth_model";
import authRepository from "../../../shared/services/repository/auth_repository";
import './login.css';

interface ILoginInputs {
    inputs: IUserLoginBodyModel,
    errors?: IUserLoginErrorsModel
}

const Login = () => {

    const { setAuth } = useAuth()
    const navigate = useNavigate()

    const [loading, setLoading] = useState(false);
    const [inputs, setInputs] = useState<ILoginInputs>({
        errors: undefined,
        inputs: {
            email: '',
            password: '',
        }
    } as ILoginInputs)

    function handleSubmit(event: FormEvent) {
        event.preventDefault()

        setLoading(true)

        let data = {
            email: inputs.inputs.email as string,
            password: inputs.inputs.password as string
        }

        authRepository
            .login(data)
            .then(response => {

                let responseData = response.data.data as IAuthModel

                // console.log(data, ApiConstants.adminRole, typeof data.user?.role)
                // if(data.user?.role  == ApiConstants.adminRole){
                localStorage.setItem('token', responseData.token as string)
                toast.success('Logado com sucesso!')
                // console.log(responseData.token)
                
                setTimeout(() => {
                    setAuth(responseData)
                    navigate(RoutesConstants.home, { replace: true })
                }, 2000)
                // }else{
                //     toast.error('Acesso não autorizado!')
                // }

            }).catch(reject => {
                console.log(reject)
                if (reject.data) {//if exist data
                    toast.error(reject.data.message)
                    setInputs(old => ({ ...old, errors: reject.data.errors, }))
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
                <div className="col-lg-4 shadow p-3 bg-body rounded">
                    <div className="info-login d-flex align-items-center flex-column">
                        <div className="logo">
                            {/* <img src={logoImg} alt={'lanchonete preto no branco logo'} className="img-fluid img-thumbnail border-0" /> */}
                        </div>
                        <div className="app-name">
                            Login
                        </div>
                    </div>
                    <form onSubmit={handleSubmit}>

                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">Email</label>
                            <input type="email" value={inputs.inputs.email} onChange={(e) => setInputs(old => ({ ...old, inputs: { ...old.inputs, email: e.target.value } }))} className="form-control rounded-0" id="email" required />
                            <div id="emailHelp" className="form-text text-danger">
                                {inputs?.errors?.email}
                            </div>
                        </div>

                        <div className="mb-3">
                            <label htmlFor="password" className="form-label">Senha</label>
                            <input type="password" value={inputs.inputs.password} onChange={(e) => setInputs(old => ({ ...old, inputs: { ...old.inputs, password: e.target.value } }))} className="form-control rounded-0" id="password" required />
                            <div id="emailHelp" className="form-text text-danger">
                                {inputs?.errors?.password}
                            </div>
                        </div>
                        <div>
                            {inputs?.errors?.message}
                        </div>
                        <div className="text-end mb-1">
                            <Link to={RoutesConstants.passwordRecoverEmail}>Esqueci a senha</Link>
                        </div>

                        <div className="d-flex justify-content-end">
                            <ButtonPrimaryForm isLoading={loading} text={'Entrar'} />
                        </div>
                        <div className="">
                            <Link to={RoutesConstants.register}>Não tenho uma conta</Link>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
}

export default Login;