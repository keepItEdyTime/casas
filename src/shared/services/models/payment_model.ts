export interface IPaymentBodyModel{
    home_id?: number,
    plan_id?: number,
    phone_number?: string
}

export interface IPaymentUpdateBodyModel{
    id?: number,
    plan_id?: number,
    phone_number?: string
}

export interface IPaymentBodyErrorsModel{
    home_id?: string,
    plan_id?: string,
    phone_number?: string,
    payment?: string
}