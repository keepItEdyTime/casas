import React, { createContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { RoutesConstants } from "../../helpers/routes_constants";
import { IBairoModel } from "../services/models/baito_model";
import { ICityModel } from "../services/models/city_models";
import bairoRepository from "../services/repository/bairo_repository";
import cityRepository from "../services/repository/city_repository";

interface IItems {
    list: string[],
    active: number
}

interface IFilters {
    search: string,
    minPrice: number,
    maxPrice: number,
    minDimention: number,
    maxDimention: number,
    badrooms: IItems,
    salas: IItems,
    cozinhas: IItems,
    cozinhaShared: IItems,
    cozinhaInside: IItems,
    varandas: IItems,
    bafrooms: IItems,
    bafroomsInside: IItems,
    bafroomsShared: IItems,
    cityId: number,
    bairoId: number
}

interface Iinputs {
    cities: ICityModel[],
    bairos: IBairoModel[],
}

interface IHouseProviderProps extends IFilters {
    setSearch: (search: string) => void,
    setMinPrice: (price: number) => void,
    setMaxPrice: (price: number) => void,
    setMinDimention: (dimention: number) => void,
    setMaxDimention: (dimention: number) => void,
    setBadrooms: (active: number) => void,
    setSalas: (active: number) => void,
    setCozinhas: (active: number) => void,
    setCozinhaShared: (active: number) => void,
    setCozinhaInside: (active: number) => void,
    setVarandas: (active: number) => void,
    setBafrooms: (active: number) => void,
    setBafroomInside: (active: number) => void,
    setbafroomsShared: (active: number) => void,
    setCity: (active: number) => void,
    setBairo: (active: number) => void,
    getFiltersAsUrl: () => string
    clean: () => void,
    reset: () => void,
    submit: () => void,
    paddingPage: boolean,
    anouncedPage: boolean,
    historyPage: boolean,
    searchPage: boolean,
    favoritPage: boolean,
    bairoLoanding: boolean,
    cities: ICityModel[],
    bairos: IBairoModel[],
}

function init() {
    return {
        badrooms: {
            list: ['todos', '1', '2', '3', '4', '4+'],
            active: 0
        },
        salas: {
            list: ['todos', '0', '1', '2', '3', '4', '4+'],
            active: 0
        },
        cozinhas: {
            list: ['todos', '0', '1', '2', '3'],
            active: 0
        },
        cozinhaShared: {
            list: ['todos', 'pessoal', 'compartilhado', 'ambos'],
            active: 0
        },
        cozinhaInside: {
            list: ['todos', 'dentro', 'fora', 'ambos'],
            active: 0
        },
        varandas: {
            list: ['todos', '0', '1', '2', '3', '4', '4+'],
            active: 0
        },
        bafrooms: {
            list: ['todos', '1', '2', '3', '4', '4+'],
            active: 0
        },
        bafroomsInside: {
            list: ['todos', 'fora', 'dentro', 'ambos'],
            active: 0
        },
        bafroomsShared: {
            list: ['todos', 'pessoal', 'compartilhado', 'ambos'],
            active: 0
        },
        minPrice: 500,
        maxPrice: 0,
        minDimention: 0,
        maxDimention: 0,
        search: '',
        cityId: -1,
        bairoId: -1
    }
}

export const houseFiltersContext = createContext<IHouseProviderProps>({} as IHouseProviderProps)

export const HouseFiltersProvider = ({ children }: { children: React.ReactNode }) => {

    const [loading, setLoading] = useState(true)
    const [bairoLoanding, setBairoLoading] = useState(false)
    const [filters, setFilters] = useState<IFilters>({} as IFilters)
    const [inputs, setInputs] = useState<Iinputs>({
        cities: [],
        bairos: []
    })

    const location = useLocation()

    const [searchPage, setSearchPage] = useState(false)
    const [paddingPage, setPaddingPage] = useState(false)
    const [favoritPage, setFavoritPage] = useState(false)
    const [historyPage, setHistoryPage] = useState(false)
    const [anouncedPage, setAnouncedPage] = useState(false)

    useEffect(() => {
        const inValues = init()

        setFilters(old => ({ ...inValues }))

        cityRepository
            .getAll()
            .then(response => {
                let cities = response.data.data as ICityModel[];

                setInputs(old => ({ ...old, cities: cities }))

            })
            .catch(reject => {
                alert('erro ao ler as cidades')
                setLoading(false)
            }).finally(() => {
                setLoading(false)
            })
    }, [])


    function submit() {
        if (location.pathname === RoutesConstants.homeSearch) {
            setSearchPage(old => !old)
        } else if (location.pathname === RoutesConstants.favorits) {
            setFavoritPage(old => !old)
        } else if (location.pathname === RoutesConstants.managepeddings) {
            setPaddingPage(old => !old)
        } else if (location.pathname === RoutesConstants.manage) {
            setAnouncedPage(old => !old)
        } else if (location.pathname === RoutesConstants.manageHistory) {
            setHistoryPage(old => !old)
        }
    }


    function reset() {
        const inValues = init()
        setFilters(inValues)
    }

    function getBairos(cityId: number) {
        setBairoLoading(true)
        return bairoRepository
            .getByCity(cityId)
            .then(response => {

                let bairos = response.data.data as IBairoModel[]

                setInputs(old => ({ ...old, bairos: bairos }))
            })
            .catch(reject => {
                console.log(reject)
                alert('Erro ao ler os bairos')
            })
            .finally(() => {
                setBairoLoading(false)
            })
    }

    async function setCity(id: number) {
        if (id > 0) {
            await getBairos(id)
        } else {
            setInputs(old => ({ ...old, bairos: [] }))
        }
        setFilters(old => ({ ...old, cityId: id, bairoId: -1 }))
    }

    function setBairo(id: number) {
        setFilters(old => ({ ...old, bairoId: id }))
    }
    function setSearch(search: string) {
        setFilters(old => ({ ...old, search: search }))
    }

    function setMinPrice(price: number) {
        setFilters(old => ({ ...old, minPrice: price }))
    }
    function setMaxPrice(price: number) {
        setFilters(old => ({ ...old, maxPrice: price }))
    }

    function setMinDimention(dimention: number) {
        setFilters(old => ({ ...old, minDimention: dimention }))
    }

    function setMaxDimention(dimention: number) {
        setFilters(old => ({ ...old, maxDimention: dimention }))
    }

    function setBadrooms(active: number) {

        setFilters(old => ({ ...old, badrooms: { ...old.badrooms, active: active } }))
    }

    function setSalas(active: number) {
        setFilters(old => ({ ...old, salas: { ...old.salas, active: active } }))
    }

    function setCozinhas(active: number) {

        let currentIniside = filters.cozinhaInside.active
        let currentShared = filters.cozinhaShared.active

        if (active === 1) {
            setFilters(old => ({ ...old, cozinhas: { ...old.cozinhas, active: active }, cozinhaShared: { ...old.cozinhaShared, active: -1 }, cozinhaInside: { ...old.cozinhaInside, active: -1 } }))
        } else if (active === 2 && (currentIniside === 3 || currentIniside === -1) && (currentShared === 3 || currentShared === -1)) {
            setFilters(old => ({ ...old, cozinhas: { ...old.cozinhas, active: active }, cozinhaShared: { ...old.cozinhaShared, active: 0 }, cozinhaInside: { ...old.cozinhaInside, active: 0 } }))
        } else if (active === 2 && currentIniside === 3) {
            setFilters(old => ({ ...old, cozinhas: { ...old.cozinhas, active: active }, cozinhaInside: { ...old.cozinhaInside, active: 0 } }))
        } else if (active === 2 && currentShared === 3) {
            setFilters(old => ({ ...old, cozinhas: { ...old.cozinhas, active: active }, cozinhaShared: { ...old.cozinhaShared, active: 0 } }))
        }
        else if (currentIniside === -1 && currentIniside === -1) {
            setFilters(old => ({ ...old, cozinhas: { ...old.cozinhas, active: active }, cozinhaShared: { ...old.cozinhaShared, active: 0 }, cozinhaInside: { ...old.cozinhaInside, active: 0 } }))
        } else {
            setFilters(old => ({ ...old, cozinhas: { ...old.cozinhas, active: active } }))
        }

    }

    function setCozinhaShared(active: number) {
        setFilters(old => ({ ...old, cozinhaShared: { ...old.cozinhaShared, active: active } }))
    }

    function setCozinhaInside(active: number) {
        setFilters(old => ({ ...old, cozinhaInside: { ...old.cozinhaInside, active: active } }))
    }

    function setVarandas(active: number) {
        setFilters(old => ({ ...old, varandas: { ...old.varandas, active: active } }))
    }

    function setBafrooms(active: number) {

        let currentS = filters.bafroomsShared.active
        let currentI = filters.bafroomsInside.active

        if (active === 1 && currentS === 3 && currentI === 3) {
            setFilters(old => ({ ...old, bafrooms: { ...old.bafrooms, active: active }, bafroomsInside: { ...old.bafroomsInside, active: 0 }, bafroomsShared: { ...old.bafroomsShared, active: 0 } }))
        } else if (active === 1 && currentI === 3) {
            setFilters(old => ({ ...old, bafrooms: { ...old.bafrooms, active: active }, bafroomsInside: { ...old.bafroomsInside, active: 0 } }))
        } if (active === 1 && currentS === 3) {
            setFilters(old => ({ ...old, bafrooms: { ...old.bafrooms, active: active }, bafroomsShared: { ...old.bafroomsShared, active: 0 } }))
        } else {
            setFilters(old => ({ ...old, bafrooms: { ...old.bafrooms, active: active } }))
        }
    }


    function setBafroomInside(active: number) {
        setFilters(old => ({ ...old, bafroomsInside: { ...old.bafroomsInside, active: active } }))
    }

    function setbafroomsShared(active: number) {
        setFilters(old => ({ ...old, bafroomsShared: { ...old.bafroomsShared, active: active } }))
    }

    function getFiltersAsUrl(): string {

        let search = ''

        if (filters?.cityId && filters?.cityId !== -1)
            search = search.concat(`&city_id=${filters?.cityId}`)

        if (filters?.bairoId && filters?.bairoId !== -1)
            search = search.concat(`&bairo_id=${filters?.bairoId}`)

        if (filters?.search && filters?.search !== '')
            search = search.concat(`&search=${filters?.search}`)

        if (filters?.maxDimention !== 0)
            search = search.concat(`&maxDimention=${filters?.maxDimention}`)

        if (filters?.minDimention !== 0)
            search = search.concat(`&minDimention=${filters?.minDimention}`)

        if (filters?.maxPrice !== 0)
            search = search.concat(`&maxPrice=${filters?.maxPrice}`)

        if (filters?.minPrice !== 0)
            search = search.concat(`&minPrice=${filters?.minPrice}`)

        if (filters?.badrooms?.active !== 0)
            search = search.concat(`&badroom=${filters?.badrooms?.active}`)

        if (filters?.bafrooms?.active !== 0)
            search = search.concat(`&bafroom=${filters?.bafrooms?.active}`)

        if (filters?.bafroomsInside?.active !== 0)
            search = search.concat(`&bafroom_inside=${filters?.bafroomsInside?.active - 1}`)

        if (filters?.bafroomsShared?.active !== 0)
            search = search.concat(`&bafroom_shared=${filters?.bafroomsShared?.active - 1}`)

        if (filters?.cozinhas?.active !== 0)
            search = search.concat(`&cozinha=${filters?.cozinhas?.active - 1}`)

        if (filters?.cozinhaShared?.active > 0)
            search = search.concat(`&cozinha_shared=${filters?.cozinhaShared?.active - 1}`)

        if (filters?.cozinhaInside?.active > 0)
            search = search.concat(`&cozinha_inside=${filters?.cozinhaInside?.active - 1}`)

        if (filters?.salas?.active !== 0)
            search = search.concat(`&sala=${filters?.salas?.active - 1}`)

        if (filters?.varandas?.active !== 0)
            search = search.concat(`&varanda=${filters.varandas?.active - 1}`)

        return search
    }

    if (loading)
        return <div>loadingqq...</div>

    return (
        <houseFiltersContext.Provider value={{
            badrooms: filters.badrooms, setBadrooms,
            salas: filters.salas, setSalas,
            cozinhas: filters.cozinhas, setCozinhas,
            cozinhaShared: filters.cozinhaShared, setCozinhaShared,
            cozinhaInside: filters.cozinhaInside, setCozinhaInside,
            varandas: filters.varandas, setVarandas,
            bafrooms: filters.bafrooms, setBafrooms,
            bafroomsInside: filters.bafroomsInside, setBafroomInside,
            bafroomsShared: filters.bafroomsShared, setbafroomsShared,
            search: filters.search, setSearch,
            minPrice: filters.minPrice, setMinPrice,
            maxPrice: filters.maxPrice, setMaxPrice,
            minDimention: filters.minDimention, setMinDimention,
            maxDimention: filters.maxDimention, setMaxDimention,
            clean: init,
            getFiltersAsUrl,
            submit,
            reset,
            searchPage,
            favoritPage,
            paddingPage,
            anouncedPage,
            historyPage,
            cities: inputs.cities,
            bairos: inputs.bairos,
            bairoId: filters.bairoId, setBairo,
            cityId: filters.cityId, setCity,
            bairoLoanding
        }}>
            {children}
        </houseFiltersContext.Provider>
    )
}