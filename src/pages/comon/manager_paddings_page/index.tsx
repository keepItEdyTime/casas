import { faCheck, faEye, faLock, faTrash, faWarning } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useEffect, useRef, useState } from 'react'
import Pagination from 'react-js-pagination'
import { Link } from 'react-router-dom'
import { toast, ToastContainer } from 'react-toastify'
import { RoutesConstants } from '../../../helpers/routes_constants'
import ConfirmDialog from '../../../shared/components/confirm_dialog'
import FilterContent from '../../../shared/components/filter_content'
import Loading from '../../../shared/components/loading/loading'
import PaymentModal from '../../../shared/components/payment_modal'
import TitleSecondary from '../../../shared/components/secondart_title'
import { IHousesResponseModel } from '../../../shared/services/models/house_model'
import houseRepository from '../../../shared/services/repository/house_repository'

const ManagePaddingsPage = () => {

  const [loading, setLoading] = useState(true)
  const [infoLoading, setInfoLoading] = useState(false)
  const filtersStr = useRef('')
  const [housesResponse, setHousesResponse] = useState<IHousesResponseModel>({} as IHousesResponseModel)
  const [showPaymentModal, setShowPaymentModal] = useState({
    show: false,
    homeId: 0
  });

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
      .getUnitialized({ pageNumber: pageNumber, search: filters})
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
            toast.success('Removido com sucesso!')
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

  function closePaymentModal() {
    setShowPaymentModal(old => ({ ...old, show: false }))
  }
  function handlePaymentSucess(homeId?: number) {
    let newproducts = housesResponse.data.filter((house) => house.id !== homeId)
    setHousesResponse(old => ({ ...old, data: newproducts }))
    closePaymentModal()
  }
  function handleShowPaymentModal(homeId: number) {
    setShowPaymentModal(old => ({ ...old, homeId: homeId, show: true }))
  }
  function handlePaymentOnHide() {
    closePaymentModal()
  }


  if (loading)
    return <div>loading</div>

  return (
    <div className='container'>

      <ToastContainer />

      {infoLoading && <Loading />}

      <PaymentModal
        onSuccess={handlePaymentSucess}
        homeId={showPaymentModal.homeId}
        show={showPaymentModal.show}
        close={closePaymentModal}
        onHide={() => handlePaymentOnHide()}
        normalCancel
      />

      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><Link to={RoutesConstants.home}>Home</Link></li>
          <li className="breadcrumb-item active" aria-current="page">gerenciador</li>
          <li className="breadcrumb-item active" aria-current="page">casas por anunciar</li>
        </ol>
      </nav>
      <FilterContent getFiltersAsUrl={executeWithFilters} >
        <TitleSecondary text='Casas por anunciar' />

        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Titulo</th>
                <th scope="col">Data pub.</th>
                <th scope="col">Preço</th>
                <th scope="col">ações</th>

              </tr>
            </thead>
            <tbody>
              {
                housesResponse?.data.map(house => {
                  return (
                    <tr key={house.id} className={`${!house.isActive && 'text-bg-warning'}`}>
                      <td >
                        {
                          house.isActive
                            ? <FontAwesomeIcon icon={faCheck} className='text-primary' />
                            : <FontAwesomeIcon icon={faWarning} className='text-secondary' />
                        }
                      </td>
                      <td>{house.title}</td>
                      <td>{house.created_at}</td>
                      <td>{house.price}, 00 MZN</td>
                      <td>
                        <Link to={RoutesConstants.manageInfoHome + house.slug} className='btn tex-primary'>
                          <FontAwesomeIcon icon={faEye} />
                        </Link>

                        <button onClick={() => handleRemove(house.id as number)} className='btn' >
                          <FontAwesomeIcon icon={faTrash} className='text-danger' />
                        </button>

                        {
                          house.isActive
                            ?
                            <button onClick={() => handleShowPaymentModal(house.id as number)} className='btn btn-sm btn-outline-success rounded-0 mx-2'>Anunciar</button>
                            : <div className='d-inline-block ms-2'>
                              <FontAwesomeIcon className='text-secondary me-1' icon={faLock} />
                              <span className='text-secondary fw-bold'>Proibido</span>
                            </div>
                        }

                      </td>
                    </tr>
                  )
                })
              }
            </tbody>
          </table>
          <div className="d-flex justify-content-end">
            {
              (housesResponse?.data && housesResponse.total > housesResponse?.per_page) &&
              <Pagination
                totalItemsCount={housesResponse?.total as number}
                activePage={housesResponse?.current_page as number}
                onChange={(pageNumber) => getHouses(pageNumber)}
                itemsCountPerPage={housesResponse?.per_page}
                itemClass='page-item'
                linkClass='page-link rounded-0'
                firstPageText={'Primeiro'}
                lastPageText={'Ultimo'}
              />
            }
          </div>
        </div>
      </FilterContent >
    </div >
  )
}

export default ManagePaddingsPage