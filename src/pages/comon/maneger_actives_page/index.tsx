import { faCheck, faEye, faLock, faLockOpen, faTrash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useEffect, useRef, useState } from 'react'
import Pagination from 'react-js-pagination'
import { Link } from 'react-router-dom'
import { toast, ToastContainer } from 'react-toastify'
import { RoutesConstants } from '../../../helpers/routes_constants'
import ConfirmDialog from '../../../shared/components/confirm_dialog'
import FilterContent from '../../../shared/components/filter_content'
import Loading from '../../../shared/components/loading/loading'
import TitleSecondary from '../../../shared/components/secondart_title'
import { IHousesResponseModel } from '../../../shared/services/models/house_model'
import houseRepository from '../../../shared/services/repository/house_repository'

const ManagerActivesPage = () => {

  const [loading, setLoading] = useState(true)
  const [infoLoading, setInfoLoading] = useState(false)
  const filtersStr = useRef('')
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
    //alert(filters)
    return houseRepository
      .getAnounced({ pageNumber: pageNumber, search: filters})
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
  function handleRemove(id: number) {
    // alert(id)
    ConfirmDialog({
      title: 'Confirmar',
      message: 'Deseja apagar a casa?',
      onConfirm: () => {
        setInfoLoading(true)
        houseRepository
          .deleteById(id)
          .then(Response => {
            let newproducts = housesResponse.data.filter((house) => house.id !== id)
            setHousesResponse(old => ({ ...old, data: newproducts }))
            toast.success('removido com sucesso!')
          })
          .catch(reject => {
            console.log(reject)
            if (reject.status === 0)
              toast.error('Erro de conexao!')
            toast.error('Erro ao remover')
          }).finally(() => {
            setInfoLoading(false)
          })
      }
    })
  }

  function handleStatus(homeId: number, status: boolean) {

    ConfirmDialog({
      title: 'Confirmar',
      message: 'Deseja mudar o estado de bloqueio?',
      onConfirm: () => {
        setInfoLoading(true)
        houseRepository.updateStatus({ homeId: homeId, isBlocked: status })
          .then(Response => {

            let newproducts = housesResponse.data.map(house => {
              if (house.id === homeId) {
                house.isblocked = status
              }
              return house
            })
            setHousesResponse(old => ({ ...old, data: newproducts }))
            toast.success('actualizado com sucesso!')
          })
          .catch(reject => {
            if (reject.status === 0)
              toast.error('Erro de conexao!')
            toast.error('Erro ao actualizar')
          }).finally(() => {
            setInfoLoading(false)
          })
      }
    })
  }

  if (loading)
    return <>loading</>

  return (
    <div className='container'>

      <ToastContainer />

      {infoLoading && <Loading />}

      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><Link to={RoutesConstants.home}>Home</Link></li>
          <li className="breadcrumb-item active" aria-current="page">gerenciador</li>
          <li className="breadcrumb-item active" aria-current="page">casas anunciadas</li>
        </ol>
      </nav>
      <FilterContent getFiltersAsUrl={executeWithFilters} >
        <TitleSecondary text='Casas Anunciadas' />

        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Titulo</th>
                <th scope="col">Data pub.</th>
                <th scope="col">Data Exp.</th>
                <th scope="col">Preço</th>
                <th scope="col">ações</th>

              </tr>
            </thead>
            <tbody>
              {
                housesResponse.data.map(house => {
                  return (
                    <tr key={house.id} className={`${!house.isActive && 'text-bg-warning'}`}>
                      <td >
                        <FontAwesomeIcon icon={faCheck} className='text-primary' />
                      </td>
                      <td>{house.title}</td>
                      <td>{house.created_at}</td>
                      <td>{house.expires_at}</td>
                      <td>{house.price}, 00 MZN</td>
                      <td>
                        <Link to={RoutesConstants.manageInfoHome + house.slug} className='btn tex-primary'>
                          <FontAwesomeIcon icon={faEye} />
                        </Link>

                        <button onClick={() => handleRemove(house.id as number)} className='btn'>
                          <FontAwesomeIcon icon={faTrash} className='text-danger' />
                        </button>

                        <button onClick={() => handleStatus(house.id as number, !house.isblocked)} className='btn border-0' disabled={!house.isActive}>
                          {
                            house.isblocked
                              ? <FontAwesomeIcon className='text-secondary' icon={faLock} />
                              : <FontAwesomeIcon className='text-success' icon={faLockOpen} />
                          }
                        </button>
                        {
                          !house.isActive &&
                          <span className='text-danger fw-bold'>Proibido</span>
                        }
                      </td>
                    </tr>
                  )
                })
              }

            </tbody>
          </table>
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
  )
}

export default ManagerActivesPage