

import { Api } from "../api/api_client"
import { IFavoritBodyModel } from "../models/favorit_model"


const getAll = async ({ pageNumber, search }: { pageNumber: number, search: string }) => {
    let response = await Api().get(`/favorits?page=${pageNumber}${search}`)
    return response
}

const update = async (data: IFavoritBodyModel) => {
    let response = await Api().post('/favorits', data)
    return response
}


const favoritRepository = {
    getAll,
    update,
}

export default favoritRepository