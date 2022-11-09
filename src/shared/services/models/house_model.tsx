export interface IHouseModel{
    id?: number,
    title?: string,
    slug?: string,
    bafroom?: number,
    bafroom_shared?: number,
    bafroom_inside?: number,
    price?: number,
    badroom?: number,
    sala?: number,
    varanda?: number,
    cozinha?: string,
    cozinha_shared?: number,
    cozinha_inside?: number,
    description?: string,
    city?: string,
    bairo?: string,
    rua?: string,
    user?: string,
    phone_number?: string,
    phone_number_2?: string,
    email?: string,
    url?: string,
    isblocked?: boolean,
    isActive?: boolean,
    isFavorit?: number | null,
    dimention?: string,
    created_at?: string,
    expires_at?: string,
    payment_id?:number,
    initialized: boolean,
    isExpired?: null | number
}

export interface IHouseBodyModel{
    title?: string,
    images?: FileList,
    bafroom?: number,
    bafroom_shared?: number,
    bafroom_inside?: number,
    price?: number,
    badroom?: number,
    sala?: number,
    varanda?: number,
    cozinha?: number,
    cozinha_shared?: number,
    cozinha_inside?: number,
    description?: string,
    city_id?: number,
    bairo_id?: number,
    rua?: string,
    dimention?: number,
    
    errors?: IHouseBodyErrorsModel
}

export interface IHouseBodyErrorsModel{
    title?: string,
    image1?: string,
    image2?: string,
    image3?: string,
    image4?: string,
    image5?: string,
    image6?: string,
    bafroom?: string,
    bafroom_shared?: string,
    bafroom_inside?: string,
    price?: string,
    badroom?: string,
    sala?: string,
    varanda?: string,
    cozinha?: string,
    cozinha_shared?: string,
    cozinha_inside?: string,
    description?: string,
    city_id?: string,
    bairo_id?: string,
    rua?: string,

    dimention?: string,
}

export interface IHouseBodyStatusModel{
    isBlocked: boolean,
    homeId: number
}

export interface IHouseImageModel{
    id?: number,
    url?: string,
}

export interface IHouseSingleResponseModel{
    home: IHouseModel,
    images: IHouseImageModel[]
}

export interface IHousesResponseModel{
    data: IHouseModel[],
    current_page: number,
    next_page_url: string,
    path: string,
    per_page: number,
    prev_page_url: null,
    to: number,
    total: number
}