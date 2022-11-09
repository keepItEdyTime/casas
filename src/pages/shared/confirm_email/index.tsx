import { faHome } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast, ToastContainer } from 'react-toastify'
import { RoutesConstants } from '../../../helpers/routes_constants'
import ButtonPrimary from '../../../shared/components/buttom_primary'
import LoadingSpinner from '../../../shared/components/laonding_spinner'
import authRepository from '../../../shared/services/repository/auth_repository'



const ConfirmEmailPage = () => {

    const [loading, setLoading] = useState(true)
    const navigation = useNavigate()

    useEffect(() => {

        // (
        //     async () => {
        //       //  await sendEmail()
        //     }
        // )()

    }, [])

    async function sendEmail() {
        setLoading(true)
        authRepository
            .sendEmailNotification()
            .then(response => {
                console.log(response)
            })
            .catch(reject => {
                console.log(reject)
            })
            .finally(() => {
                setLoading(false)
            })
    }

    function handleRemoveAccount(password: string) {
        authRepository
            .remove({ password: '12345678' })
            .then(Response => {
                console.log(Response)
                toast.success('Conta removida com sucesso!')

                setTimeout(() => {
                    navigation(RoutesConstants.login)
                }, 1000)
            })
            .catch(reject => {
                console.log(reject)
                if (reject.status === 0) {
                    toast.error('Erro de conexao!')
                } else if (reject.status === 500) {
                    toast.error('Sem alterações!')
                }
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
                {
                    loading ?
                        <LoadingSpinner />
                        :
                        <div className="col-lg-5 shadow p-3 text-bg-dark rounded-0">
                            <div className="info-login d-flex align-items-center flex-column">
                                <div className="logo">
                                    {/* <img src={logoImg} alt={'lanchonete preto no branco logo'} className="img-fluid img-thumbnail border-0" /> */}
                                </div>
                                <div className="app-name">
                                    Verificação do E-mail
                                </div>
                            </div>
                            <div>
                                <div className="alert alert-dark">
                                    Enviamos a mensagem de confirmação no seu e-mail,
                                    verifique para validar a conta!
                                </div>
                                <div className='d-flex justify-content-center'>
                                    <div className="me-2">
                                        <ButtonPrimary onPress={() => {handleRemoveAccount('12345678')}} isLoading={false} text='Cancelar o cadastro' />
                                    </div>
                                    <ButtonPrimary onPress={() => { sendEmail() }} isLoading={false} text='Enviar novemante' />
                                </div>
                            </div>
                        </div>
                }
            </div>
        </div>
    )
}

export default ConfirmEmailPage