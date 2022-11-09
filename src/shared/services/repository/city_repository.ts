

import { Api } from "../api/api_client"


const getAll = async () => {
    let response = await Api().get(`/cities`)
    return response
}

const getById = async (id: number) => {
    let response = await Api().get(`/cities/${id}`)
    return response
}

const add = async (data: FormData) => {
    let response = await Api().post('/cities', data)
    return response
}

const update = async (data: FormData) => {
    let response = await Api().post(`/cities/update`, data)
    return response
}

const deleteById = async (id: number) => {
    let response = await Api().delete(`/cities/${id}`)
    return response
}


const cityRepository = {
    getAll,
    getById,
    add,
    update,
    deleteById
}

export default cityRepository