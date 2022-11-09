

import { Api } from "../api/api_client"


const getAll = async () => {
    let response = await Api().get(`/bairos`)
    return response
}

const getById = async (id: number) => {
    let response = await Api().get(`/bairos/${id}`)
    return response
}

const getByCity = async (cityId: number) => {
    let response = await Api().get(`/cities/bairos/${cityId}`)
    return response
}

const add = async (data: FormData) => {
    let response = await Api().post('/bairos', data)
    return response
}

const update = async (data: FormData) => {
    let response = await Api().post(`/bairos/update`, data)
    return response
}

const deleteById = async (id: number) => {
    let response = await Api().delete(`/bairos/${id}`)
    return response
}


const bairoRepository = {
    getAll,
    getById,
    getByCity,
    add,
    update,
    deleteById
}

export default bairoRepository