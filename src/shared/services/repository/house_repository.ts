

import { Api } from "../api/api_client"
import { IHouseBodyStatusModel } from "../models/house_model"


const getAll = async ({ pageNumber, search, userId }: { pageNumber: number, search: string, userId?: number }) => {
    let response = await Api().get(`/homes?page=${pageNumber}&${search}${userId && '&user_id=' + userId}`)
    return response
}

const getUnitialized = async ({ pageNumber, search }: { pageNumber: number, search: string }) => {
    let response = await Api().get(`/homes/user/unitialized?page=${pageNumber}${search}`)
    return response
}

const getAnounced = async ({ pageNumber, search }: { pageNumber: number, search: string }) => {
    let response = await Api().get(`/homes/user/anounced?page=${pageNumber}${search}`)
    return response
}

const getExpired = async ({ pageNumber, search }: { pageNumber: number, search: string }) => {
    let response = await Api().get(`/homes/user/expired?page=${pageNumber}${search}`)
    return response
}

const getById = async (id: number) => {
    let response = await Api().get(`/homes/${id}`)
    return response
}

const getBySlug = async (slug: string) => {
    let response = await Api().get(`/homes/${slug}/details`)
    return response
}

const getBySlugForUser = async (slug: string) => {
    let response = await Api().get(`/homes/user/${slug}/details`)
    return response
}

const getNumOfAnounced = async () => {
    let response = await Api().get(`/homes/user/num-anounced`)
    return response
}

const add = async (data: FormData) => {
    let response = await Api().post('/homes', data)
    return response
}

const update = async (data: FormData) => {
    let response = await Api().post(`/homes/update`, data)
    return response
}

const updateStatus = async (data: IHouseBodyStatusModel) => {
    let response = await Api().put(`/homes/status`, data)
    return response
}

const deleteById = async (id: number) => {
    let response = await Api().delete(`/homes/${id}`)
    return response
}

const houseRepository = {
    getAll,
    getById,
    getBySlug,
    getBySlugForUser,
    getUnitialized,
    getAnounced,
    getExpired,
    getNumOfAnounced,
    add,
    update,
    updateStatus,
    deleteById
}

export default houseRepository