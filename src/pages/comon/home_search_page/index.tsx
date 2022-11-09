import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { RoutesConstants } from '../../../helpers/routes_constants'
import CardHome from '../../../shared/components/card_home'
import FilterContent from '../../../shared/components/filter_content'

import Pagination from 'react-js-pagination'
import { toast, ToastContainer } from 'react-toastify'
import FilterItemNext from '../../../shared/components/filter_item'
import Loading from '../../../shared/components/loading/loading'
import { useAuth } from '../../../shared/hooks/auth_hook'
import { IHousesResponseModel } from '../../../shared/services/models/house_model'
import houseRepository from '../../../shared/services/repository/house_repository'
import './index.css'



const HomeSearchPage = () => {

  const [loading, setLoading] = useState(true)
  const [infoLoading, setInfoLoading] = useState(false)
  // const filters = useHouseFliters()
  const filtersStr = useRef('')
  const { auth } = useAuth()
  const [housesResponse, setHousesResponse] = useState<IHousesResponseModel>({} as IHousesResponseModel)

  useEffect(() => {

    (
      async () => {
        await getHouses(1,true)

      }
    )()

  }, [])

  const getHouses = (pageNumber: number = 1, first: boolean = false) => {
    if (!first) {
      setInfoLoading(true)
    }

    let filters = filtersStr.current
   // alert(filters)
    return houseRepository
      .getAll({ pageNumber: pageNumber, search: filters, userId: auth?.user?.id })
      .then(response => {
        console.log(response)
        setHousesResponse(response.data.data)
      })
      .catch(reject => {
        if (reject.status === 0) {
          toast.error('Erro de conexão!')
        } else {
          toast.error('Erro ao carregar os dados!')
        }
      })
      .finally(() => {
        if (first) {
          setLoading(false)
        } else {
          setInfoLoading(false)
        }
      })
  }

  function executeWithFilters(url: string) {
    filtersStr.current = url
    getHouses()
  }

  function hanldeOnFavoritChange(id: number, newStatus: number | null) {
    let newHouses = housesResponse?.data.map(house => {
      if (house.id === id)
        house.isFavorit = newStatus
      return house
    })
    setHousesResponse(old => ({ ...old, data: newHouses }))
    //houses?.map(house => )
  }

  if (loading)
    return <div>loading</div>

  return (

    <div className="container">

      <ToastContainer />

      {infoLoading && <Loading />}

      <div className="row py-3">
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item"><Link to={RoutesConstants.home}>Home</Link></li>
            <li className="breadcrumb-item active" aria-current="page">Aluguel</li>
            <li className="breadcrumb-item active" aria-current="page">Descobrir casas</li>
          </ol>
        </nav>
        <FilterContent getFiltersAsUrl={executeWithFilters} searchContentBtn>
          {/* side-bar-search */}
          <div className='d-none d-lg-block col-lg-3'>
            <FilterItemNext getFiltersAsUrl={executeWithFilters} />
          </div>
          {/* main */}
          <div className="col-lg-9 ps-lg-4">
            <div className="header border-bottom mb-3">
              <div className="h3">
                Ache a casa dos seus sonhos...
              </div>
              <span className='text-muted fs-6'>{housesResponse?.total} resultados encontrados</span>
            </div>
            <div className="homes row">
              {
                housesResponse?.data.map(house => {
                  return (
                    <div className="col-md-6 col-lg-4 d-flex  justify-content-center p-md-0">
                      <CardHome key={house.id} house={house} hanldeOnFavoritChange={hanldeOnFavoritChange} />
                    </div>
                  )
                })
              }
            </div>
            <div className="d-flex justify-content-end">
              {(housesResponse?.data && housesResponse.total > housesResponse?.per_page) && <Pagination
                totalItemsCount={housesResponse?.total as number}
                activePage={housesResponse?.current_page as number}
                onChange={(pageNumber) => getHouses(pageNumber)}
                itemsCountPerPage={housesResponse?.per_page}
                itemClass='page-item'
                linkClass='page-link rounded-0'
                firstPageText={'Primeiro'}
                lastPageText={'Ultimo'}
              />}
            </div>
          </div>

        </FilterContent>
      </div>
    </div>

  )
}

export default HomeSearchPage