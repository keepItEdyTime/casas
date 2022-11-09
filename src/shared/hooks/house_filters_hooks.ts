import { useContext } from "react"
import { houseFiltersContext } from "../contexts/house_filters_context"

export const useHouseFliters = ()=>{
    return useContext(houseFiltersContext)
}