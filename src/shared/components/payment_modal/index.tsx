import { faMoneyBill1Wave } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';
import { toast } from 'react-toastify';
import { IPaymentBodyErrorsModel, IPaymentBodyModel } from '../../services/models/payment_model';
import { IPlanModel } from '../../services/models/plan_model';
import houseRepository from '../../services/repository/house_repository';
import paymentRepository from '../../services/repository/payment_repository';
import planRepository from '../../services/repository/plan_repository';
import ButtonPrimaryForm from '../button_primary_form';


interface IInputsProps {
    inputs: IPaymentBodyModel,
    errors: IPaymentBodyErrorsModel
}

interface IPaymentModalProps {
    show: boolean,
    homeId?: number,
    update?: boolean
    paymentId?: number,
    normalCancel?: boolean,
    close: () => void,
    onHide: () => void,
    onSuccess: (homeId?: number) => void,
}

const PaymentModal = (props: IPaymentModalProps) => {

    const [loading, setLoading] = useState(true)
    const [paymentLoading, setPaymentLoading] = useState(false)
    const [plans, setPlans] = useState<IPlanModel[]>([])
    const [inputs, setInputs] = useState<IInputsProps>({
        inputs: {
            home_id: 0,
            phone_number: '',
            plan_id: 0
        }
    } as IInputsProps)

    useEffect(() => {

        planRepository
            .getAll()
            .then(response => {
                let plansResponse = response.data.data as IPlanModel[];

                setPlans(plansResponse)

                if (plansResponse.length > 0) {
                    setInputs(old => ({ ...old, inputs: { ...old.inputs, plan_id: plansResponse[1].id } }))
                }

            })
            .catch(reject => {
                toast.error('Erro ao carregar os dados')
            }).finally(() => {
                setLoading(false)
            })
    }, [])

    function handleSubmit(event: React.FormEvent) {

        event.preventDefault()

        setPaymentLoading(true)

        if (props?.update) {

            let data = {
                ...inputs.inputs,
                id: props.paymentId
            }

            paymentRepository
                .update(data)
                .then(response => {

                    props.onSuccess(props.paymentId)
                    toast.success('Pago com sucesso')

                })
                .catch(reject => {
                    toast.error('Erro ao pagar')
                    console.log(reject)
                }).finally(() => {
                    setPaymentLoading(false)
                })

        } else {
            let data = {
                ...inputs.inputs,
                home_id: props.homeId
            }

            paymentRepository
                .create(data)
                .then(response => {

                    props.onSuccess(props.homeId)
                    toast.success('Pago com sucesso')

                })
                .catch(reject => {
                    toast.error('Erro ao pagar')
                    console.log(reject)
                }).finally(() => {
                    setPaymentLoading(false)
                })
        }
    }

    function handleCancel() {
        setLoading(true)
        houseRepository
            .deleteById(props.homeId as number)
            .then(Response => {

                props.close()
            })
            .catch(reject => {
                console.log(reject)
                if (reject.status === 0)
                    toast.error('Erro de conexao!')
                toast.error('Erro ao remover, tente novamente')
            }).finally(() => {
                setLoading(false)
            })
    }



    return (



        <Modal
            //  {...props}
            show={props.show}
            onHide={props.onHide}
            backdrop
            // size="sm"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            scrollable
            className='rounded-0'

        >
            <Modal.Header
                className='p-0'
            >
            </Modal.Header>
            <Modal.Body className='rounded-0  p-3'>
                <div className="">
                    <FontAwesomeIcon icon={faMoneyBill1Wave} className='fs-3 text-success' />
                    {props.update ?
                        <div className="p-2 fs-4 me-2 d-inline-block">
                            Actualizar o pagamento
                        </div>
                        :
                        <div className="p-2 fs-4 me-2 d-inline-block">
                            Pagamento
                        </div>
                    }
                </div>
                {
                    loading ?
                        <>Processando...</>
                        : plans.length < 1
                            ? <div className="alert alert-warning">Erro interne, tente mais tarde!'</div>
                            :
                            <form onSubmit={handleSubmit}>

                                <div className="mb-3">
                                    <label htmlFor="city" className="form-label text-muted">Escolha um plano</label>
                                    <select required value={plans[0].id} onChange={e => setInputs(old => ({ ...old, inputs: { ...old.inputs, plan_id: Number(e.target.value) } }))} id="city" className="input-form rounded-0" >
                                        {
                                            plans.map(plan => {
                                                return <option key={plan.id} value={plan.id} className="text-secondary" >{plan.name} - {plan.months} (mês) - {plan.price} (MZN)</option>
                                            })
                                        }
                                    </select>
                                    <span className="text-danger">{inputs.errors?.plan_id}</span>
                                </div>
                                {/* end cidades */}

                                <div className="mb-3">
                                    <label htmlFor="price" className="form-label text-muted">Numero MPESA</label>
                                    <input required type="tel" value={inputs.inputs.phone_number} onChange={(e) => setInputs(old => ({ ...old, inputs: { ...old.inputs, phone_number: e.target.value } }))} min={500} className="input-form rounded-0" id="price" />
                                    <span className="text-danger">{inputs.errors?.phone_number}</span>
                                </div>
                                {/* end phone_number */}

                                {
                                    inputs.errors?.payment &&
                                    <div className="alert alert-danger">
                                        {inputs.errors?.payment}
                                    </div>
                                }

                                <div className="d-flex justify-content-end">
                                    {
                                        props.normalCancel ?
                                            <>
                                                <Button variant='outline-secondary' className='rounded-0 me-2' onClick={() => props?.close()}>Cancelar</Button>
                                            </>
                                            :
                                            <>
                                                <Button variant='outline-secondary' className='rounded-0 me-2' onClick={() => handleCancel()}>Cancelar</Button>
                                                <Button variant='outline-danger' className='rounded-0 me-2' onClick={props.onHide}>Pagar mais tarde</Button>
                                            </>
                                    }
                                    <ButtonPrimaryForm isLoading={paymentLoading} text='Pagar' />
                                </div>
                            </form>

                }
            </Modal.Body>
        </Modal>
    )
}

export default PaymentModal