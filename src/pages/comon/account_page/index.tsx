import { faEdit, faUserAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { RoutesConstants } from '../../../helpers/routes_constants'
import ButtonPrimaryForm from '../../../shared/components/button_primary_form'
import ConfirmDialog from '../../../shared/components/confirm_dialog'
import PasswordModal from '../../../shared/components/password_modal'
import { useAuth } from '../../../shared/hooks/auth_hook'
import { IAuthModel, IUserEditBodyModel, IUserEditPasswordBodyModel } from '../../../shared/services/models/auth_model'
import authRepository from '../../../shared/services/repository/auth_repository'
import houseRepository from '../../../shared/services/repository/house_repository'
import './index.css'

interface IInputs {
    inputs: IUserEditBodyModel,
    errors?: IUserEditBodyModel
}
interface IInputsPassword {
    inputs: IUserEditPasswordBodyModel,
    errors?: IUserEditPasswordBodyModel
}

const AccountPage = () => {

    const navigation = useNavigate()
    const [fieldsEnabled, setFiledsEnabled] = useState(false)
    const nameInputRef = useRef<HTMLInputElement>(null)
    const { auth, setAuth } = useAuth()
    const [showPassModal, setShowPassModal] = useState({
        show: false,
        isToDelete: false
    })

    const [inputs, setInputs] = useState<IInputs>({
        inputs: {
            name: '',
            phone_number: '',
            phone_number_2: '',
            password: ''
        },
        errors: undefined
    } as IInputs)

    const [passwordInput, setPasswordInput] = useState<IInputsPassword>({
        inputs: {
            password: '',
            new_password: '',
            password_confirmation: '',
        },
        errors: undefined
    } as IInputsPassword)

    const num = useRef(0)
    const [loadingNum, setLoadingNum] = useState(true)
    //const [loading, setLoading] = useState(false)
    const [loadingEdit, setLoadingEdit] = useState(false)
    const [loadingPassEdit, setLoadingPassEdit] = useState(false)


    function initialize() {

        let data: IInputs = {
            inputs: {
                name: auth?.user?.name,
                phone_number: auth?.user?.phone_number,
                phone_number_2: auth?.user?.phone_number_2,
            },
            errors: undefined
        }

        setInputs(old => data)
    }
    function initializePassInp() {

        let data: IInputsPassword = {
            inputs: {
                password: '',
                current_password: '',
                password_confirmation: '',
            },
            errors: undefined
        }

        setPasswordInput(old => data)
    }

    useEffect(() => {

        initialize()

        houseRepository
            .getNumOfAnounced()
            .then(response => {
                if (response.data.data)
                    num.current = response.data.data
                console.log(response.data.data)
            })
            .catch(reject => {
                console.log(reject)
                console.error('erro ao ler o numero!')
            })
            .finally(() => {
                setLoadingNum(false)
            })
    }, [])

    useEffect(() => {
        if (!fieldsEnabled)
            nameInputRef.current?.focus()
    }, [fieldsEnabled])

    function handleRemoveAccount(password: string) {
        // alert(id)
        ConfirmDialog({
            title: 'Confirmar',
            message: 'Tem a certeza de que deseja remover a conta? Todos os seus dados serão removidos!',
            onConfirm: () => {

                setLoadingEdit(true)

                let data = {
                    password: password,
                }

                authRepository
                    .remove(data)
                    .then(Response => {
                        console.log(Response)
                        toast.success('Conta removida com sucesso!')

                        setTimeout(() => {
                            navigation(RoutesConstants.home)
                            setAuth(undefined)
                        }, 2000)
                    })
                    .catch(reject => {
                        console.log(reject)
                        if (reject.status === 0) {
                            toast.error('Erro de conexao!')
                        } else if (reject.status === 500) {
                            toast.error('Sem alterações!')
                        } else if (reject.status === 400) {
                            setInputs(old => ({ ...old, errors: reject.data.errors }))
                        } else {
                            toast.error('Senha invalida!')
                        }
                    }).finally(() => {
                        setLoadingEdit(false)
                    })
            },
            onCancel: () => {
                initialize()
                setFiledsEnabled(false)
            }
        })
    }
    function handleEdit(password: string) {
        // alert(id)
        ConfirmDialog({
            title: 'Confirmar',
            message: 'Tem a certeza salvar as alterações?',
            onConfirm: () => {

                setLoadingEdit(true)

                let data: IUserEditBodyModel = {
                    name: inputs.inputs.name,
                    phone_number: inputs.inputs.phone_number,
                    phone_number_2: inputs.inputs.phone_number_2,
                    password: password,
                }

                authRepository
                    .update(data)
                    .then(Response => {
                        console.log(Response)
                        toast.success('Dados actualizados com sucesso!')

                        let authData: IAuthModel = {
                            ...auth,
                            user: {
                                ...auth?.user,
                                name: data.name,
                                phone_number: data.phone_number,
                                phone_number_2: data.phone_number_2,
                            }
                        }

                        setAuth(authData)
                        setFiledsEnabled(false)
                    })
                    .catch(reject => {
                        console.log(reject)
                        if (reject.status === 0) {
                            toast.error('Erro de conexao!')
                        } else if (reject.status === 500) {
                            toast.error('Sem alterações!')
                        } else if (reject.status === 400) {
                            setInputs(old => ({ ...old, errors: reject.data.errors }))
                        } else {
                            toast.error('Senha invalida!')
                        }
                    }).finally(() => {
                        setLoadingEdit(false)
                    })
            },
            onCancel: () => {
                initialize()
                setFiledsEnabled(false)
            }
        })
    }
    function handleEditPassword(event: React.FormEvent) {

        event.preventDefault()

        ConfirmDialog({
            title: 'Confirmar',
            message: 'Tem a certeza de que deseja alterar a senha?',
            onConfirm: () => {

                setLoadingPassEdit(true)

                let data: IUserEditPasswordBodyModel = {
                    current_password: passwordInput.inputs.current_password,
                    password: passwordInput.inputs.password,
                    password_confirmation: passwordInput.inputs.password_confirmation,
                }

                authRepository
                    .updatePassord(data)
                    .then(Response => {
                        console.log(Response)
                        toast.success('Actualizado com sucesso!')
                        initializePassInp()
                    })
                    .catch(reject => {
                        console.log(reject)
                        if (reject.status === 0) {
                            toast.error('Erro de conexao!')
                        } else if (reject.status === 500) {
                            toast.error('Sem alterações!')
                        } else if (reject.status === 400) {
                            setPasswordInput(old => ({ ...old, errors: reject.data.errors }))
                        } else {
                            toast.error('Senha invalida!')
                        }
                    }).finally(() => {
                        setLoadingPassEdit(false)
                    })
            },
            onCancel: () => {
                initializePassInp()
            }
        })
    }

    function showPasswordModal(data: { event?: React.FormEvent, isToDelete?: boolean }) {
        if (data.event)
            data.event.preventDefault()
        if (data.isToDelete) {
            setShowPassModal(old => ({ isToDelete: true, show: true }))
        } else {
            setShowPassModal(old => ({ isToDelete: false, show: true }))
        }
    }
    function closePasswordModal() {
        setShowPassModal(old => ({ ...old, show: false }))
    }

    function getPass(password?: string, remove?: boolean) {
        if (remove) {
            alert('romove')
            handleRemoveAccount(password as string)
        } else {
            alert('edit')
            handleEdit(password as string)
        }
        setShowPassModal(old => ({ ...old, show: false }))
    }

    function handleEnabled() {
        if (!fieldsEnabled) {
            initialize()
        }
        setFiledsEnabled(old => !old)

    }

    return (
        <div className="container py-4">

            <PasswordModal
                getPass={getPass}
                onHide={closePasswordModal}
                show={showPassModal.show}
                isToDelete={showPassModal.isToDelete}
            />

            <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item"><Link to={RoutesConstants.home}>Home</Link></li>
                    <li className="breadcrumb-item active" aria-current="page">Meu perfil</li>
                </ol>
            </nav>
            <div className="row">
                <div className="col-lg-4">
                    <div className="user-overview d-flex flex-column align-items-center p-3">
                        <div className="user-img">
                            <FontAwesomeIcon icon={faUserAlt} />
                        </div>
                        <div className="info-item border-bottom w-100 d-flex justify-content-between px-3 pt-2">
                            <div className="label">Nome:</div>
                            <div className="value">{auth?.user?.name}</div>
                        </div>
                        <div className="info-item border-bottom w-100 d-flex justify-content-between px-3 pt-2">
                            <div className="label"> criada em:</div>
                            <div className="value">{auth?.user?.created_at}</div>
                        </div>


                        <div className="info-item  text-bg-light w-100 my-3 d-flex justify-content-center align-items-center  px-3 py-3 fs-5">
                            <span className='rounded-pill px-2  text-bg-secondary me-2'>
                                {
                                    loadingNum ?
                                        <div className="spinner-border spinner-border-sm text-light" role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </div>
                                        : num.current as number
                                }
                            </span>
                            publicacoes ja feitas
                        </div>



                        <button onClick={(e) => showPasswordModal({ isToDelete: true })} className='btn btn-outline-secondary rounded-0'>Remover conta</button>
                    </div>
                </div>
                <div className="col-lg-8">

                    {/* <!-- Nav tabs --> */}
                    <ul className="user-info nav nav-pills nav-fill mt-sm-5 mt-lg-0" id="pills-tab" role="tablist">

                        <li className="nav-item " role="presentation">
                            <button className="nav-link active rounded-0 w-100 fw-bold  fs-5" id="nav-user-data-tab" data-bs-toggle="pill" data-bs-target="#user-data">Dados</button>
                        </li>
                        <li className="nav-item" role="presentation">
                            <button className="nav-link rounded-0 w-100 fw-bold fs-5" id="nav-user-password-tab" data-bs-toggle="pill" data-bs-target="#user-password">Actualizar senha</button>
                        </li>

                    </ul>

                    <div className="tab-content  py-3" id="tabContent">

                        <div className="tab-pane show active" id="user-data" role="tabpanel" aria-labelledby="nav-user-data-tab">

                            <div className="text-end">
                                <button onClick={() => handleEnabled()} className='btn btn-warning rounded-0' disabled={fieldsEnabled} >
                                    <FontAwesomeIcon icon={faEdit} />
                                    Editar
                                </button>
                            </div>

                            <form onSubmit={(e) => showPasswordModal({ event: e, isToDelete: false })}>
                                <fieldset disabled={!fieldsEnabled}>

                                    <div className="mb-3">
                                        <label htmlFor="name" className="form-label">Nome</label>
                                        <input required ref={nameInputRef} type="text" value={inputs.inputs.name} onChange={(e) => setInputs(old => ({ ...old, inputs: { ...old.inputs, name: e.target.value } }))} className="input-form rounded-0" id="name" />
                                        <span className="text-danger">
                                            {inputs?.errors?.name}
                                        </span>
                                    </div>
                                    {/* end current name */}

                                    <div className="mb-3">
                                        <label htmlFor="phone1" className="form-label">Numero de celular</label>
                                        <input required type="tel" value={inputs.inputs.phone_number} onChange={(e) => setInputs(old => ({ ...old, inputs: { ...old.inputs, phone_number: e.target.value } }))} className="input-form rounded-0" id="phone1" />
                                        <span className="text-danger">
                                            {inputs?.errors?.phone_number}
                                        </span>
                                    </div>
                                    {/* end current phone 1 */}

                                    <div className="mb-3">
                                        <label htmlFor="phone2" className="form-label">Numero de celular 2</label>
                                        <input required type="tel" value={inputs.inputs.phone_number_2} onChange={(e) => setInputs(old => ({ ...old, inputs: { ...old.inputs, phone_number_2: e.target.value } }))} className="input-form rounded-0" id="phone2" />
                                        <span className="text-danger">
                                            {inputs?.errors?.phone_number_2}
                                        </span>
                                    </div>
                                    {/* end current phone 2 */}


                                    <div className="d-flex justify-content-end">
                                        <button type='reset' onClick={() => handleEnabled()} className='btn btn-outline-secondary me-2 rounded-0'>Cancelar</button>
                                        <ButtonPrimaryForm isLoading={loadingEdit} text='salvar' />
                                    </div>
                                </fieldset>
                            </form>
                        </div>

                        <div className="tab-pane" id="user-password" role="tabpanel" aria-labelledby="nav-user-password-tab">
                            <form onSubmit={handleEditPassword}>

                                <div className="mb-3">
                                    <label htmlFor="old-password" className="form-label">Senha actual</label>
                                    <input required type="password" value={passwordInput.inputs.current_password} onChange={(e) => setPasswordInput(old => ({ ...old, inputs: { ...old.inputs, current_password: e.target.value } }))} className="input-form rounded-0" id="old-password" />
                                    <span className="text-danger">
                                        {passwordInput?.errors?.current_password}
                                    </span>
                                </div>
                                {/* end current password */}

                                <div className="mb-3">
                                    <label htmlFor="new-password" className="form-label">Nova senha</label>
                                    <input required type="password" value={passwordInput.inputs.password} onChange={(e) => setPasswordInput(old => ({ ...old, inputs: { ...old.inputs, password: e.target.value } }))} className="input-form rounded-0" id="new-password" />
                                    <span className="text-danger">
                                        {passwordInput?.errors?.password}
                                    </span>
                                </div>
                                {/* end current password */}

                                <div className="mb-3">
                                    <label htmlFor="conf-password" className="form-label">Confirmar senha</label>
                                    <input required type="password" value={passwordInput.inputs.password_confirmation} onChange={(e) => setPasswordInput(old => ({ ...old, inputs: { ...old.inputs, password_confirmation: e.target.value } }))} className="input-form rounded-0" id="conf-password" />
                                    <span className="text-danger">
                                        {passwordInput?.errors?.password_confirmation}
                                    </span>
                                </div>
                                {/* end current password */}

                                <div className="d-flex justify-content-end">
                                    <button type='reset' className='btn btn-outline-secondary me-2 rounded-0'>Cancelar</button>
                                    <ButtonPrimaryForm isLoading={loadingPassEdit} text='confirmar' />
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AccountPage