

import { Api } from "../api/api_client"


const getAll = async () => {
    let response = await Api().get(`/plans`)
    return response
}

const getById = async (id: number) => {
    let response = await Api().get(`/plans/${id}`)
    return response
}

const create = async (data: FormData) => {
    let response = await Api().post('/plans', data)
    return response
}

const update = async (data: FormData) => {
    let response = await Api().post(`/plans/update`, data)
    return response
}

const deleteById = async (id: number) => {
    let response = await Api().delete(`/plans/${id}`)
    return response
}


const planRepository = {
    getAll,
    getById,  
    create,
    update,
    deleteById
}

export default planRepository