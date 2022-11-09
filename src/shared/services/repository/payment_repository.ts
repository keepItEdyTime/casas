

import { Api } from "../api/api_client"
import { IPaymentBodyModel, IPaymentUpdateBodyModel } from "../models/payment_model"



const create = async (data: IPaymentBodyModel) => {
    let response = await Api().post('/payments', data)
    return response
}

const update = async (data: IPaymentUpdateBodyModel) => {
    let response = await Api().put(`/payments`, data)
    return response
}


const paymentRepository = {
    create,
    update,
}

export default paymentRepository