import { useEffect, useRef, useState } from 'react'
import Pagination from 'react-js-pagination'
import { Link } from 'react-router-dom'
import { toast, ToastContainer } from 'react-toastify'
import { RoutesConstants } from '../../../helpers/routes_constants'
import CardHome from '../../../shared/components/card_home'
import FilterContent from '../../../shared/components/filter_content'
import Loading from '../../../shared/components/loading/loading'
import TitleSecondary from '../../../shared/components/secondart_title'
import { IHousesResponseModel } from '../../../shared/services/models/house_model'
import favoritRepository from '../../../shared/services/repository/favorits_repository'

const FavoritPage = () => {

  const [loading, setLoading] = useState(true)
  const [infoLoading, setInfoLoading] = useState(false)
  const filtersStr = useRef('')

  const [housesResponse, setHousesResponse] = useState<IHousesResponseModel>({} as IHousesResponseModel)



  useEffect(() => {

    (
      async () => {
        await getHouses(1, true)

      }
    )()

  }, [])

  const getHouses = (pageNumber: number = 1, first: boolean = false) => {
    if (!first) {
      setInfoLoading(true)
    }

    let filters = filtersStr.current
    //alert(filters)
    return favoritRepository
      .getAll({ pageNumber: pageNumber, search: filters })
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
    let newHouses = housesResponse?.data.filter(house => house.id !== id)
    setHousesResponse(old => ({ ...old, data: newHouses }))
  }

  if (loading)
    return <div>loading</div>

  return (
    <div className="container py-3">

      <ToastContainer />

      {infoLoading && <Loading />}

      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><Link to={RoutesConstants.home}>Home</Link></li>
          <li className="breadcrumb-item active" aria-current="page">Aluguel</li>
          <li className="breadcrumb-item active" aria-current="page">Meus favoritos</li>
        </ol>
      </nav>
      <FilterContent getFiltersAsUrl={executeWithFilters}>
        <div className="row justify-content-center">
          <div className="col-lg-8 border-right">
            <TitleSecondary text='Meus favoritos' />
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
              {(housesResponse?.data && housesResponse.total > housesResponse?.per_page) &&
                <Pagination
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
        </div>
      </FilterContent>
    </div>
  )
}

export default FavoritPage