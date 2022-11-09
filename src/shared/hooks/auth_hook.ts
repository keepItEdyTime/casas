import { useContext } from "react"
import { authContext } from "../contexts/auth_context"

export const useAuth = ()=>{
    return useContext(authContext)
}