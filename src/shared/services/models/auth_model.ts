export interface IAuthModel{
    user?: IUserModel,
    token?: string
}

export interface IUserModel{
    id?: number,
    name?: string,
    email?: string,
    phone_number?: string,
    phone_number_2?: string,
    role?: string,
    image?: File,
    created_at?:string
}

export interface IUserLoginBodyModel{
    email: string,
    password: string,
}
export interface IUserLoginErrorsModel{
    email: string,
    password: string,
    message?:string
}

export interface IUserSingUpBodyModel{
    name?: string,
    email?: string,
    phone_number?: string,
    phone_number_2?: string,
    image?: File,
    password?: string,
    password_confirmation?: string,
}
export interface IUserSingUpErrorsModel{
    name?: string,
    email?: string,
    phone_number?: string,
    phone_number_2?: string,
    image?: string,
    password?:string
}

export interface IUserEditBodyModel{
    name?: string,
    email?: string,
    phone_number?: string,
    phone_number_2?: string,
    password?: string
}
export interface IUserEditPasswordBodyModel{
    current_password?: string,
    password?: string,
    password_confirmation?: string,
}