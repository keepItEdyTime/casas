import axios from "axios"
import { Api } from "../api/api_client"
import { IUserEditBodyModel, IUserEditPasswordBodyModel, IUserLoginBodyModel, IUserSingUpBodyModel } from "../models/auth_model"

const csrf = async () => {
    let response = await axios.get('http://localhost:8000/sanctum/csrf-cookie')
    return response
}

const login = async (data: IUserLoginBodyModel) => {
    let response = await Api().post('/auth/login', data)
    return response
}

const register = async (data: IUserSingUpBodyModel) => {
    let response = await Api().post(`/auth/register`, data)
    return response
}
const sendEmailNotification = async () => {
    let response = await Api().post(`/email/verification-notification`)
    return response
}
const verifyEmail = async () => {
    let response = await Api().post(`/email/verification-notification`)
    return response
}

const getUser = async () => {
    let response = await Api().get(`/auth/user`)
    return response
}

const update = async (data: IUserEditBodyModel) => {
    let response = await Api().put(`/auth/user`, data)
    return response
}
const updatePassord = async (data: IUserEditPasswordBodyModel) => {
    let response = await Api().put(`/auth/user/password`, data)
    return response
}
const remove = async (data:{password: string}) => {
    let response = await Api().post(`/auth/user`,data)
    return response
}
const logout = async () => {
    let response = await Api().delete(`/auth/logout`)
    return response
}


const authRepository = {
    login,
    register,
    getUser,
    update,
    updatePassord,
    sendEmailNotification,
    remove,
    csrf,
    logout
}

export default authRepository