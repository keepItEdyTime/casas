import { faFilter } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { IBairoModel } from '../../services/models/baito_model'
import { ICityModel } from '../../services/models/city_models'
import bairoRepository from '../../services/repository/bairo_repository'
import cityRepository from '../../services/repository/city_repository'
import ButtonMany from '../buttons_many'
import LoadingSpinner from '../laonding_spinner'


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

interface IFilterItemProps {
    getFiltersAsUrl: (url: string) => void,
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

const FilterItemNext: React.FC<IFilterItemProps> = (props) => {

    const [loading, setLoading] = useState(true)
    const [bairoLoanding, setBairoLoading] = useState(false)
    const [filters, setFilters] = useState<IFilters>({} as IFilters)
    const [inputs, setInputs] = useState<Iinputs>({
        cities: [],
        bairos: []
    })


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
            }).finally(() => {
                setLoading(false)
            })
    }, [])


    function submit() {

        let url = getFiltersAsUrl()
        props.getFiltersAsUrl(url)

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

    function disableWithOne(value: number, fields: number[]) {
        return value === 1 ? [...fields] : []
    }

    function disableWithAll(value: number, fieldZ: number[], fieldO: number[], fieldA: number[]) {
        if (value === 1) {
            return [...fieldZ]
        } else if (value === 2) {
            return [...fieldO]
        } else if (value > 1) {
            return [...fieldA]
        } else {
            return []
        }
    }

    if (loading)
        return (
            <div className='vh-100 d-flex justify-content-center bg-secondary align-items-center'>
                <div className="spinner-border text-warning" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        )

    return (
        <div className="p-3 bg-secondary">
            <div className="row">
                <div className="col-4 d-flex align-items-center text-white fw-bold">
                    <FontAwesomeIcon icon={faFilter} />
                    <span>Filtros</span>
                </div>
                <div className="col-8 text-end">
                    <button onClick={reset} className='btn btn-sm btn-danger rounded-0'>Limpar</button>
                    <button onClick={submit} className='btn btn-sm btn-warning rounded-0'>Aplicar</button>
                </div>
            </div>
            {/* ipunts */}

            <div className="element">
                <label htmlFor='max-price' className='label-form'>Pesquisa</label>
                <input type={'text'} value={filters.search} onChange={(e) => setSearch(e.target.value)} placeholder={'Rua, descrição, titulo...'} className={'input-form'} />
            </div>
            {/* end-search input */}

            <div className="mb-3">
                <label htmlFor="city" className="label-form">Cidade</label>
                <select required value={filters.cityId} onChange={e => setCity(Number(e.target.value))} id="city" className="input-form rounded-0" >
                    <option value={-1} className='text-muted'>ecolha uma...</option>
                    {
                        inputs.cities.map(city => {
                            return <option key={city.id} value={city.id} unselectable="on" className="text-secondary" >{city.name}</option>
                        })
                    }
                </select>
                <span className="text-danger"></span>
            </div>
            {/* end cidade */}

            <div className="mb-3">
                <div className="d-flex">
                    <div className="flex-grow-1">
                        <label htmlFor="bairo" className="label-form">Bairo</label>
                        <select required value={filters.bairoId} onChange={e => setBairo(Number(e.target.value))} disabled={bairoLoanding} id="bairo" className="input-form rounded-0" >
                            <option value={-1} unselectable="on" className="text-secondary" >Todos</option>
                            {
                                inputs.bairos.map(bairo => {
                                    return <option key={bairo.id} value={bairo.id} unselectable="on" className="text-secondary" >{bairo.name}</option>
                                })
                            }
                        </select>
                    </div>
                    {
                        bairoLoanding &&
                        <div className="d-flex align-items-end ms-1 mb-2">
                            <LoadingSpinner isSmall />
                        </div>
                    }
                </div>
                <span className="text-danger"></span>
            </div>
            {/* end bairos */}

            <div className="element">
                <div className="row">
                    <div className="col-6">
                        <label htmlFor='min-price' className='label-form'>Preco minimo</label>
                        <input type={'number'} value={filters.minPrice} onChange={(e) => setMinPrice(Number(e.target.value))} placeholder={'500'} className={'input-form'} />
                    </div>
                    <div className="col-6">
                        <label htmlFor='max-price' className='label-form'>Preco maximo</label>
                        <input type={'number'} value={filters.maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))} id='max-price' placeholder={'ilimitado'} className={'input-form'} />
                    </div>
                </div>
            </div>
            {/* end-prices */}

            <div className='element'>
                <div className='label-form mb-2'>Quartos</div>
                <ButtonMany elements={filters.badrooms} setActive={setBadrooms} />
            </div>
            {/* end badrooms */}

            <div className='element'>
                <div className='label-form mb-2'>salas</div>
                <ButtonMany elements={filters.salas} setActive={setSalas} />
            </div>
            {/* end salas */}

            <div className='element'>
                <div className='label-form mb-2'>varandas</div>
                <ButtonMany elements={filters.varandas} setActive={setVarandas} />
            </div>
            {/* end salas */}

            <div className='element'>
                <div className='label-form mb-2'>Cozinhas</div>
                <ButtonMany elements={filters.cozinhas} setActive={setCozinhas} />
            </div>
            {/* end cozinhas */}

            <div className='element'>
                <div className='label-form mb-2'>Localização da cozinha</div>
                <ButtonMany
                    elements={filters.cozinhaInside}
                    setActive={setCozinhaInside}
                    disableds={disableWithAll(filters.cozinhas.active as number, [0, 1, 2, 3], [3], [])}
                />
            </div>
            {/* end cozinhas */}

            <div className='element'>
                <div className='label-form mb-2'>uso da cozinha</div>
                <ButtonMany
                    elements={filters.cozinhaShared}
                    setActive={setCozinhaShared}
                    disableds={disableWithAll(filters.cozinhas.active as number, [0, 1, 2, 3], [3], [])}
                />
            </div>
            {/* end cozinhas */}

            <div className='element'>
                <div className='label-form mb-2'>Banheiros</div>
                <ButtonMany elements={filters.bafrooms} setActive={setBafrooms} />
            </div>
            {/* end bafrooms */}

            <div className='element'>
                <div className='label-form mb-2'>Uso do banheiro</div>
                <ButtonMany
                    elements={filters.bafroomsShared}
                    setActive={setbafroomsShared}
                    disableds={disableWithOne(filters.bafrooms.active as number, [3])}
                />
            </div>
            {/* end badrooms shared */}

            <div className='element'>
                <div className='label-form mb-2'>Localização do Banheiro</div>
                <ButtonMany
                    elements={filters.bafroomsInside}
                    setActive={setBafroomInside}
                    disableds={disableWithOne(filters.bafrooms.active as number, [3])}
                />
            </div>
            {/* end badrooms inside */}

            <div className="element">
                <div className="row">
                    <div className="col-6">
                        <label htmlFor='min-area' className='label-form'>Area minima(m2)</label>
                        <input type={'number'} value={filters.minDimention} onChange={(e) => setMinDimention(Number(e.target.value))} min={0} max={50} placeholder={'2 m2'} className={'input-form'} />
                    </div>
                    <div className="col-6">
                        <label htmlFor='max-area' className='label-form'>Area maxima(m2)</label>
                        <input type={'number'} value={filters.maxDimention} onChange={(e) => setMaxDimention(Number(e.target.value))} min={0} max={50} id='max-price' placeholder={'ilimitado'} className={'input-form'} />
                    </div>
                </div>
            </div>
            {/* end-prices */}

        </div>
    )
}

export default FilterItemNext