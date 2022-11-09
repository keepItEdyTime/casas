import axios, { AxiosInstance } from "axios"
import { ApiConstants } from "../../../helpers/api_constants"


//criacao da instancia
export const Api = (): AxiosInstance => {


    let instance = axios.create({
        baseURL: ApiConstants.baseUrlApi,
        headers: {
            'content-type': 'application/json',
            'accept': 'application/json',

        },
        withCredentials: true,

    })

    //antes de cada intercesao adiciona o token no cabecalho
    instance.interceptors.request.use((config) => {

        let token = localStorage.getItem('token')

        if (config.headers && token)
            config.headers.Authorization = token ? `Bearer ${token}` : ''

        return config
    })

    //criacao de interceptors
    instance.interceptors.response.use(response => {
        //se for status 2xx
        return response
    }, (err) => {
        //diferente do status 2xx
        //console.log(err.response)
        //return Promise.reject(err)

        const obj = {
            data: err?.response?.data,
            status: err?.response?.status
        }
        return Promise.reject(obj)
    })

    return instance

}
