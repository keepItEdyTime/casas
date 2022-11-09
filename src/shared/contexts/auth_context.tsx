
import { createContext, useEffect, useState } from "react";
import { IAuthModel } from "../services/models/auth_model";
import authRepository from "../services/repository/auth_repository";

type authModel = IAuthModel | undefined 

interface IAuthContextProps {
    auth?: IAuthModel,
    setAuth: (auth?: IAuthModel) => void
}

interface IAuthContextProviderProps {
    children: React.ReactNode
}


export const authContext = createContext({} as IAuthContextProps)

export const AuthContextProvider: React.FC<IAuthContextProviderProps> = ({ children }) => {

    const [auth, setAuth] = useState<authModel>(undefined)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        authRepository
            .getUser()
            .then(response => {
                console.log(response.data.data)
                setAuth(old => ({ ...old, user: response.data?.data }))
            })
            .catch(reject => {
                console.log(reject)
            })
            .finally(() => {
                 setLoading(false)
            })
    }, [])

    const handleSetAuth = (auth?: IAuthModel) => {
        setAuth(auth)
    }

    if (loading)
        return <>auth loading...</>

    return (
        <authContext.Provider value={{ auth: auth, setAuth: handleSetAuth }}>
            {children}
        </authContext.Provider>
    )
}